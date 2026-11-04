/* Biblioteca de Projetos · PPGEAN/UFSC */
(() => {
  'use strict';
  const D = window.PPGEAN;
  if (!D) { document.getElementById('estantes').textContent = 'Não foi possível carregar os dados (trabalhos.js).'; return; }

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const movimento = matchMedia('(prefers-reduced-motion: no-preference)');
  const store = {
    get: k => { try { return localStorage.getItem('ppgean:' + k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem('ppgean:' + k, v); } catch { /* armazenamento indisponível */ } },
  };
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  // Texto puro de um trecho HTML dos dados (remove <em> e decodifica entidades como &amp;)
  const semTags = h => { const t = document.createElement('template'); t.innerHTML = String(h ?? ''); return t.content.textContent; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icone = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const comparar = new Intl.Collator('pt-BR', { sensitivity: 'base' }).compare;

  // ---------- Dados ----------
  const temaPorId = Object.fromEntries(D.temas.map(t => [t.id, t]));
  const STATUS = { resumo: 'Resumo disponível', titulo: 'Resumo em breve', 'a-definir': 'Projeto em definição' };
  const RANK = { resumo: 0, titulo: 1, 'a-definir': 2 };
  const NIVEIS = ['Mestrado', 'Doutorado'];
  const trabalhos = D.trabalhos.map(w => ({
    ...w,
    temas: w.temas || [],
    tituloTxt: semTags(w.titulo),
    busca: norm([semTags(w.titulo), w.autor, w.orientador, ...(w.coorientadores || []), ...(w.palavrasChave || []).map(semTags),
      ...(w.resumo || []).map(semTags), ...(w.temas || []).map(t => temaPorId[t]?.rotulo), w.nivel, 'ingresso ' + w.ingresso, w.financiamento]
      .filter(Boolean).join(' ')),
  }));
  const porId = new Map(trabalhos.map(w => [w.id, w]));
  const comResumo = trabalhos.filter(w => w.status === 'resumo');

  // ---------- Capas: paisagens do Planalto Serrano (elementos do logo PPGEAN), uma por projeto ----------
  const hash = s => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const sorteador = seed => () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const f1 = n => Math.round(n * 10) / 10;
  const CEUS = [['#79c2e6', '#e4f4f1'], ['#1659bf', '#9fd3ec'], ['#f2b43c', '#fbe6b8'], ['#a5bfcc', '#eef2ee'], ['#0f4098', '#62a9d9'], ['#cdeae5', '#ffffff']];
  let uid = 0;

  function morro(W, H, y, ondas, cor, r, amp) {
    const fase = r() * Math.PI * 2;
    amp = amp ?? H * (0.02 + r() * 0.035);
    let d = `M0 ${H}`;
    for (let i = 0; i <= 30; i++) { const x = (W * i) / 30; d += `L${f1(x)} ${f1(y + Math.sin((x / W) * Math.PI * ondas + fase) * amp)}`; }
    return `<path d="${d}L${W} ${H}Z" fill="${cor}"/>`;
  }
  const nuvem = (x, y, e) => `<g fill="#fff" opacity=".92"><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(26 * e)}" ry="${f1(11 * e)}"/><circle cx="${f1(x - 8 * e)}" cy="${f1(y - 7 * e)}" r="${f1(11 * e)}"/><circle cx="${f1(x + 9 * e)}" cy="${f1(y - 9 * e)}" r="${f1(13 * e)}"/></g>`;
  function araucaria(x, base, e, cor) {
    const topo = base - 120 * e, sw = f1(2.2 * e);
    let s = `<g fill="${cor}" stroke="${cor}" stroke-linecap="round"><path d="M${f1(x)} ${f1(base)}V${f1(topo)}" stroke-width="${f1(3.4 * e)}" fill="none"/>`;
    for (const [dy, lg] of [[22, 30], [12, 22], [3, 13]]) {
      const y = topo + dy * e;
      for (const sg of [-1, 1]) {
        const ex = x + sg * lg * e, ey = y - 11 * e;
        s += `<path d="M${f1(x)} ${f1(y + 7 * e)}Q${f1(x + sg * lg * 0.55 * e)} ${f1(y + 5 * e)} ${f1(ex)} ${f1(ey)}" stroke-width="${sw}" fill="none"/><ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="${f1(7.5 * e)}" ry="${f1(4.2 * e)}" stroke="none"/>`;
      }
    }
    return s + `<ellipse cx="${f1(x)}" cy="${f1(topo - 3 * e)}" rx="${f1(8 * e)}" ry="${f1(4.5 * e)}" stroke="none"/></g>`;
  }
  const desenhaFolha = (x, y, L, ang, cor) => {
    const t = `transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"`;
    return `<path d="M0 0C${f1(L * 0.3)} ${f1(-L * 0.36)} ${f1(L * 0.75)} ${f1(-L * 0.36)} ${f1(L)} 0C${f1(L * 0.75)} ${f1(L * 0.36)} ${f1(L * 0.3)} ${f1(L * 0.36)} 0 0Z" fill="${cor}" ${t}/><path d="M0 0H${f1(L * 0.9)}" stroke="#fff" stroke-opacity=".45" stroke-width="${f1(Math.max(1, L * 0.035))}" ${t}/>`;
  };
  const flor5 = (x, y, rr, cor) => {
    let s = `<g fill="${cor}">`;
    for (let i = 0; i < 5; i++) { const a = (i * 72 * Math.PI) / 180; s += `<circle cx="${f1(x + Math.cos(a) * rr)}" cy="${f1(y + Math.sin(a) * rr)}" r="${f1(rr * 0.7)}"/>`; }
    return s + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr * 0.6)}" fill="#f2b705"/></g>`;
  };
  const abelhaSvg = (x, y, e) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(e)})"><ellipse cx="-3" cy="-7" rx="6" ry="4" fill="#fff" opacity=".9" transform="rotate(-25 -3 -7)"/><ellipse cx="4" cy="-7" rx="6" ry="4" fill="#fff" opacity=".85" transform="rotate(25 4 -7)"/><ellipse rx="9" ry="6" fill="#f2b705"/><path d="M-3-5.6v11.2M2-5.8v11.6" stroke="#1f1a17" stroke-width="2.4"/><circle cx="9" cy="-1" r="3.2" fill="#1f1a17"/></g>`;
  const gota = (x, y, e, cor) => `<path d="M${f1(x)} ${f1(y - 10 * e)}C${f1(x + 7 * e)} ${f1(y - e)} ${f1(x + 7 * e)} ${f1(y + 7 * e)} ${f1(x)} ${f1(y + 7 * e)}S${f1(x - 7 * e)} ${f1(y - e)} ${f1(x)} ${f1(y - 10 * e)}Z" fill="${cor}" opacity=".9"/>`;

  // Cada tema escolhe um motivo; o primeiro tema do projeto define a capa.
  const MOTIVOS = {
    araucaria({ W, H, hz, r, R, k, larg }) {
      const n = Math.round((3 + r() * 4) * larg);
      let s = '';
      Array.from({ length: n }, () => ({ x: R(0.04, 0.96) * W, e: R(0.45, 1.05) }))
        .sort((a, b) => a.e - b.e)
        .forEach(a => { s += araucaria(a.x, hz + H * 0.04 + (a.e - 0.45) * H * 0.18, a.e * k, a.e > 0.8 ? '#002c0d' : '#1d5c3a'); });
      return s + morro(W, H, H * 0.86, R(1, 2), '#3f9a2a', r);
    },
    solo({ W, H, r, R, k }) {
      const y0 = H * R(0.58, 0.64);
      let s = morro(W, H, y0 - 6 * k, 2, '#3f9a2a', r, 4 * k);
      const camadas = ['#4a2f1b', '#6b4426', '#8a5a32', '#a87643'];
      camadas.forEach((c, i) => { s += morro(W, H, y0 + i * ((H - y0) / camadas.length), R(1, 3), c, r, 3 * k); });
      for (let i = 0; i < 6; i++) { const x = R(0.08, 0.92) * W; s += `<path d="M${f1(x)} ${f1(y0)}q${f1(R(-12, 12) * k)} ${f1(R(20, 34) * k)} ${f1(R(-18, 18) * k)} ${f1(R(40, 70) * k)}" stroke="#e2c79f" stroke-width="${f1(1.4 * k)}" fill="none" opacity=".75"/>`; }
      for (let i = 0; i < 22; i++) s += `<ellipse cx="${f1(R(0, W))}" cy="${f1(R(y0 + 14 * k, H - 4))}" rx="${f1(R(1.6, 3.2) * k)}" ry="${f1(R(1, 1.8) * k)}" fill="#f4dfb9" opacity=".85"/>`;
      for (let i = 0; i < 18; i++) { const x = R(0, W); s += `<path d="M${f1(x)} ${f1(y0 - 4 * k)}l${f1(R(-3, 3) * k)} ${f1(-R(6, 14) * k)}" stroke="#2f7d22" stroke-width="${f1(1.6 * k)}" stroke-linecap="round"/>`; }
      return s;
    },
    broto({ W, H, r, R, k, larg }) {
      let s = morro(W, H, H * 0.7, 1.5, '#7a5a3a', r, 6 * k) + morro(W, H, H * 0.78, 2, '#3f9a2a', r, 5 * k);
      const n = Math.round((5 + r() * 4) * larg);
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * W + R(-8, 8) * k, base = H * R(0.82, 0.92), h = R(18, 40) * k * (0.6 + i / n);
        const l1 = [f1(x - 7 * k), f1(base - h + 2 * k)], l2 = [f1(x + 7 * k), f1(base - h + 6 * k)];
        s += `<g fill="#6cc04a"><path d="M${f1(x)} ${f1(base)}V${f1(base - h)}" stroke="#1f6b2a" stroke-width="${f1(2 * k)}" stroke-linecap="round"/><ellipse cx="${l1[0]}" cy="${l1[1]}" rx="${f1(8 * k)}" ry="${f1(3.6 * k)}" transform="rotate(-30 ${l1[0]} ${l1[1]})"/><ellipse cx="${l2[0]}" cy="${l2[1]}" rx="${f1(8 * k)}" ry="${f1(3.6 * k)}" transform="rotate(30 ${l2[0]} ${l2[1]})"/></g>`;
      }
      return s;
    },
    abelha({ W, H, hz, r, R, k, pick, larg }) {
      const L = 13 * k, ox = W * R(0.55, 0.72), oy = H * R(0.07, 0.16);
      let favo = '';
      for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
        if (r() < 0.2) continue;
        const cx = ox + col * Math.sqrt(3) * L + (row % 2) * (Math.sqrt(3) * L) / 2, cy = oy + row * 1.5 * L;
        for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i + Math.PI / 6; favo += `${i ? 'L' : 'M'}${f1(cx + L * Math.cos(a))} ${f1(cy + L * Math.sin(a))}`; }
        favo += 'Z';
      }
      let s = `<path d="${favo}" fill="#fee300" fill-opacity=".6" stroke="#e0a800" stroke-width="${f1(1.5 * k)}"/>`;
      s += morro(W, H, H * 0.86, 2, '#3f9a2a', r, 4 * k);
      for (let i = 0, n = Math.round(10 * larg); i < n; i++) s += flor5(R(0, W), R(hz + 18 * k, H - 8 * k), R(3, 6) * k, pick(['#ffffff', '#fee300', '#f29c38', '#e8577d']));
      const bx = W * R(0.18, 0.42), by = H * R(0.3, 0.42);
      s += `<path d="M${f1(bx - 60 * k)} ${f1(by + 40 * k)}C${f1(bx - 30 * k)} ${f1(by - 10 * k)} ${f1(bx - 10 * k)} ${f1(by + 30 * k)} ${f1(bx)} ${f1(by)}" fill="none" stroke="#fff" stroke-width="${f1(1.6 * k)}" stroke-dasharray="${f1(4 * k)} ${f1(4 * k)}" opacity=".9"/>`;
      return s + abelhaSvg(bx, by, k) + abelhaSvg(bx + R(40, 80) * k, by + R(-30, 30) * k, k * 0.75);
    },
    uva({ W, H, hz, r, R, k }) {
      const y0 = hz + 6 * k, vx = W * R(0.3, 0.7);
      let s = `<path d="M0 ${f1(y0 + 30 * k)}Q${f1(W * 0.5)} ${f1(y0 - 20 * k)} ${W} ${f1(y0 + 10 * k)}V${H}H0Z" fill="#51b531"/>`;
      for (let i = 0; i < 10; i++) {
        const t = i / 9, x0 = vx + (t - 0.5) * 40 * k, xb = -W * 0.4 + t * W * 1.8;
        s += `<path d="M${f1(x0 - k)} ${f1(y0 + 10 * k)}L${f1(x0 + k)} ${f1(y0 + 10 * k)}L${f1(xb + 9 * k)} ${H}L${f1(xb - 9 * k)} ${H}Z" fill="#002c0d" opacity=".85"/>`;
      }
      const cx = W * R(0.22, 0.78), cy = H * R(0.2, 0.32), g = 7 * k;
      s += `<path d="M${f1(cx)} ${f1(cy - 14 * k)}q${f1(4 * k)} ${f1(-10 * k)} ${f1(12 * k)} ${f1(-14 * k)}" stroke="#2e5d1f" stroke-width="${f1(2.4 * k)}" fill="none"/>`;
      s += desenhaFolha(cx + 2 * k, cy - 16 * k, 30 * k, -25, '#3f9a2a');
      [4, 3, 3, 2, 1].forEach((n, j) => { for (let i = 0; i < n; i++) s += `<circle cx="${f1(cx + (i - (n - 1) / 2) * g * 1.7)}" cy="${f1(cy + j * g * 1.45)}" r="${f1(g)}" fill="#5b2a6e" stroke="#3d1a4a" stroke-width="${f1(0.8 * k)}"/>`; });
      return s;
    },
    minhoca({ W, H, r, R, k }) {
      const y0 = H * R(0.6, 0.66);
      let s = morro(W, H, y0 - 8 * k, 2, '#3f9a2a', r, 4 * k) + morro(W, H, y0, 1.5, '#5e3b22', r, 4 * k) + morro(W, H, y0 + (H - y0) * 0.5, 2, '#7a4f2c', r, 4 * k);
      for (let i = 0; i < 3; i++) {
        const x = R(0.06, 0.62) * W, y = R(y0 + 22 * k, H - 20 * k), l = R(50, 90) * k;
        s += `<path d="M${f1(x)} ${f1(y)}c${f1(l * 0.25)} ${f1(-18 * k)} ${f1(l * 0.45)} ${f1(18 * k)} ${f1(l * 0.7)} 0s${f1(l * 0.2)} ${f1(-14 * k)} ${f1(l * 0.3)} ${f1(-4 * k)}" stroke="#d98a7a" stroke-width="${f1(7 * k)}" stroke-linecap="round" fill="none"/>`;
      }
      for (let i = 0; i < 6; i++) s += gota(R(0.08, 0.92) * W, R(0.12, 0.48) * H, R(0.6, 1.1) * k, r() < 0.5 ? '#008ee0' : '#f2b705');
      return s;
    },
    clima({ W, H, hz, r, R, k, larg }) {
      const cx = W * R(0.3, 0.7), cy = H * R(0.2, 0.3);
      let s = '';
      for (let i = 4; i >= 1; i--) s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(i * 20 * k)}" fill="none" stroke="#fff" stroke-opacity="${f1(0.5 - i * 0.09)}" stroke-width="${f1(1.6 * k)}"/>`;
      s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(16 * k)}" fill="#fee300"/>`;
      for (let i = 0, n = Math.round(9 * larg); i < n; i++) {
        const x = ((i + 0.5) / n) * W + R(-6, 6) * k, y = hz + R(2, 12) * k, rr = R(9, 16) * k;
        s += `<path d="M${f1(x)} ${f1(y)}v${f1(rr + 14 * k)}" stroke="#1d5c3a" stroke-width="${f1(2.6 * k)}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="#1d5c3a"/>`;
      }
      for (let i = 0; i < 10; i++) s += `<circle cx="${f1(R(0, W))}" cy="${f1(R(hz - 70 * k, hz - 14 * k))}" r="${f1(R(2, 5) * k)}" fill="none" stroke="#fff" stroke-width="${f1(1.2 * k)}" opacity=".85"/>`;
      return s + morro(W, H, H * 0.84, 2, '#3f9a2a', r, 4 * k);
    },
    dna({ W, H, r, R, k }) {
      let s = morro(W, H, H * 0.82, 2, '#3f9a2a', r, 4 * k);
      const cx = W * R(0.38, 0.62), y1 = H * 0.84, y0 = H * 0.2, A = 18 * k, voltas = 2.2;
      let a = '', b = '', degraus = '';
      for (let i = 0; i <= 44; i++) {
        const t = i / 44, y = f1(y1 - (y1 - y0) * t), ph = t * Math.PI * 2 * voltas, xa = f1(cx + Math.sin(ph) * A), xb = f1(cx - Math.sin(ph) * A);
        a += `${i ? 'L' : 'M'}${xa} ${y}`; b += `${i ? 'L' : 'M'}${xb} ${y}`;
        if (i % 3 === 0) degraus += `M${xa} ${y}L${xb} ${y}`;
      }
      s += `<path d="${degraus}" stroke="#fff" stroke-opacity=".75" stroke-width="${f1(2 * k)}"/><path d="${a}" stroke="#fee300" stroke-width="${f1(4 * k)}" fill="none" stroke-linecap="round"/><path d="${b}" stroke="#002c0d" stroke-width="${f1(4 * k)}" fill="none" stroke-linecap="round"/>`;
      return s + desenhaFolha(cx, y0, 30 * k, -40, '#51b531') + desenhaFolha(cx, y0 + 4 * k, 24 * k, 215, '#3f9a2a');
    },
    satelite({ W, H, hz, r, R, k }) {
      let s = morro(W, H, H * 0.8, 2, '#3f9a2a', r, 4 * k);
      let grade = '';
      const passo = 22 * k;
      for (let x = passo / 2; x < W; x += passo) grade += `M${f1(x)} ${f1(hz - 10 * k)}V${H}`;
      for (let y = hz; y < H; y += passo) grade += `M0 ${f1(y)}H${W}`;
      s += `<path d="${grade}" stroke="#fff" stroke-opacity=".3" stroke-width="${f1(k)}"/>`;
      const sx = W * R(0.25, 0.75), sy = H * R(0.14, 0.24);
      s += `<path d="M${f1(sx)} ${f1(sy + 12 * k)}L${f1(sx - 60 * k)} ${f1(hz + 30 * k)}L${f1(sx + 60 * k)} ${f1(hz + 30 * k)}Z" fill="#fee300" opacity=".2"/>`;
      s += `<g transform="translate(${f1(sx)} ${f1(sy)}) rotate(${f1(R(-25, 25))}) scale(${f1(k)})"><rect x="-27" y="-6" width="18" height="12" fill="#1659bf" stroke="#fff" stroke-width="1.2"/><rect x="9" y="-6" width="18" height="12" fill="#1659bf" stroke="#fff" stroke-width="1.2"/><path d="M-21-6v12M-15-6v12M15-6v12M21-6v12" stroke="#fff" stroke-width=".8" opacity=".7"/><rect x="-8" y="-9" width="16" height="18" rx="2" fill="#e8edf3" stroke="#021476" stroke-width="1.2"/><circle cy="11" r="3" fill="#fee300"/></g>`;
      const esp = ['#5b2a86', '#1659bf', '#008ee0', '#00923f', '#fee300', '#f29c38', '#da251d'];
      esp.forEach((c, i) => { s += `<rect x="${f1((i * W) / esp.length)}" y="${f1(H - 10 * k)}" width="${f1(W / esp.length + 0.5)}" height="${f1(10 * k)}" fill="${c}"/>`; });
      return s;
    },
    comunidade({ W, H, hz, r, R, k, larg }) {
      let s = `<path d="M${f1(W * 0.45)} ${f1(hz + 6 * k)}C${f1(W * 0.3)} ${f1(hz + 50 * k)} ${f1(W * 0.75)} ${f1(H * 0.8)} ${f1(W * 0.55)} ${H}H${f1(W * 0.8)}C${f1(W * 0.95)} ${f1(H * 0.8)} ${f1(W * 0.45)} ${f1(hz + 50 * k)} ${f1(W * 0.5)} ${f1(hz + 6 * k)}Z" fill="#ead9b5" opacity=".9"/>`;
      const n = Math.round((3 + Math.floor(r() * 2)) * larg);
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * W + R(-10, 10) * k, y = hz + R(8, 26) * k, e = R(0.8, 1.15) * k;
        s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(e)})"><rect x="-12" y="-14" width="24" height="16" fill="#fff"/><path d="M-15-13L0-26L15-13Z" fill="${i % 2 ? '#da251d' : '#1659bf'}"/><rect x="-3.5" y="-8" width="7" height="10" fill="#8a5a32"/></g>`;
      }
      s += morro(W, H, H * 0.86, 2, '#3f9a2a', r, 4 * k);
      ['#1659bf', '#fee300', '#da251d', '#00923f'].forEach(c => {
        s += `<g transform="translate(${f1(R(0.1, 0.9) * W)} ${f1(H * R(0.93, 0.99))}) scale(${f1(R(0.9, 1.2) * k)})"><circle cy="-22" r="5" fill="#f1c9a5"/><path d="M-7 0V-10a7 7 0 0 1 14 0V0Z" fill="${c}"/></g>`;
      });
      return s;
    },
    flor({ W, H, r, R, k, pick, larg }) {
      let s = morro(W, H, H * 0.8, 2, '#3f9a2a', r, 4 * k);
      const n = Math.round((4 + Math.floor(r() * 3)) * larg);
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * W + R(-10, 10) * k, y = H * R(0.42, 0.7), rr = R(13, 22) * k, c = pick(['#da251d', '#e8577d', '#f29c38', '#b8326b', '#fee300']);
        s += `<path d="M${f1(x)} ${f1(y)}Q${f1(x + R(-10, 10) * k)} ${f1((y + H) / 2)} ${f1(x)} ${H}" stroke="#2e7d32" stroke-width="${f1(2.4 * k)}" fill="none"/>`;
        let p = '';
        for (let j = 0; j < 12; j++) p += `<ellipse cx="${f1(x)}" cy="${f1(y - rr * 0.55)}" rx="${f1(rr * 0.2)}" ry="${f1(rr * 0.5)}" transform="rotate(${j * 30} ${f1(x)} ${f1(y)})"/>`;
        s += `<g fill="${c}">${p}</g><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr * 0.28)}" fill="#fee300" stroke="#c98a00" stroke-width="${f1(k)}"/>`;
      }
      return s;
    },
    rio({ W, H, hz, r, R, k }) {
      const ly = hz + 10 * k, x0 = W * R(0.4, 0.6);
      let s = `<ellipse cx="${f1(W * R(0.35, 0.65))}" cy="${f1(ly)}" rx="${f1(W * 0.42)}" ry="${f1(12 * k)}" fill="#008ee0"/>`;
      s += `<path d="M${f1(x0 - 6 * k)} ${f1(ly)}C${f1(x0 - 60 * k)} ${f1(ly + 60 * k)} ${f1(x0 + 70 * k)} ${f1(H * 0.78)} ${f1(x0 - 40 * k)} ${H}H${f1(x0 + 40 * k)}C${f1(x0 + 120 * k)} ${f1(H * 0.78)} ${f1(x0 - 20 * k)} ${f1(ly + 60 * k)} ${f1(x0 + 6 * k)} ${f1(ly)}Z" fill="#008ee0" stroke="#fff" stroke-width="${f1(3 * k)}"/>`;
      for (let i = 0; i < 9; i++) { const x = R(0, W); if (Math.abs(x - x0) < 46 * k) continue; s += `<circle cx="${f1(x)}" cy="${f1(hz + R(16, 70) * k)}" r="${f1(R(6, 12) * k)}" fill="#1d5c3a"/>`; }
      return s;
    },
    folha({ W, H, r, R, k }) {
      let s = morro(W, H, H * 0.82, 2, '#3f9a2a', r, 4 * k);
      s += desenhaFolha(W * R(-0.05, 0.1), H * R(0.82, 0.95), R(120, 160) * k, R(-62, -38), '#2e7d32');
      s += desenhaFolha(W * R(0.9, 1.05), H * R(0.78, 0.95), R(110, 150) * k, R(-150, -122), '#51b531');
      return s + desenhaFolha(W * R(0.35, 0.6), H, R(80, 110) * k, R(-100, -80), '#1d5c3a');
    },
  };

  function capaDefinir(W, H, id, r, k) {
    const p = f1(20 * k);
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f4098"/><stop offset="1" stop-color="#021476"/></linearGradient><pattern id="${id}p" width="${p}" height="${p}" patternUnits="userSpaceOnUse"><path d="M${p} 0H0V${p}" fill="none" stroke="#fff" stroke-opacity=".12"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${id})"/><rect width="${W}" height="${H}" fill="url(#${id}p)"/>`;
    const hz = H * 0.66;
    s += morro(W, H, hz, 2, 'rgba(255,255,255,.08)', r, 6 * k);
    s += araucaria(W * 0.22, hz + 6 * k, 0.8 * k, 'rgba(255,255,255,.22)') + araucaria(W * 0.8, hz + 10 * k, 0.6 * k, 'rgba(255,255,255,.16)');
    const cx = W / 2, cy = H * 0.4;
    return s + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(38 * k)}" fill="none" stroke="#fee300" stroke-width="${f1(2.4 * k)}" stroke-dasharray="${f1(7 * k)} ${f1(6 * k)}"/><text x="${f1(cx)}" y="${f1(cy)}" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="'Open Sans', Arial, sans-serif" font-weight="800" font-size="${f1(44 * k)}">?</text></svg>`;
  }

  function capa(w, W = 300, H = 400) {
    const r = sorteador(hash(w.id)), R = (a, b) => a + r() * (b - a), pick = arr => arr[Math.floor(r() * arr.length)];
    const id = 'k' + ++uid, k = Math.min(W, H) / 300, larg = Math.max(1, (W / H) * 0.75);
    if (w.status === 'a-definir') return capaDefinir(W, H, id, r, k);
    const desenha = MOTIVOS[w.motivo || temaPorId[w.temas[0]]?.motivo] || MOTIVOS.araucaria;
    const [c1, c2] = pick(CEUS), hz = H * R(0.5, 0.6);
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
    s += `<circle cx="${f1(R(0.12, 0.88) * W)}" cy="${f1(R(0.1, 0.28) * H)}" r="${f1(R(18, 30) * k)}" fill="#fee300" opacity=".9"/>`;
    for (let i = 0, n = 1 + Math.floor(r() * 2 * larg); i < n; i++) s += nuvem(R(0, W), R(0.08, 0.32) * H, R(0.7, 1.3) * k);
    s += morro(W, H, hz - H * 0.07, R(1.5, 3), '#9ccfb4', r) + morro(W, H, hz, R(1, 2.2), '#51b531', r);
    return s + desenha({ W, H, hz, r, R, k, pick, larg }) + '</svg>';
  }
  const capasCartao = new Map();
  // celular em grade (uma coluna): capa composta em paisagem 16:9, em vez de recortar a de 3:4
  const capaLarga = matchMedia('(max-width: 520px)');
  const capaCartao = (w, larga) => { const c = w.id + (larga ? ':larga' : ''); if (!capasCartao.has(c)) capasCartao.set(c, larga ? capa(w, 480, 270) : capa(w)); return capasCartao.get(c); };

  // Ícones dos temas (chips)
  const MINI = {
    araucaria: '<path d="M12 22V8M12 9 6 6M12 9l6-3M12 13 4 10M12 13l8-3M12 5 9 3M12 5l3-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    solo: '<path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="14.5" r="1.2" fill="currentColor"/><circle cx="16" cy="9.5" r="1.2" fill="currentColor"/>',
    broto: '<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2-5-6-5 0 3 2 5 6 5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
    abelha: '<path d="M12 3l7 4v8l-7 4-7-4V7z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M9 10.5h6M9 13.5h6" stroke="currentColor" stroke-width="2"/>',
    uva: '<g fill="currentColor"><circle cx="9" cy="9" r="2.6"/><circle cx="15" cy="9" r="2.6"/><circle cx="12" cy="13.5" r="2.6"/><circle cx="12" cy="19" r="2.4"/></g><path d="M12 6V2" stroke="currentColor" stroke-width="2"/>',
    minhoca: '<path d="M3 15c3-6 6 6 9 0s6 6 9 0" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/>',
    clima: '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    dna: '<path d="M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9M9.5 7h5M9.5 17h5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    satelite: '<rect x="9" y="9" width="6" height="6" fill="currentColor" transform="rotate(45 12 12)"/><path d="M4 4l4 4M16 16l4 4M7 3 3 7M21 17l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    comunidade: '<path d="M3 11 12 4l9 7M6 10v10h12V10" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M10 20v-5h4v5" stroke="currentColor" stroke-width="2" fill="none"/>',
    flor: '<g fill="currentColor"><circle cx="12" cy="6.5" r="3"/><circle cx="17.2" cy="10.3" r="3"/><circle cx="15.2" cy="16.4" r="3"/><circle cx="8.8" cy="16.4" r="3"/><circle cx="6.8" cy="10.3" r="3"/></g>',
    rio: '<path d="M3 8c3-3 6 3 9 0s6 3 9 0M3 14c3-3 6 3 9 0s6 3 9 0M3 20c3-3 6 3 9 0s6 3 9 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    folha: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M5 19 14 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };

  // ---------- Filtros e estantes ----------
  const form = $('#filtros'), busca = $('#busca'), elEstantes = $('#estantes'), chips = $('#chips-temas');
  let visiveis = [];
  const fechadas = new Set();

  const totalTema = id => trabalhos.filter(w => w.temas.includes(id)).length;
  chips.innerHTML = D.temas.slice().sort((a, b) => totalTema(b.id) - totalTema(a.id))
    .map(t => `<label class="chip" data-tema="${t.id}" title="${esc(t.descricao)}"><input type="checkbox" name="tema" value="${t.id}"><span class="chip-corpo"><span class="chip-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${MINI[t.motivo] || ''}</svg></span>${esc(t.rotulo)}<span class="chip-n"></span></span></label>`).join('');

  function lerFiltros() {
    const fd = new FormData(form);
    return { q: norm(fd.get('q')).trim(), turma: fd.get('turma') || '', nivel: fd.get('nivel') || '', resumo: fd.has('resumo'), temas: fd.getAll('tema'), ordem: fd.get('ordem') || 'estantes', visao: fd.get('visao') || 'grade' };
  }
  const passa = (w, f, ignorarTema) =>
    (!f.turma || String(w.ingresso) === f.turma) &&
    (!f.nivel || w.nivel === f.nivel) &&
    (!f.resumo || w.status === 'resumo') &&
    (ignorarTema || !f.temas.length || f.temas.some(t => w.temas.includes(t))) &&
    (!f.q || f.q.split(/\s+/).every(t => w.busca.includes(t)));

  function ordenar(lista, ordem) {
    const porAutor = (a, b) => comparar(a.autor, b.autor);
    if (ordem === 'titulo') return lista.sort((a, b) => !a.titulo - !b.titulo || comparar(a.tituloTxt, b.tituloTxt) || porAutor(a, b));
    if (ordem === 'autor') return lista.sort((a, b) => porAutor(a, b) || b.ingresso - a.ingresso);
    return lista.sort((a, b) => b.ingresso - a.ingresso || NIVEIS.indexOf(a.nivel) - NIVEIS.indexOf(b.nivel) || RANK[a.status] - RANK[b.status] || porAutor(a, b));
  }

  function cardHTML(w, i, larga) {
    const tema = temaPorId[w.temas[0]];
    return `<li class="card st-${w.status}" data-id="${w.id}" style="--i:${Math.min(i, 18)}"><article>`
      + `<div class="capa">${capaCartao(w, larga)}<span class="selo nivel-${w.nivel === 'Doutorado' ? 'd' : 'm'}">${w.nivel}</span>${window.PPGEAN_IA?.tem(w.id) ? `<span class="selo-ia" title="Inclui simulação de como a IA pode ajudar">${icone('ia')}IA</span>` : ''}</div>`
      + `<div class="card-corpo"><p class="card-meta"><span class="meta-nivel">${w.nivel} · </span>Ingresso ${w.ingresso}${tema ? ` · ${esc(tema.rotulo)}` : ''}</p>`
      + `<h3 class="card-titulo"><a class="card-link" href="#/${w.id}">${w.titulo || `Título em definição<span class="sr-only"> · ${esc(w.autor)}</span>`}</a></h3>`
      + `<p class="card-autor">${esc(w.autor)}</p><p class="card-status s-${w.status}">${STATUS[w.status]}</p></div></article></li>`;
  }

  function render(animar = false) {
    const f = lerFiltros();
    visiveis = ordenar(trabalhos.filter(w => passa(w, f)), f.ordem);
    const semTema = trabalhos.filter(w => passa(w, f, true));
    $$('.chip', chips).forEach(ch => {
      const n = semTema.filter(w => w.temas.includes(ch.dataset.tema)).length;
      ch.querySelector('.chip-n').textContent = n;
      ch.classList.toggle('zerado', !n);
    });
    let grupos = [];
    if (f.ordem === 'estantes') {
      const m = new Map();
      for (const w of visiveis) { const key = `${w.ingresso}-${w.nivel}`; if (!m.has(key)) m.set(key, { key, titulo: `Ingressantes ${w.ingresso} · ${w.nivel}`, sub: w.nivel === 'Doutorado' ? 'projetos de tese' : 'projetos de dissertação', itens: [] }); m.get(key).itens.push(w); }
      grupos = [...m.values()];
    } else if (visiveis.length) grupos = [{ key: 'todos', titulo: 'Todos os projetos', sub: f.ordem === 'titulo' ? 'por título' : 'por autor', itens: visiveis }];
    let i = 0;
    const larga = f.visao !== 'lista' && capaLarga.matches;
    elEstantes.classList.toggle('animar', animar);
    elEstantes.innerHTML = grupos.map(g => `<details class="estante" data-key="${g.key}"${fechadas.has(g.key) ? '' : ' open'}><summary>${icone('dir', 'estante-seta')}<h2>${esc(g.titulo)} <small>${g.sub}</small></h2><span class="estante-n">${g.itens.length}</span></summary>`
      + `<ul class="grade${f.visao === 'lista' ? ' lista' : ''}">${g.itens.map(w => cardHTML(w, i++, larga)).join('')}</ul></details>`).join('');
    $('#vazio').hidden = visiveis.length > 0;
    const total = trabalhos.length;
    $('#contagem').innerHTML = visiveis.length === total ? `<strong>${total}</strong> projetos` : `<strong>${visiveis.length}</strong> de ${total} projetos`;
    $('#limpar').hidden = !(f.q || f.turma || f.nivel || f.resumo || f.temas.length);
    // filtros escondidos atrás do botão (celular): mostra quantos estão ativos
    const ativos = !!f.turma + !!f.nivel + f.resumo;
    $('#filtros-n').hidden = !ativos;
    $('#filtros-n').innerHTML = `${ativos}<span class="sr-only"> ativos</span>`;
  }
  capaLarga.addEventListener('change', () => render());
  const abrirFiltros = $('#filtros-abrir');
  abrirFiltros.addEventListener('click', () => abrirFiltros.setAttribute('aria-expanded', form.classList.toggle('aberto')));
  // Filtros re-renderizam com a animação de entrada dos cards (sem View Transition: ela engolia cliques rápidos)
  form.addEventListener('change', e => {
    if (e.target.name === 'visao') store.set('visao', e.target.value);
    render(true);
  });
  busca.addEventListener('input', () => render());
  busca.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); elEstantes.scrollIntoView({ behavior: movimento.matches ? 'smooth' : 'auto' }); } });
  form.addEventListener('reset', () => setTimeout(() => {
    aplicarVisao();
    render(true);
    // o botão "Limpar filtros" some depois do clique: devolve o foco a um controle visível
    const f = document.activeElement;
    if (!f || f === document.body || f.closest('[hidden]')) [form.querySelector('input[name="turma"]:checked'), abrirFiltros].find(el => el.offsetParent)?.focus();
  }));
  elEstantes.addEventListener('toggle', e => { const d = e.target; if (d.matches?.('details.estante')) { if (d.open) fechadas.delete(d.dataset.key); else fechadas.add(d.dataset.key); } }, true);
  function aplicarVisao() { const r = form.querySelector(`input[name="visao"][value="${store.get('visao') || 'grade'}"]`); if (r) r.checked = true; }

  // Setas da faixa de temas (aparecem só quando há temas escondidos de um dos lados)
  const [rolarAnt, rolarProx] = $$('.rolar', form);
  function setasChips() {
    const fim = chips.scrollWidth - chips.clientWidth - 4;
    rolarAnt.hidden = chips.scrollLeft <= 4;
    rolarProx.hidden = chips.scrollLeft >= fim;
  }
  chips.addEventListener('scroll', setasChips, { passive: true });
  addEventListener('resize', setasChips);
  [[rolarAnt, -1], [rolarProx, 1]].forEach(([b, d]) => b.addEventListener('click', () => chips.scrollBy({ left: d * chips.clientWidth * 0.8, behavior: movimento.matches ? 'smooth' : 'auto' })));

  // Inclinação 3D das capas (só com mouse e se o usuário aceita animações)
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)');
  elEstantes.addEventListener('pointermove', e => {
    if (!ponteiroFino.matches || !movimento.matches) return;
    const card = e.target.closest('.grade:not(.lista) .card'); if (!card) return;
    const b = card.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    card.style.setProperty('--ry', `${((x - 0.5) * 10).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
    card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
  });
  elEstantes.addEventListener('pointerout', e => {
    const card = e.target.closest('.card');
    if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
  });

  // Setas do teclado navegam entre as capas, como numa biblioteca de jogos
  elEstantes.addEventListener('keydown', e => {
    const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!dir || !e.target.matches('.card-link') || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const links = $$('.card-link', elEstantes).filter(a => a.offsetParent);
    let alvo;
    if (dir[0]) alvo = links[links.indexOf(e.target) + dir[0]];
    else {
      const a = e.target.closest('.card').getBoundingClientRect(), cx = a.left + a.width / 2;
      alvo = links.map(l => ({ l, b: l.closest('.card').getBoundingClientRect() }))
        .filter(o => (dir[1] > 0 ? o.b.top > a.top + 2 : o.b.top < a.top - 2))
        .sort((p, q) => (dir[1] > 0 ? p.b.top - q.b.top : q.b.top - p.b.top) || Math.abs(p.b.left + p.b.width / 2 - cx) - Math.abs(q.b.left + q.b.width / 2 - cx))[0]?.l;
    }
    if (alvo) { e.preventDefault(); alvo.focus({ preventScroll: true }); alvo.closest('.card').scrollIntoView({ block: 'nearest', behavior: movimento.matches ? 'smooth' : 'auto' }); }
  });


  // ---------- Destaque e números ----------
  // Destaque: começa no projeto definido em trabalhos.js ("destaque"); "Sortear outro" passeia pelos que têm resumo.
  let destaqueAtual = null;
  function mostrarDestaque(animar, escolhido) {
    let w = escolhido?.titulo ? escolhido : null;
    if (!w && comResumo.length) do { w = comResumo[Math.floor(Math.random() * comResumo.length)]; } while (comResumo.length > 1 && w === destaqueAtual);
    if (!w) { $('#destaque').hidden = true; return; }
    destaqueAtual = w;
    const el = $('#destaque'), temResumo = w.status === 'resumo';
    const trecho = temResumo ? w.resumo[0] : `Projeto de ${w.nivel === 'Doutorado' ? 'tese' : 'dissertação'} em desenvolvimento. O título já consta na lista oficial do PPGEAN; o resumo será publicado em breve.`;
    el.innerHTML = `<a class="destaque-capa capa" href="#/${w.id}" tabindex="-1" aria-hidden="true">${capa(w, 640, 328)}<span class="destaque-rotulo">Em destaque</span></a>`
      + `<div class="destaque-txt"><p class="meta">${w.nivel} · Ingresso ${w.ingresso}</p><h2><a href="#/${w.id}">${w.titulo}</a></h2><p class="autor">${esc(w.autor)}</p><p class="trecho">${trecho}</p>`
      + `<div class="acoes"><a class="btn primario" href="#/${w.id}">${icone('doc')}${temResumo ? 'Ler resumo' : 'Ver projeto'}</a><button type="button" class="btn" id="sortear">${icone('dado')}Sortear outro</button></div></div>`;
    if (animar) { el.classList.remove('trocando'); void el.offsetWidth; el.classList.add('trocando'); }
  }
  $('#destaque').addEventListener('click', e => { if (e.target.closest('#sortear')) { mostrarDestaque(true); $('#sortear').focus(); avisar(`Em destaque: ${destaqueAtual.tituloTxt}`); } });

  function numeros() {
    const n = [['Projetos', trabalhos.length], ['Mestrado', trabalhos.filter(w => w.nivel === 'Mestrado').length], ['Doutorado', trabalhos.filter(w => w.nivel === 'Doutorado').length], ['Com resumo', comResumo.length]];
    const el = $('#numeros');
    el.innerHTML = n.map(([k, v]) => `<div><dt>${k}</dt><dd data-n="${v}">${v}</dd></div>`).join('');
    if (!movimento.matches) return;
    const dds = $$('dd', el), t0 = performance.now();
    const passo = t => { const p = Math.min(1, (t - t0) / 900), e = 1 - (1 - p) ** 3; dds.forEach(dd => { dd.textContent = Math.round(dd.dataset.n * e); }); if (p < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }

  // ---------- Leitor (projeto expandido na mesma tela) ----------
  const dlg = $('#leitor'), aviso = $('#aviso'), tituloPagina = document.title;
  let atual = null, focoOrigem = null, navLista = null;
  const enderecoPublico = /^https?:$/.test(location.protocol) && !/^(localhost|127\.|0\.0\.0\.0|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)|\.local$/.test(location.hostname) && window.top === window.self;
  let alvoQR = store.get('qr-alvo') || (enderecoPublico ? 'portfolio' : 'oficial');
  let fs = Math.min(24, Math.max(14, +store.get('fs') || 17));
  const vozOK = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  const urlPortfolio = w => `${location.href.split('#')[0]}#/${w.id}`;
  function fonteOficial(w) {
    if (w.pdf) return { url: w.pdf, rotulo: 'Resumo em PDF', dica: 'Abre o resumo em PDF hospedado no servidor de arquivos da UFSC.' };
    if (w.pagina) return { url: w.pagina, rotulo: 'Página oficial', dica: 'Abre a página deste projeto no site do PPGEAN.' };
    return { url: D.turmas[w.ingresso], rotulo: 'Lista oficial', dica: 'Este projeto ainda não tem página própria: o QR abre a lista oficial de projetos da turma no site do PPGEAN.' };
  }
  const urlQR = w => (alvoQR === 'portfolio' ? urlPortfolio(w) : fonteOficial(w).url);

  function preencher(w) {
    atual = w;
    const temas = w.temas.map(t => temaPorId[t]).filter(Boolean);
    $('#leitor-capa').innerHTML = capa(w, 960, 360);
    $('#leitor-selos').innerHTML = `<span class="selo nivel-${w.nivel === 'Doutorado' ? 'd' : 'm'}">${w.nivel}</span><span class="selo claro">Ingresso ${w.ingresso}</span>${temas.map(t => `<span class="selo claro">${esc(t.rotulo)}</span>`).join('')}`;
    $('#leitor-titulo').innerHTML = w.titulo || 'Título em definição';
    $('#leitor-autor').innerHTML = `${icone('pessoa')}<span>${esc(w.autor)}</span>`;

    let h = '';
    if (w.status === 'resumo') {
      const palavras = w.resumo.map(semTags).join(' ').split(/\s+/).filter(Boolean).length;
      h += `<div class="leitura-barra"><span class="tempo">${icone('doc')}≈ ${Math.max(1, Math.round(palavras / 200))} min de leitura · ${palavras} palavras</span><span class="ajustes">`
        + (vozOK ? `<button type="button" class="btn mini" data-acao="ouvir">${icone('ouvir')}Ouvir</button>` : '')
        + `<button type="button" class="btn mini" data-acao="fonte-menos" aria-label="Diminuir o texto">A−</button><button type="button" class="btn mini" data-acao="fonte-mais" aria-label="Aumentar o texto">A+</button></span></div>`
        + `<h3>Resumo</h3>${w.resumo.map(p => `<p>${p}</p>`).join('')}`;
    } else if (w.status === 'titulo') {
      h += `<div class="aviso-status">${icone('doc')}<p><strong>Resumo em breve.</strong> O PPGEAN já divulgou o título deste projeto, mas o resumo ainda não foi publicado.</p></div>`;
    } else {
      h += `<div class="aviso-status">${icone('doc')}<p><strong>Projeto em definição.</strong> Na lista oficial do PPGEAN, o título deste projeto de ${w.nivel === 'Doutorado' ? 'tese' : 'dissertação'} ainda consta como “a definir”.</p></div>`;
    }
    const ficha = [];
    if (w.orientador) ficha.push(['Orientação', esc(w.orientador)]);
    if (w.coorientadores?.length) ficha.push(['Coorientação', w.coorientadores.map(esc).join('<br>')]);
    if (w.palavrasChave?.length) ficha.push(['Palavras-chave', `<span class="palavras">${w.palavrasChave.map(p => `<button type="button" class="palavra" data-palavra="${esc(semTags(p))}" title="Buscar projetos com “${esc(semTags(p))}”">${p}</button>`).join('')}</span>`]);
    if (temas.length) ficha.push(['Temas', temas.map(t => esc(t.rotulo)).join(' · ')]);
    if (w.financiamento) ficha.push(['Financiamento', esc(w.financiamento)]);
    ficha.push(['Turma', `${w.nivel} · ingresso em ${w.ingresso}`]);
    h += `<dl class="ficha">${ficha.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
    const outros = trabalhos.filter(o => o !== w && norm(o.autor) === norm(w.autor));
    if (outros.length) h += `<div class="relacionados">${outros.map(o => `<p><strong>${esc(w.autor)}</strong> também está nesta biblioteca: <a href="#/${o.id}">${o.nivel} · ingresso ${o.ingresso}${o.titulo ? ` — ${o.titulo}` : ' (projeto em definição)'}</a></p>`).join('')}</div>`;
    $('#leitor-texto').innerHTML = h;
    // Recursos opcionais: uma falha aqui nunca deve impedir a leitura do projeto
    try { window.PPGEAN_IA?.montar($('#leitor-ia'), w, { soTitulo: w.status !== 'resumo' }); } catch (err) { console.error('Simulação de IA indisponível:', err); }
    if (w.status === 'a-definir') { const el = $('#leitor-ia'); el.hidden = false; el.innerHTML = `<section class="ia ia-vazia"><p class="ia-selo">${icone('ia')}Como a IA pode ajudar</p><p class="ia-ideia">Quando o tema deste projeto for definido, a biblioteca vai sugerir aqui uma simulação de como a inteligência artificial pode apoiar a pesquisa.</p></section>`; }
    try { montarLeap(w); } catch (err) { console.error('Bloco LeapSpace indisponível:', err); }

    let fontes = '';
    if (w.pdf) fontes += `<a class="btn" href="${w.pdf}" target="_blank" rel="noopener">${icone('doc')}Ver resumo original (PDF)${icone('externo')}</a>`;
    if (w.pagina) fontes += `<a class="btn" href="${w.pagina}" target="_blank" rel="noopener">${icone('doc')}Página no site do PPGEAN${icone('externo')}</a>`;
    fontes += `<a class="btn" href="${D.turmas[w.ingresso]}" target="_blank" rel="noopener">${icone('link')}Lista oficial · ingresso ${w.ingresso}${icone('externo')}</a>`;
    $('#leitor-fontes').innerHTML = fontes;
    $('#qr-rotulo-oficial').textContent = fonteOficial(w).rotulo;
    $$('#qr-alvo input').forEach(i => { i.checked = i.value === alvoQR; });
    atualizarQR();
  }

  // ---------- LeapSpace (Elsevier, via CAPES) ----------
  // Sem API e sem incorporação (X-Frame-Options), mas a caixa de pergunta aceita ?q=. "Especialistas",
  // "Financiamento" e "Panorama" são perguntas em linguagem natural na mesma caixa; por isso cada projeto
  // traz perguntas curtas e específicas (PT/EN, em sugestoes-ia.js) que a pessoa pode editar antes de enviar.
  const LEAP = 'https://www.sciencedirect.com/leapspace?q=';
  const LEAP_TIPOS = { panorama: 'Panorama do tema', evidencias: 'Evidências', ia: 'Validar a ideia de IA', especialistas: 'Especialistas', financiamento: 'Financiamento' };
  const LEAP_ORDEM = Object.keys(LEAP_TIPOS);
  const elLeap = $('#leitor-leap');
  let leapPs = [], leapTipo = 'panorama', leapIdioma = store.get('leap-idioma') === 'en' ? 'en' : 'pt';
  const leapAtualizar = () => { $('.leap-ir', elLeap).href = LEAP + encodeURIComponent($('#leap-pergunta').value.trim()); };
  function leapEscolher(tipo) {
    const p = leapPs.find(x => x.tipo === tipo) || leapPs[0];
    if (!p) return;
    leapTipo = p.tipo;
    $('#leap-pergunta').value = p[leapIdioma] || p.pt;
    $$('.leap-chip', elLeap).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tipo === leapTipo)));
    leapAtualizar();
  }
  function montarLeap(w) {
    const temIA = !!window.PPGEAN_IA?.tem?.(w.id);
    leapPs = (window.PPGEAN_SUGESTOES_IA?.leapspace?.[w.id] || [])
      .filter(p => LEAP_TIPOS[p.tipo] && (p.tipo !== 'ia' || temIA))
      .sort((a, b) => LEAP_ORDEM.indexOf(a.tipo) - LEAP_ORDEM.indexOf(b.tipo));
    elLeap.hidden = !leapPs.length;
    if (!leapPs.length) { elLeap.innerHTML = ''; return; }
    elLeap.innerHTML = `<section class="leap" aria-labelledby="leap-titulo"><div class="leap-cab"><span class="leap-ico" aria-hidden="true">${icone('busca')}</span>`
      + `<div><h3 id="leap-titulo">Pergunte à literatura científica</h3><p>Pelo <strong>LeapSpace</strong>, assistente de IA da Elsevier disponível pela CAPES, que responde citando artigos e livros revisados por pares.</p></div></div>`
      + `<div class="leap-chips" role="group" aria-label="Perguntas sugeridas para este projeto">${leapPs.map(p => `<button type="button" class="leap-chip" data-tipo="${p.tipo}" aria-pressed="false">${LEAP_TIPOS[p.tipo]}</button>`).join('')}</div>`
      + `<label class="sr-only" for="leap-pergunta">Pergunta para o LeapSpace (pode ser editada)</label><textarea id="leap-pergunta" class="leap-caixa" rows="3" maxlength="600"></textarea>`
      + `<div class="leap-acoes"><fieldset class="segmentos leap-idioma"><legend class="sr-only">Idioma da pergunta</legend>`
      + ['pt', 'en'].map(l => `<label><input type="radio" name="leap-idioma" value="${l}"${l === leapIdioma ? ' checked' : ''}><span>${l === 'pt' ? 'Português' : 'English'}</span></label>`).join('')
      + `</fieldset><div class="leap-botoes"><button type="button" class="btn primario leap-copiar">${icone('copiar')}Copiar pergunta</button>`
      + `<a class="btn leap-ir" target="_blank" rel="noopener">Abrir o LeapSpace${icone('externo')}</a></div></div>`
      + `<p class="leap-nota"><strong>Como usar:</strong> copie a pergunta, abra o LeapSpace e cole-a na caixa de pergunta (Ctrl+V ou ⌘+V). Requer login institucional: CAFe, pelo <a href="https://www.periodicos.capes.gov.br/" target="_blank" rel="noopener">Portal de Periódicos CAPES</a>. A pesquisa aprofundada do LeapSpace consome créditos; ative-a lá, se quiser. Respostas geradas por IA: confira as fontes citadas.</p></section>`;
    leapEscolher(leapPs[0].tipo);
    // Ponte: da simulação ilustrativa para a evidência real
    if (leapPs.some(p => p.tipo === 'ia')) $('#leitor-ia .ia')?.insertAdjacentHTML('beforeend', `<p class="ia-ponte"><button type="button" class="btn mini" data-acao="leap-ia">${icone('busca')}Isso já foi feito? Pergunte à literatura</button></p>`);
  }
  elLeap.addEventListener('click', e => {
    const chip = e.target.closest('.leap-chip');
    if (chip) { leapEscolher(chip.dataset.tipo); return; }
    const copiar = e.target.closest('.leap-copiar');
    if (copiar) { copiarTexto($('#leap-pergunta').value.trim(), copiar, 'Pergunta copiada. Abra o LeapSpace e cole na caixa de pergunta (Ctrl+V ou ⌘+V).'); return; }
    if (e.target.closest('.leap-ir')) copiarTexto($('#leap-pergunta').value.trim(), null, 'Pergunta copiada: depois de entrar no LeapSpace, cole-a na caixa de pergunta.');
  });
  elLeap.addEventListener('input', e => { if (e.target.id === 'leap-pergunta') leapAtualizar(); });
  elLeap.addEventListener('change', e => { if (e.target.name === 'leap-idioma') { leapIdioma = e.target.value; store.set('leap-idioma', leapIdioma); leapEscolher(leapTipo); } });

  function atualizarQR() {
    const w = atual, url = urlQR(w);
    $('#qr-caixa').innerHTML = qrSVG(url, `QR Code do projeto ${w.tituloTxt || w.autor}`);
    const a = $('#qr-url'); a.href = url; a.textContent = url.replace(/^https?:\/\//, '');
    const dica = $('#qr-dica'), local = alvoQR === 'portfolio' && !enderecoPublico;
    dica.textContent = alvoQR === 'portfolio'
      ? (local ? 'Atenção: esta página não está em um endereço público (arquivo local, rede interna ou pré-visualização). Publique o site para que este QR funcione em outros aparelhos, ou use a fonte oficial.' : 'Abre esta biblioteca já com este projeto expandido.')
      : fonteOficial(w).dica;
    dica.classList.toggle('alerta', local);
  }

  // A lista de Anterior/Próximo fica fixa enquanto o leitor está aberto
  const listaNav = () => (navLista?.includes(atual) ? navLista : (navLista = visiveis.includes(atual) ? visiveis.slice() : ordenar(trabalhos.slice(), 'estantes')));
  function atualizarNav() {
    const L = listaNav(), i = L.indexOf(atual), ant = L[i - 1], prox = L[i + 1];
    [[$('#nav-ant'), ant, 'Anterior'], [$('#nav-prox'), prox, 'Próximo']].forEach(([b, o, nome]) => {
      if (!o && document.activeElement === b) $('#leitor-titulo').focus();
      b.disabled = !o;
      b.title = o ? (o.tituloTxt || `${o.autor} (projeto em definição)`) : '';
      b.setAttribute('aria-label', o ? `${nome}: ${o.tituloTxt || o.autor}` : `${nome}: não há mais projetos`);
    });
    $('#nav-pos').textContent = `${i + 1} de ${L.length}`;
  }
  function trocar(w) {
    pararVoz();
    preencher(w);
    atualizarNav();
    $('#leitor-rolagem').scrollTop = 0;
    document.title = `${w.tituloTxt || w.autor} · ${tituloPagina}`;
    if (dlg.open) ['.leitor-hero-txt', '#leitor-texto'].forEach(s => { const el = $(s, dlg); el.classList.remove('trocando'); void el.offsetWidth; el.classList.add('trocando'); });
    if (dlg.open && !dlg.contains(document.activeElement)) $('#leitor-titulo').focus(); // o botão focado foi recriado
  }
  const naTela = el => { const b = el?.getBoundingClientRect(); return !!b && b.width > 0 && b.bottom > 0 && b.top < innerHeight; };
  const podeTransicao = el => !!document.startViewTransition && movimento.matches && naTela(el);

  function abrir(w, capaOrigem) {
    if (dlg.open) { if (w !== atual) trocar(w); return; }
    focoOrigem = document.activeElement;
    const mostrar = () => { trocar(w); dlg.append(aviso); dlg.showModal(); };
    if (!podeTransicao(capaOrigem)) return mostrar();
    const hero = $('#leitor-capa');
    capaOrigem.style.viewTransitionName = 'capa-ativa';
    const vt = document.startViewTransition(() => { capaOrigem.style.viewTransitionName = ''; mostrar(); hero.style.viewTransitionName = 'capa-ativa'; });
    vt.ready.catch(() => {}); // abortada (ex.: janela redimensionada): o leitor abre mesmo assim
    vt.finished.finally(() => { hero.style.viewTransitionName = ''; });
  }
  function fechar() {
    if (!dlg.open) return;
    const hero = $('#leitor-capa'), capaCard = $(`.card[data-id="${atual.id}"] .capa`);
    if (!podeTransicao(capaCard)) return dlg.close();
    hero.style.viewTransitionName = 'capa-ativa';
    const vt = document.startViewTransition(() => { hero.style.viewTransitionName = ''; dlg.close(); capaCard.style.viewTransitionName = 'capa-ativa'; });
    vt.ready.catch(() => {});
    vt.finished.finally(() => { capaCard.style.viewTransitionName = ''; });
  }
  function irPara(delta) {
    const L = listaNav(), w = L[L.indexOf(atual) + delta];
    if (!w) return;
    history.replaceState(history.state, '', '#/' + w.id);
    trocar(w);
  }

  dlg.addEventListener('cancel', e => { e.preventDefault(); fechar(); });
  let cliqueNoFundo = false; // só fecha se o clique começou no véu (não ao arrastar uma seleção de texto para fora)
  dlg.addEventListener('pointerdown', e => { cliqueNoFundo = e.target === dlg; });
  dlg.addEventListener('click', e => { if (e.target === dlg && cliqueNoFundo) fechar(); });
  dlg.addEventListener('close', () => {
    pararVoz();
    window.PPGEAN_IA?.parar();
    navLista = null;
    // a entrada criada ao abrir é marcada com { leitor: 1 }: voltar a remove sem duplicar o histórico
    if (location.hash.startsWith('#/')) { if (history.state?.leitor) history.back(); else history.replaceState(null, '', location.pathname + location.search); }
    document.title = tituloPagina;
    if (aviso.parentNode !== document.body) document.body.append(aviso);
    // volta ao botão que abriu (ex.: o destaque); se navegou para outro projeto, vai ao card dele
    const card = atual && $(`.card[data-id="${atual.id}"] .card-link`);
    const alvo = [focoOrigem?.getAttribute?.('href') === `#/${atual?.id}` && focoOrigem, card, focoOrigem].find(el => el?.isConnected && el.offsetParent);
    alvo?.focus();
  });
  $('#leitor-fechar').addEventListener('click', fechar);
  $('#nav-ant').addEventListener('click', () => irPara(-1));
  $('#nav-prox').addEventListener('click', () => irPara(1));
  $('#qr-alvo').addEventListener('change', e => { alvoQR = e.target.value; store.set('qr-alvo', alvoQR); atualizarQR(); });
  dlg.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); irPara(1); }
  });
  dlg.addEventListener('click', e => {
    const p = e.target.closest('.palavra');
    if (p) { busca.value = p.dataset.palavra; render(); fechar(); avisar(`Mostrando projetos com “${p.dataset.palavra}”.`); return; }
    const b = e.target.closest('[data-acao]');
    if (!b) return;
    const acoes = {
      'copiar-qr': () => copiarQR(b), 'baixar-qr': baixarQR, etiqueta, 'copiar-link': () => copiarLink(b), compartilhar,
      ouvir, 'fonte-mais': () => mudarFonte(1), 'fonte-menos': () => mudarFonte(-1),
      'leap-ia': () => {
        leapEscolher('ia');
        const rol = $('#leitor-rolagem'); // rola só o painel do leitor
        rol.scrollTo({ top: rol.scrollTop + elLeap.getBoundingClientRect().top - rol.getBoundingClientRect().top - 12, behavior: movimento.matches ? 'smooth' : 'auto' });
        $('#leap-pergunta').focus({ preventScroll: true });
      },
    };
    acoes[b.dataset.acao]?.();
  });

  // Links internos (#/id) abrem o leitor com transição; o histórico permite voltar com o botão do navegador
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const w = porId.get(a.getAttribute('href').slice(2));
    if (!w) return;
    e.preventDefault();
    if (dlg.open) { history.replaceState(history.state, '', '#/' + w.id); trocar(w); return; }
    history.pushState({ leitor: 1 }, '', '#/' + w.id);
    abrir(w, (a.closest('.card') || a.closest('.destaque'))?.querySelector('.capa'));
  });
  function rota() {
    const m = location.hash.match(/^#\/([\w-]+)$/), w = m && porId.get(m[1]);
    if (w) abrir(w);
    else if (dlg.open) dlg.close();
  }
  history.scrollRestoration = 'manual'; // quem decide a rolagem ao fechar o leitor é o foco
  addEventListener('popstate', rota);
  addEventListener('hashchange', rota);

  // ---------- QR Code ----------
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const COR_QR = '#021476';
  function matrizQR(texto) { const q = qrcode(0, 'M'); q.addData(texto, 'Byte'); q.make(); return q; }
  function qrSVG(texto, rotulo) {
    const q = matrizQR(texto), n = q.getModuleCount(), m = 4, N = n + 2 * m;
    let d = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) d += `M${x + m} ${y + m}h1v1h-1z`;
    return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" role="img" aria-label="${esc(rotulo)}"><rect width="${N}" height="${N}" fill="#fff"/><path d="${d}" fill="${COR_QR}"/></svg>`;
  }
  // Módulos com tamanho inteiro em pixels (nítido na impressão) e margem de 4 módulos.
  function prepararQR(texto, ladoMax) {
    const q = matrizQR(texto), k = Math.max(1, Math.floor(ladoMax / (q.getModuleCount() + 8)));
    return { q, k, lado: (q.getModuleCount() + 8) * k };
  }
  function pintarQR(g, { q, k, lado }, x0, y0) {
    const n = q.getModuleCount();
    g.fillStyle = '#fff'; g.fillRect(x0, y0, lado, lado);
    g.fillStyle = COR_QR;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) g.fillRect(x0 + (x + 4) * k, y0 + (y + 4) * k, k, k);
  }
  function qrCanvas(texto, ladoMax = 1024) {
    const p = prepararQR(texto, ladoMax), cv = document.createElement('canvas');
    cv.width = cv.height = p.lado;
    pintarQR(cv.getContext('2d'), p, 0, 0);
    return cv;
  }
  const paraBlob = cv => new Promise((ok, erro) => { try { cv.toBlob(b => (b ? ok(b) : erro(new Error('falha ao gerar PNG'))), 'image/png'); } catch (e) { erro(e); } });
  function baixar(blob, nome) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nome;
    (dlg.open ? dlg : document.body).append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const nomeArquivo = (w, tipo) => `ppgean-${w.id}-${tipo}.png`;
  function confirmar(btn, txt) {
    if (!btn) return;
    btn.dataset.orig ??= btn.innerHTML;
    btn.innerHTML = `${icone('copiar')}${txt}`; btn.classList.add('ok');
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.innerHTML = btn.dataset.orig; btn.classList.remove('ok'); }, 1800);
  }
  async function copiarQR(btn) {
    const w = atual, cv = qrCanvas(urlQR(w));
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('sem suporte');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': paraBlob(cv) })]);
      confirmar(btn, 'Copiado!');
      avisar('QR Code copiado. Cole em um documento, slide ou mensagem.');
    } catch {
      baixar(await paraBlob(cv), nomeArquivo(w, 'qrcode'));
      avisar('Este navegador não permite copiar imagens aqui; o QR Code foi baixado como PNG.');
    }
  }
  async function baixarQR() { baixar(await paraBlob(qrCanvas(urlQR(atual))), nomeArquivo(atual, 'qrcode')); avisar('QR Code baixado em PNG de alta resolução.'); }
  async function copiarTexto(texto, btn, msg) {
    try { await navigator.clipboard.writeText(texto); }
    catch {
      const t = document.createElement('textarea'), foco = document.activeElement;
      t.value = texto; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;opacity:0';
      (dlg.open ? dlg : document.body).append(t); t.select();
      const ok = document.execCommand('copy'); t.remove(); foco?.focus();
      if (!ok) { avisar('Não foi possível copiar automaticamente: selecione o texto e use Ctrl+C (⌘+C).'); return false; }
    }
    confirmar(btn, 'Copiado!'); avisar(msg);
    return true;
  }
  const copiarLink = btn => copiarTexto(urlQR(atual), btn, 'Link copiado.');
  const btnCompartilhar = $('[data-acao="compartilhar"]');
  if (navigator.share) btnCompartilhar.hidden = false;
  async function compartilhar() {
    try { await navigator.share({ title: atual.tituloTxt || atual.autor, text: `${atual.tituloTxt || 'Projeto em definição'} — ${atual.autor} (PPGEAN/UFSC)`, url: urlQR(atual) }); } catch { /* cancelado */ }
  }

  // Etiqueta A6 (300 dpi) para imprimir e afixar: identidade UFSC/PPGEAN + título + QR
  const carregarImagem = src => new Promise((ok, erro) => { const i = new Image(); i.onload = () => ok(i); i.onerror = erro; i.src = src; });
  function linhas(g, txt, larg, max) {
    const out = [];
    let l = '';
    for (const p of txt.split(/\s+/)) { const t = l ? `${l} ${p}` : p; if (l && g.measureText(t).width > larg) { out.push(l); l = p; } else l = t; }
    if (l) out.push(l);
    if (out.length > max) {
      out.length = max;
      let u = out[max - 1];
      while (g.measureText(u + '…').width > larg && u.includes(' ')) u = u.slice(0, u.lastIndexOf(' '));
      out[max - 1] = u + '…';
    }
    return out;
  }
  function desenharEtiqueta(w, url, logo) {
    const W = 1240, H = 1748, M = 96, cv = document.createElement('canvas'), g = cv.getContext('2d');
    const F = (peso, px) => `${peso} ${px}px "Open Sans", Arial, sans-serif`;
    cv.width = W; cv.height = H;
    g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#1659bf'; g.fillRect(0, 0, W, 250);
    g.fillStyle = '#0f4098'; g.fillRect(0, 250, W, 16);
    if (logo) g.drawImage(logo, M, 60, (130 * logo.width) / logo.height, 130);
    else { g.fillStyle = '#fff'; g.font = F(800, 92); g.fillText('PPGEAN', M, 160); }
    g.textAlign = 'right'; g.fillStyle = '#fff'; g.font = F(800, 40); g.fillText('UFSC', W - M, 118);
    g.fillStyle = '#dcecff'; g.font = F(400, 24); g.fillText('Universidade Federal', W - M, 156); g.fillText('de Santa Catarina', W - M, 186);
    g.textAlign = 'left';
    let y = 352;
    g.fillStyle = '#004f80'; g.font = F(700, 30); g.fillText(`${w.nivel.toUpperCase()}  ·  INGRESSO ${w.ingresso}`, M, y);
    g.fillStyle = '#1d1d1d'; g.font = F(800, 52);
    const tl = linhas(g, w.tituloTxt || 'Título em definição', W - 2 * M, 5);
    tl.forEach((l, i) => g.fillText(l, M, y + 78 + i * 66));
    y += 78 + (tl.length - 1) * 66 + 62;
    g.fillStyle = '#4d4d4d'; g.font = F(600, 36); g.fillText(w.autor, M, y);
    const qr = prepararQR(url, Math.min(720, H - y - 330)), qy = y + 48;
    pintarQR(g, qr, Math.round((W - qr.lado) / 2), qy);
    const cy = qy + qr.lado + 66;
    g.textAlign = 'center'; g.fillStyle = '#021476'; g.font = F(700, 36);
    g.fillText('Aponte a câmera do celular para acessar o projeto', W / 2, cy);
    g.fillStyle = '#666'; g.font = F(400, 23);
    const curto = url.replace(/^https?:\/\//, '');
    g.fillText(curto.length > 86 ? curto.slice(0, 85) + '…' : curto, W / 2, cy + 42);
    ['#00478f', '#fee300', '#00923f', '#da251d'].forEach((c, i) => { g.fillStyle = c; g.fillRect((i * W) / 4, H - 22, W / 4 + 1, 22); });
    g.fillStyle = '#5c5c5c'; g.font = F(600, 21);
    g.fillText('Programa de Pós-Graduação em Ecossistemas Agrícolas e Naturais · UFSC Campus Curitibanos', W / 2, H - 50);
    return cv;
  }
  async function etiqueta() {
    const w = atual, url = urlQR(w);
    try { await Promise.all([400, 600, 700, 800].map(p => document.fonts.load(`${p} 40px "Open Sans"`))); } catch { /* usa fonte do sistema */ }
    let logo = null;
    try { logo = await carregarImagem('assets/ppgean-horizontal-branco.png'); } catch { /* sem logo */ }
    let blob;
    try { blob = await paraBlob(desenharEtiqueta(w, url, logo)); }
    catch { blob = await paraBlob(desenharEtiqueta(w, url, null)); } // canvas "contaminado" ao abrir via file://
    baixar(blob, nomeArquivo(w, 'etiqueta'));
    avisar('Etiqueta baixada (A6, 300 dpi): pronta para imprimir e afixar.');
  }

  // ---------- Leitura: voz e tamanho do texto ----------
  function estadoVoz(on) {
    const b = $('[data-acao="ouvir"]', dlg);
    if (!b) return;
    b.innerHTML = on ? `${icone('parar')}Parar` : `${icone('ouvir')}Ouvir`;
  }
  function pararVoz() { if (vozOK && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel(); estadoVoz(false); }
  function ouvir() {
    if (speechSynthesis.speaking) { pararVoz(); return; }
    const w = atual, u = new SpeechSynthesisUtterance(`${w.tituloTxt}. ${w.resumo.map(semTags).join(' ')}`);
    const vozes = speechSynthesis.getVoices();
    u.lang = 'pt-BR';
    u.voice = vozes.find(v => /^pt[-_]BR/i.test(v.lang)) || vozes.find(v => /^pt/i.test(v.lang)) || null;
    u.onend = u.onerror = () => estadoVoz(false);
    speechSynthesis.speak(u);
    estadoVoz(true);
  }
  const aplicarFonte = () => dlg.style.setProperty('--fs-leitura', fs + 'px');
  function mudarFonte(d) { fs = Math.min(24, Math.max(14, fs + d)); store.set('fs', fs); aplicarFonte(); }

  // ---------- Avisos e alto contraste ----------
  let tAviso;
  function avisar(msg) {
    const host = dlg.open ? dlg : document.body;
    if (aviso.parentNode !== host) host.append(aviso);
    aviso.textContent = msg; aviso.classList.add('ver');
    clearTimeout(tAviso); tAviso = setTimeout(() => aviso.classList.remove('ver'), 3400);
  }
  const btnContraste = $('#btn-contraste');
  btnContraste.setAttribute('aria-pressed', String(document.documentElement.dataset.contraste === 'alto'));
  btnContraste.addEventListener('click', () => {
    const on = document.documentElement.dataset.contraste !== 'alto';
    if (on) document.documentElement.dataset.contraste = 'alto'; else delete document.documentElement.dataset.contraste;
    btnContraste.setAttribute('aria-pressed', String(on));
    store.set('contraste', on ? 'alto' : '');
  });

  // ---------- Início ----------
  const [ano, mes, dia] = D.atualizadoEm.split('-');
  $('#nota-dados').textContent = `Conteúdo reproduzido das páginas oficiais do PPGEAN, consultadas em ${dia}/${mes}/${ano}.`;
  aplicarVisao();
  aplicarFonte();
  render(true);
  setasChips();
  document.fonts?.ready.then(setasChips);
  mostrarDestaque(false, porId.get(D.destaque));
  numeros();
  rota();
})();
