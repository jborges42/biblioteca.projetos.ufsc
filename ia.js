/* Biblioteca de Projetos · PPGEAN/UFSC — "Como a IA pode ajudar"
   Cinco motores de simulação (dados fictícios), configurados por projeto em sugestoes-ia.js:
   regressao · classificacao · mapa · agrupamento · texto. */
(() => {
  'use strict';
  const SUG = Object.fromEntries((window.PPGEAN_SUGESTOES_IA?.sugestoes || []).map(s => [s.id, s]));
  const movimento = matchMedia('(prefers-reduced-motion: no-preference)');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // SI: sem separador de milhar até 4 dígitos (anos como 2026, altitudes como 1000 m)
  const fmt = (v, d = 0) => Number(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: Math.abs(v) >= 10000 });
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const hash = s => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const sorteador = seed => () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const gauss = r => (r() + r() + r() + r() - 2) / 1.15; // ~normal(0,1), barato
  const CORES = ['#1659bf', '#00733a', '#9a6200', '#b3261e']; // texto branco sobre elas ≥ 4,5:1
  const ICONE = '<svg class="ico" aria-hidden="true"><use href="#i-ia"/></svg>';
  let geracao = 0, observador = null;
  // Espera que é cancelada quando o leitor troca de projeto; sem animação, não espera.
  const passo = (gen, ms) => new Promise(ok => setTimeout(() => ok(gen === geracao), movimento.matches ? ms : 0));
  const leituraSlider = (e, v) => `${fmt(v, casas(e.passo))} ${e.unidade}`.trim();
  const casas = p => (String(p).split('.')[1] || '').length;

  function slider(e, i) {
    return `<label class="ia-slider"><span class="ia-slider-rot">${esc(e.rotulo)}</span><output>${esc(leituraSlider(e, e.valor))}</output>`
      + `<input type="range" data-i="${i}" min="${e.min}" max="${e.max}" step="${e.passo}" value="${e.valor}" aria-valuetext="${esc(leituraSlider(e, e.valor))}"></label>`;
  }
  function ligarSlider(raiz, E, aoMudar) {
    raiz.querySelectorAll('input[type=range]').forEach(inp => inp.addEventListener('input', () => {
      const e = E[inp.dataset.i], v = +inp.value, txt = leituraSlider(e, v);
      inp.previousElementSibling.textContent = txt;
      inp.setAttribute('aria-valuetext', txt);
      aoMudar(+inp.dataset.i, v);
    }));
  }

  // ---------- 1. Regressão: a IA aprende uma relação e prevê ----------
  function regressao(sim, s, r, gen) {
    const E = s.entradas, S = s.saida, d = S.decimais ?? 1, vals = E.map(e => e.valor), faixaY = S.max - S.min;
    const SIG = t => 1 / (1 + Math.exp(-10 * (t - 0.5))), s0 = SIG(0), s1 = SIG(1);
    const curva = { sigmoide: t => (SIG(t) - s0) / (s1 - s0), saturacao: t => (1 - Math.exp(-3 * t)) / (1 - Math.exp(-3)) }[s.forma] || (t => t);
    const prever = v => {
      let a = 0, b = 0;
      E.forEach((e, i) => { const p = e.peso || 0.5, t = clamp((v[i] - e.min) / (e.max - e.min || 1), 0, 1); a += Math.abs(p) * (p > 0 ? t : 1 - t); b += Math.abs(p); });
      return S.min + faixaY * curva(a / (b || 1));
    };
    const W = 320, H = 200, L = 8, R = 8, T = 10, B = 8;
    const X = x => L + ((x - E[0].min) / (E[0].max - E[0].min || 1)) * (W - L - R);
    const Y = y => H - B - ((y - S.min) / (faixaY || 1)) * (H - T - B);
    const treino = Array.from({ length: 28 }, () => {
      const x = E[0].min + r() * (E[0].max - E[0].min);
      return { x, y: clamp(prever([x, ...E.slice(1).map(e => e.valor)]) + gauss(r) * 0.07 * faixaY, S.min, S.max) };
    });
    const media = treino.reduce((a, p) => a + p.y, 0) / treino.length, erro = 0.06 * faixaY;
    sim.innerHTML = `<div class="ia-reg"><div class="ia-controles">${E.map(slider).join('')}</div>`
      + `<div class="ia-grafico"><p class="ia-eixo-y">${esc(S.rotulo)} (${esc(S.unidade)}) <span>${fmt(S.min, d)} – ${fmt(S.max, d)}</span></p>`
      + `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`Simulação: ${S.rotulo} previsto em função de ${E[0].rotulo}`)}">`
      + `<path class="ia-grade" d="M${L} ${H - B}H${W - R}M${L} ${T}V${H - B}"/><path class="ia-faixa"/>`
      + `<g class="ia-treino">${treino.map((p, i) => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="3.4" style="transition-delay:${i * 22}ms"/>`).join('')}</g>`
      + `<path class="ia-curva"/><line class="ia-guia"/><circle class="ia-atual" r="6"/></svg>`
      + `<p class="ia-eixo-x">${esc(E[0].rotulo)} (${esc(E[0].unidade)}) <span>${fmt(E[0].min, casas(E[0].passo))} – ${fmt(E[0].max, casas(E[0].passo))}</span></p></div>`
      + `<div class="ia-leitura" aria-live="polite"><span>Previsão da IA</span><strong>—</strong><small></small></div>`
      + `<button type="button" class="btn mini ia-repetir">${ICONE}Treinar de novo</button></div>`;
    const svg = sim.querySelector('svg'), $ = c => svg.querySelector(c);
    function desenhar(p) {
      const outros = vals.slice(1), xs = Array.from({ length: 41 }, (_, i) => E[0].min + ((E[0].max - E[0].min) * i) / 40);
      const ys = xs.map(x => media + (prever([x, ...outros]) - media) * p);
      $('.ia-curva').setAttribute('d', xs.map((x, i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(ys[i]).toFixed(1)}`).join(''));
      $('.ia-faixa').setAttribute('d', xs.map((x, i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(Math.min(S.max, ys[i] + erro)).toFixed(1)}`).join('')
        + xs.slice().reverse().map((x, i) => `L${X(x).toFixed(1)} ${Y(Math.max(S.min, ys[xs.length - 1 - i] - erro)).toFixed(1)}`).join('') + 'Z');
      const y = prever(vals), cx = X(vals[0]).toFixed(1), cy = Y(y).toFixed(1);
      $('.ia-atual').setAttribute('cx', cx); $('.ia-atual').setAttribute('cy', cy);
      Object.entries({ x1: cx, x2: cx, y1: Y(S.min), y2: cy }).forEach(([k, v]) => $('.ia-guia').setAttribute(k, v));
      sim.querySelector('.ia-leitura strong').textContent = `${fmt(y, d)}${S.unidade === '%' ? '' : ' '}${S.unidade}`;
      sim.querySelector('.ia-leitura small').textContent = `margem simulada ± ${fmt(erro, d)}`;
    }
    ligarSlider(sim, E, (i, v) => { vals[i] = v; desenhar(1); });
    desenhar(0);
    async function animar() {
      svg.classList.remove('pronto', 'mostrar'); desenhar(0);
      void svg.getBoundingClientRect();
      svg.classList.add('mostrar');
      if (!(await passo(gen, 700))) return;
      const t0 = performance.now(), dur = movimento.matches ? 900 : 0;
      await new Promise(ok => {
        const quadro = t => {
          if (gen !== geracao) return ok();
          const p = dur ? Math.min(1, (t - t0) / dur) : 1;
          desenhar(1 - (1 - p) ** 3);
          if (p < 1) requestAnimationFrame(quadro); else ok();
        };
        requestAnimationFrame(quadro);
      });
      svg.classList.add('pronto');
    }
    sim.querySelector('.ia-repetir').addEventListener('click', animar);
    return { animar };
  }

  // ---------- 2. Classificação: visão computacional ----------
  const GLIFO = {
    colembolo: '<ellipse cx="32" cy="33" rx="15" ry="6" fill="#8d7b68"/><circle cx="16" cy="31" r="4.5" fill="#6d5c4b"/><path d="M13 28 6 20M15 27l-3-10M46 36l8 6M46 35l9 1M22 38l-3 6M28 39l-1 6M34 39l1 6" stroke="#6d5c4b" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
    acaro: '<path d="M22 26 12 18M21 31H9M22 36l-10 7M24 40l-6 10M42 26l10-8M43 31h12M42 36l10 7M40 40l6 10" stroke="#7a3322" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="32" cy="33" r="11" fill="#b24a2e"/><circle cx="32" cy="21" r="4" fill="#8a3522"/>',
    minhoca: '<path d="M8 40c8-14 14 8 22-6s14 6 26-8" stroke="#d98a7a" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M30 31l3 6" stroke="#b5655a" stroke-width="5" stroke-linecap="round"/>',
    formiga: '<path d="M27 30 19 22M27 34l-9 2M28 37l-6 8M37 30l7-8M37 34l9 2M36 37l6 8M14 22l-4-6M17 21l-1-7" stroke="#2b1a10" stroke-width="1.6" stroke-linecap="round" fill="none"/><circle cx="18" cy="26" r="5" fill="#2b1a10"/><ellipse cx="31" cy="32" rx="6" ry="4.5" fill="#3b2516"/><ellipse cx="46" cy="36" rx="9" ry="7" fill="#2b1a10"/>',
    besouro: '<path d="M22 26 12 20M21 34H10M23 42l-8 7M42 26l10-6M43 34h11M41 42l8 7" stroke="#1f2a1c" stroke-width="2" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="36" rx="12" ry="15" fill="#2f4a2a"/><path d="M32 23v28" stroke="#9fc48a" stroke-width="1.2"/><circle cx="32" cy="19" r="5.5" fill="#1f2a1c"/>',
    cupim: '<path d="M25 30 17 25M25 35H15M27 40l-6 7M39 30l8-5M39 35h10M37 40l6 7" stroke="#a0754a" stroke-width="1.6" stroke-linecap="round" fill="none"/><ellipse cx="34" cy="36" rx="13" ry="8" fill="#ead8b5"/><ellipse cx="18" cy="33" rx="7" ry="6" fill="#b5651d"/>',
    aranha: '<path d="M30 30 18 14 8 18M30 32 14 26 6 32M30 35 14 40 8 50M31 37 22 48 18 58M34 30l12-16 10 4M34 32l16-6 8 6M34 35l16 5 6 10M33 37l9 11 4 10" stroke="#3a2a22" stroke-width="1.6" stroke-linecap="round" fill="none"/><circle cx="32" cy="32" r="6" fill="#4a3428"/><ellipse cx="32" cy="45" rx="8" ry="9" fill="#3a2a22"/>',
    'folha-oval': '<path d="M32 8C50 18 52 44 32 58 12 44 14 18 32 8Z" fill="#2e7d32"/><path d="M32 12v44M32 26l9-6M32 34l10-6M32 42l9-5M32 26l-9-6M32 34l-10-6M32 42l-9-5" stroke="#a5d6a7" stroke-width="1.2" fill="none"/><path d="M47 22l3 2M50 32l3 1M48 42l3 0M17 22l-3 2M14 32l-3 1M16 42l-3 0" stroke="#2e7d32" stroke-width="2"/>',
    'folha-lanceolada': '<path d="M32 4C40 20 40 44 32 60 24 44 24 20 32 4Z" fill="#558b2f"/><path d="M32 8v50" stroke="#c5e1a5" stroke-width="1.2"/>',
    'folha-espinhosa': '<path d="M32 6l5 7 7-2-1 8 8 3-5 6 6 6-8 3 2 8-8-1-2 8-4-6-4 6-2-8-8 1 2-8-8-3 6-6-5-6 8-3-1-8 7 2Z" fill="#1b5e20"/><path d="M32 10v46" stroke="#a5d6a7" stroke-width="1.2"/>',
    'celula-normal': '<rect x="12" y="16" width="40" height="32" rx="10" fill="#f6d4dc" stroke="#c48b9f" stroke-width="1.5"/><circle cx="32" cy="32" r="8" fill="#7b4f8c"/>',
    'celula-micronucleo': '<rect x="12" y="16" width="40" height="32" rx="10" fill="#f6d4dc" stroke="#c48b9f" stroke-width="1.5"/><circle cx="29" cy="32" r="8" fill="#7b4f8c"/><circle cx="43" cy="25" r="3" fill="#5a2f6c"/>',
    'celula-ponte': '<rect x="8" y="18" width="48" height="28" rx="10" fill="#f6d4dc" stroke="#c48b9f" stroke-width="1.5"/><ellipse cx="19" cy="32" rx="5" ry="8" fill="#7b4f8c"/><ellipse cx="45" cy="32" rx="5" ry="8" fill="#7b4f8c"/><path d="M23 32h18" stroke="#5a2f6c" stroke-width="2.4"/>',
    abelha: '<ellipse cx="25" cy="22" rx="10" ry="6" fill="#ffffff" opacity=".85" transform="rotate(-25 25 22)"/><ellipse cx="38" cy="21" rx="10" ry="6" fill="#ffffff" opacity=".8" transform="rotate(25 38 21)"/><ellipse cx="32" cy="34" rx="15" ry="10" fill="#f2b705"/><path d="M27 25v18M34 25v18" stroke="#1f1a17" stroke-width="3.4"/><circle cx="47" cy="33" r="5" fill="#1f1a17"/>',
  };
  const fundoGlifo = f => (f.startsWith('celula') ? '#fbeef2' : f.startsWith('folha') ? '#f3f8ef' : f === 'abelha' ? '#fff6dc' : '#efe4cf');

  function classificacao(sim, s, r, gen) {
    const C = s.classes, n = 12, idx = [];
    C.forEach((_, i) => idx.push(i, i));
    while (idx.length < n) idx.push(Math.floor(r() * C.length));
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const duvida = Math.floor(r() * n), conf = idx.map((_, i) => (i === duvida ? 52 + Math.floor(r() * 14) : 86 + Math.floor(r() * 13)));
    const giro = idx.map(() => Math.round((r() - 0.5) * 70));
    sim.innerHTML = `<div class="ia-clas"><p class="ia-nota">${n} imagens · ${esc(s.amostra)}</p>`
      + `<ul class="ia-amostras">${idx.map((c, i) => `<li class="ia-amostra" aria-label="Imagem ${i + 1}, ainda não analisada"><svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${fundoGlifo(C[c].forma)}"/><g transform="rotate(${giro[i]} 32 32)">${GLIFO[C[c].forma] || GLIFO.acaro}</g></svg><span class="ia-chip"></span></li>`).join('')}</ul>`
      + `<button type="button" class="btn primario ia-repetir">${ICONE}Identificar com IA</button><div class="ia-contagem" aria-live="polite"></div></div>`;
    const itens = [...sim.querySelectorAll('.ia-amostra')], saida = sim.querySelector('.ia-contagem');
    async function animar() {
      itens.forEach((li, i) => { li.className = 'ia-amostra'; li.querySelector('.ia-chip').textContent = ''; li.setAttribute('aria-label', `Imagem ${i + 1}, ainda não analisada`); });
      saida.innerHTML = '';
      const cont = C.map(() => 0);
      for (let i = 0; i < n; i++) {
        const li = itens[i], c = C[idx[i]];
        li.classList.add('escaneando');
        if (!(await passo(gen, 230))) return;
        li.classList.remove('escaneando');
        li.classList.add('feito');
        if (i === duvida) {
          li.classList.add('duvida');
          li.querySelector('.ia-chip').textContent = `Revisar · ${conf[i]}%`;
          li.setAttribute('aria-label', `Imagem ${i + 1}: confiança baixa (${conf[i]}%), separada para revisão`);
        } else {
          cont[idx[i]]++;
          li.querySelector('.ia-chip').textContent = `${c.nome} · ${conf[i]}%`;
          li.setAttribute('aria-label', `Imagem ${i + 1}: ${c.nome}, ${conf[i]}% de confiança`);
        }
      }
      saida.innerHTML = `<ul class="ia-barras">${C.map((c, i) => `<li><span>${esc(c.nome)}</span><b style="--v:${(cont[i] / n) * 100}%;--cor:${CORES[i % 4]}"></b><em>${cont[i]}</em></li>`).join('')}</ul>`
        + `<p class="ia-nota">1 imagem com confiança baixa foi separada para revisão de especialista — a IA acelera, a pessoa confirma.</p>`;
    }
    sim.querySelector('.ia-repetir').addEventListener('click', animar);
    return { animar };
  }

  // ---------- 3. Mapa: a IA processa imagens/dados espaciais ----------
  const RAMPA = [[239, 230, 210], [201, 223, 168], [124, 195, 90], [46, 139, 58], [29, 92, 58]];
  const corRampa = v => {
    const p = clamp(v, 0, 1) * (RAMPA.length - 1), i = Math.min(RAMPA.length - 2, Math.floor(p)), f = p - i;
    return `rgb(${RAMPA[i].map((c, k) => Math.round(c + (RAMPA[i + 1][k] - c) * f)).join(',')})`;
  };
  function mapa(sim, s, r, gen) {
    const NC = 30, NL = 18, ctl = s.controle, modo = s.modo || 'tempo';
    // ondas em direções variadas (sinal aleatório) formam manchas orgânicas em vez de listras
    const ondas = () => Array.from({ length: 7 }, () => ({ fx: (r() < 0.5 ? -1 : 1) * (0.08 + r() * 0.3), fy: (r() < 0.5 ? -1 : 1) * (0.08 + r() * 0.3), f: r() * 6.28, a: 0.4 + r() }));
    const O1 = ondas(), O2 = ondas();
    const campo = (O, x, y) => { let v = 0, t = 0; for (const o of O) { v += o.a * Math.sin(o.fx * x + o.fy * y + o.f); t += o.a; } return (v / t + 1) / 2; };
    const cel = Array.from({ length: NC * NL }, (_, i) => ({ x: i % NC, y: Math.floor(i / NC), ganho: r() < 0.2 ? r() * 0.08 : 0.25 + r() * 0.55 }));
    cel.forEach(c => { c.base = campo(O1, c.x, c.y); });
    const marcadores = modo === 'acesso' ? Array.from({ length: 10 }, () => ({ x: 2 + Math.floor(r() * (NC - 4)), y: 2 + Math.floor(r() * (NL - 4)) })) : [];
    let valor = ctl.valor;
    const tN = () => clamp((valor - ctl.min) / (ctl.max - ctl.min || 1), 0, 1);
    const ALTO = 0.6;
    function estado() {
      const t = tN();
      if (modo === 'sobreposicao') {
        const cat = cel.map(c => (campo(O1, c.x, c.y + t * 6) > 0.55 + t * 0.06 ? 1 : 0) + (campo(O2, c.x - t * 8, c.y) > 0.55 + t * 0.06 ? 2 : 0));
        const ambos = cat.filter(v => v === 3).length, algum = cat.filter(v => v).length;
        return { cores: cat.map(v => ['#eef1ec', '#1659bf', '#e0a800', '#00923f'][v]), pct: algum ? (100 * ambos) / algum : 0 };
      }
      if (modo === 'acesso') {
        const raio = 1 + t * 5, ok = marcadores.map(m => cel.some(c => c.base > 0.72 && Math.hypot(c.x - m.x, c.y - m.y) <= raio));
        return { cores: cel.map(c => corRampa(c.base)), pct: (100 * ok.filter(Boolean).length) / marcadores.length, ok, raio };
      }
      const efeito = s.efeito || 'recupera';
      const v = cel.map(c => efeito === 'contrai' ? clamp(c.base - t * 0.5 * (0.35 + (0.65 * c.y) / NL), 0, 1)
        : efeito === 'desloca' ? campo(O1, c.x - t * 9, c.y + t * 3)
        : clamp(c.base * 0.55 + t * c.ganho, 0, 1));
      const pct = efeito === 'desloca'
        ? (() => { const ini = cel.filter(c => c.base >= ALTO); return ini.length ? (100 * ini.filter(c => v[cel.indexOf(c)] >= ALTO).length) / ini.length : 0; })()
        : (100 * v.filter(x => x >= ALTO).length) / v.length;
      return { cores: v.map(corRampa), pct };
    }
    const legenda = modo === 'sobreposicao'
      ? `<span><i style="background:#1659bf"></i>${esc(s.especies.a)}</span><span><i style="background:#e0a800"></i>${esc(s.especies.b)}</span><span><i style="background:#00923f"></i>Ambos</span>`
      : `<span class="ia-rampa"><em>${esc(s.camada.baixo)}</em><i></i><em>${esc(s.camada.alto)}</em></span>${modo === 'acesso' ? `<span><i class="ia-pino"></i>${esc(s.marcadores)}</span>` : ''}`;
    sim.innerHTML = `<div class="ia-mapa"><p class="ia-nota">${modo === 'sobreposicao' ? 'Áreas adequadas previstas pela IA' : esc(s.camada.rotulo)}</p>`
      + `<svg viewBox="0 0 ${NC * 10} ${NL * 10}" role="img" aria-label="${esc(`Mapa simulado: ${s.indicador}`)}"><g class="ia-celulas">${cel.map((c, i) => `<rect x="${c.x * 10}" y="${c.y * 10}" width="10.4" height="10.4" style="transition-delay:${c.y * 35}ms"/>`).join('')}</g><g class="ia-pinos"></g></svg>`
      + `<p class="ia-legenda-mapa">${legenda}</p><div class="ia-controles">${slider(ctl, 0)}</div>`
      + `<div class="ia-leitura" aria-live="polite"><strong>—</strong><span class="ia-ind">${esc(s.indicador)}</span></div>`
      + `<button type="button" class="btn mini ia-repetir">${ICONE}Reproduzir</button></div>`;
    const svg = sim.querySelector('svg'), rects = [...svg.querySelectorAll('rect')], pinos = svg.querySelector('.ia-pinos'), input = sim.querySelector('input');
    function desenhar() {
      const e = estado();
      rects.forEach((rc, i) => rc.setAttribute('fill', e.cores[i]));
      if (modo === 'acesso') {
        pinos.innerHTML = marcadores.map(m => `<circle class="ia-raio" cx="${m.x * 10 + 5}" cy="${m.y * 10 + 5}" r="${(e.raio * 10).toFixed(1)}"/>`).join('')
          + marcadores.map((m, i) => `<circle class="ia-pino ${e.ok[i] ? 'ok' : 'nao'}" cx="${m.x * 10 + 5}" cy="${m.y * 10 + 5}" r="4.5"/>`).join('');
      }
      sim.querySelector('.ia-leitura strong').textContent = `${fmt(e.pct)}%`;
    }
    ligarSlider(sim, [ctl], (_, v) => { valor = v; desenhar(); });
    desenhar();
    async function animar() {
      svg.classList.remove('mostrar'); void svg.getBoundingClientRect(); svg.classList.add('mostrar');
      if (!(await passo(gen, 900))) return;
      const ini = ctl.min, fim = ctl.max, passos = Math.max(1, Math.round((fim - ini) / ctl.passo)), cada = Math.max(60, 2600 / passos);
      for (let k = 0; k <= passos; k++) {
        valor = ini + k * ctl.passo; input.value = valor; input.dispatchEvent(new Event('input'));
        if (!(await passo(gen, cada))) return;
      }
    }
    sim.querySelector('.ia-repetir').addEventListener('click', animar);
    return { animar };
  }

  // ---------- 4. Agrupamento: k-means animado ----------
  function agrupamento(sim, s, r, gen) {
    const K = s.grupos.length, N = 48, W = 320, H = 200, M = 12;
    const centros = Array.from({ length: K }, (_, k) => { const t = (k + 0.5) / K; return { x: 0.1 + t * 0.8 + (r() - 0.5) * 0.08, y: 0.1 + t * 0.8 + (r() - 0.5) * 0.2 }; });
    const pts = Array.from({ length: N }, (_, i) => { const c = centros[i % K]; return { x: clamp(c.x + gauss(r) * 0.065, 0.02, 0.98), y: clamp(c.y + gauss(r) * 0.075, 0.02, 0.98) }; });
    const X = v => M + v * (W - 2 * M), Y = v => H - M - v * (H - 2 * M);
    sim.innerHTML = `<div class="ia-grupos"><p class="ia-eixo-y">${esc(s.eixos.y)}</p>`
      + `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`Simulação: ${N} itens (${s.item}) agrupados pela IA em ${K} perfis`)}"><path class="ia-grade" d="M${M} ${H - M}H${W - M}M${M} ${M}V${H - M}"/>`
      + `<g>${pts.map(p => `<circle class="ia-pt" cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="4.2"/>`).join('')}</g><g class="ia-centros"></g></svg>`
      + `<p class="ia-eixo-x">${esc(s.eixos.x)}</p><ul class="ia-legenda-grupos" aria-live="polite"></ul>`
      + `<button type="button" class="btn primario ia-repetir">${ICONE}Agrupar com IA</button></div>`;
    const circ = [...sim.querySelectorAll('.ia-pt')], gC = sim.querySelector('.ia-centros'), leg = sim.querySelector('.ia-legenda-grupos');
    async function animar() {
      const rr = sorteador(hash(s.id + ':kmeans')), sorteio = [...pts.keys()];
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [sorteio[i], sorteio[j]] = [sorteio[j], sorteio[i]]; }
      let cs = sorteio.slice(0, K).map(i => ({ ...pts[i] })), grupo = pts.map(() => 0);
      circ.forEach(c => { c.style.fill = ''; });
      leg.innerHTML = '';
      gC.innerHTML = cs.map((_, k) => `<g class="ia-centro" style="--cor:${CORES[k % 4]}"><path d="M-7 0H7M0-7V7" /><circle r="5"/></g>`).join('');
      const marcas = [...gC.children];
      const moverCentros = () => marcas.forEach((g, k) => { g.style.transform = `translate(${X(cs[k].x).toFixed(1)}px, ${Y(cs[k].y).toFixed(1)}px)`; });
      moverCentros();
      for (let it = 0; it < 8; it++) {
        const novo = pts.map(p => cs.reduce((m, c, k) => (Math.hypot(p.x - c.x, p.y - c.y) < Math.hypot(p.x - cs[m].x, p.y - cs[m].y) ? k : m), 0));
        const mudou = novo.some((g, i) => g !== grupo[i]);
        grupo = novo;
        circ.forEach((c, i) => { c.style.fill = CORES[grupo[i] % 4]; });
        if (!(await passo(gen, 450))) return;
        cs = cs.map((c, k) => { const m = pts.filter((_, i) => grupo[i] === k); return m.length ? { x: m.reduce((a, p) => a + p.x, 0) / m.length, y: m.reduce((a, p) => a + p.y, 0) / m.length } : c; });
        moverCentros();
        if (!(await passo(gen, 450))) return;
        if (!mudou && it) break;
      }
      // nomeia os grupos do perfil "baixo-baixo" ao "alto-alto", como descrito na sugestão
      const ordem = cs.map((c, k) => k).sort((a, b) => cs[a].x + cs[a].y - (cs[b].x + cs[b].y));
      ordem.forEach((k, pos) => { marcas[k].style.setProperty('--cor', CORES[pos % 4]); circ.forEach((c, i) => { if (grupo[i] === k) c.style.fill = CORES[pos % 4]; }); });
      leg.innerHTML = ordem.map((k, pos) => `<li><i style="background:${CORES[pos % 4]}"></i>${esc(s.grupos[pos].nome)} <em>${grupo.filter(g => g === k).length}</em></li>`).join('');
    }
    sim.querySelector('.ia-repetir').addEventListener('click', animar);
    return { animar };
  }

  // ---------- 5. Texto: processamento de linguagem natural ----------
  function texto(sim, s, r, gen) {
    const marcas = [];
    for (const e of s.entidades) {
      const i = s.trecho.indexOf(e.termo);
      if (i >= 0 && !marcas.some(m => i < m.f && i + e.termo.length > m.i)) marcas.push({ i, f: i + e.termo.length, tipo: e.tipo });
    }
    marcas.sort((a, b) => a.i - b.i);
    let html = '', pos = 0;
    marcas.forEach(m => {
      const k = Math.max(0, s.tipos.indexOf(m.tipo));
      html += esc(s.trecho.slice(pos, m.i)) + `<mark class="ia-ent" style="--cor:${CORES[k % 4]}">${esc(s.trecho.slice(m.i, m.f))}<span class="ia-ent-tipo">${esc(m.tipo)}</span></mark>`;
      pos = m.f;
    });
    html += esc(s.trecho.slice(pos));
    sim.innerHTML = `<div class="ia-texto"><blockquote class="ia-doc">${html}</blockquote>`
      + `<p class="ia-legenda-mapa">${s.tipos.map((t, k) => `<span><i style="background:${CORES[k % 4]}"></i>${esc(t)}</span>`).join('')}</p>`
      + `<ul class="ia-barras ia-temas">${s.temas.map(t => `<li><span>${esc(t.nome)}</span><b style="--v:0%;--cor:#1659bf"></b><em>${fmt(t.peso * 100)}%</em></li>`).join('')}</ul>`
      + `<button type="button" class="btn primario ia-repetir">${ICONE}Analisar com IA</button></div>`;
    const ms = [...sim.querySelectorAll('.ia-ent')], barras = [...sim.querySelectorAll('.ia-temas b')];
    async function animar() {
      ms.forEach(m => m.classList.remove('ativa'));
      barras.forEach(b => b.style.setProperty('--v', '0%'));
      for (const m of ms) { m.classList.add('ativa'); if (!(await passo(gen, 260))) return; }
      barras.forEach((b, i) => b.style.setProperty('--v', `${s.temas[i].peso * 100}%`));
    }
    sim.querySelector('.ia-repetir').addEventListener('click', animar);
    return { animar };
  }

  const MOTORES = { regressao, classificacao, mapa, agrupamento, texto };

  function montar(alvo, w, { soTitulo = false } = {}) {
    geracao++;
    observador?.disconnect();
    const s = SUG[w.id];
    alvo.hidden = !s;
    if (!s || !MOTORES[s.motor]) { alvo.innerHTML = ''; return; }
    alvo.innerHTML = `<section class="ia" aria-labelledby="ia-titulo"><p class="ia-selo">${ICONE}Como a IA pode ajudar</p>`
      + `<h3 id="ia-titulo">${esc(s.titulo)}</h3><p class="ia-ideia">${esc(s.ideia)}</p><p class="ia-tecnica"><span>Técnica</span>${esc(s.tecnica)}</p>`
      + `<div class="ia-sim" data-motor="${s.motor}"></div>`
      + `<p class="ia-beneficio"><strong>Ganho esperado:</strong> ${esc(s.beneficio)}</p>`
      + `<p class="ia-aviso">Simulação ilustrativa com dados fictícios${soTitulo ? ', sugerida a partir do título do projeto' : ''}: mostra uma possibilidade de uso de IA e não representa resultados da pesquisa.</p></section>`;
    const sim = alvo.querySelector('.ia-sim'), gen = geracao;
    const { animar } = MOTORES[s.motor](sim, s, sorteador(hash(w.id + ':ia')), gen);
    // A animação começa quando a simulação aparece na tela do leitor
    if (!('IntersectionObserver' in window)) { animar(); return; }
    observador = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return;
      observador.disconnect();
      if (gen === geracao) animar();
    }, { root: alvo.closest('.leitor-rolagem'), threshold: 0.35 });
    observador.observe(sim);
  }

  window.PPGEAN_IA = { tem: id => !!SUG[id], sugestao: id => SUG[id], montar, parar: () => { geracao++; observador?.disconnect(); } };
})();
