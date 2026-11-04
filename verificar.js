// Verifica trabalhos.js e sugestoes-ia.js antes de publicar:  node verificar.js
// Falha (código 1) com a lista de problemas; sem dependências além do Node.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ler = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(ler('trabalhos.js'), ctx);
vm.runInNewContext(ler('assets/vendor/qrcode.min.js') + ';this.qrcode = qrcode;', ctx);
const D = ctx.window.PPGEAN, erros = [];
const erro = (id, msg) => erros.push(`${id}: ${msg}`);

const MOTIVOS = ['araucaria', 'solo', 'broto', 'abelha', 'uva', 'minhoca', 'clima', 'dna', 'satelite', 'comunidade', 'flor', 'rio', 'folha'];
const temas = new Set(D.temas.map(t => t.id));
D.temas.forEach(t => { if (!MOTIVOS.includes(t.motivo)) erro(`tema ${t.id}`, `motivo inválido "${t.motivo}"`); });
const htmlOk = s => !/<(?!\/?em>)|&(?!(amp|lt|gt|quot|#39);)/.test(s) && (s.match(/<em>/g) || []).length === (s.match(/<\/em>/g) || []).length;
const vistos = new Set();

for (const w of D.trabalhos) {
  const id = w.id || '(sem id)';
  if (!/^\d{4}-[md]-[a-z0-9-]+$/.test(id)) erro(id, 'id fora do padrão "ano-m|d-nome"');
  if (vistos.has(id)) erro(id, 'id repetido'); vistos.add(id);
  if (!D.turmas[w.ingresso]) erro(id, `turma ${w.ingresso} sem link em "turmas"`);
  if (!['Mestrado', 'Doutorado'].includes(w.nivel)) erro(id, `nível inválido "${w.nivel}"`);
  if (!w.autor?.trim()) erro(id, 'sem autor');
  if (w.status === 'resumo' && !(w.titulo && w.resumo?.length)) erro(id, 'status "resumo" exige titulo e resumo');
  if (w.status === 'titulo' && (!w.titulo || w.resumo)) erro(id, 'status "titulo" exige titulo e nenhum resumo');
  if (w.status === 'a-definir' && w.titulo) erro(id, 'status "a-definir" não pode ter titulo');
  if (!['resumo', 'titulo', 'a-definir'].includes(w.status)) erro(id, `status inválido "${w.status}"`);
  (w.temas || []).forEach(t => temas.has(t) || erro(id, `tema inexistente "${t}"`));
  if (w.motivo && !MOTIVOS.includes(w.motivo)) erro(id, `motivo inválido "${w.motivo}"`);
  [w.titulo, ...(w.resumo || []), ...(w.palavrasChave || [])].filter(Boolean).forEach(s => htmlOk(s) || erro(id, `HTML não permitido (use só <em> e escape & < >): ${s.slice(0, 60)}`));
  [w.pagina, w.pdf].filter(Boolean).forEach(u => /^https:\/\//.test(u) || erro(id, `link sem https: ${u}`));
  // O QR do link profundo precisa caber com folga mesmo num endereço longo de hospedagem
  const q = ctx.qrcode(0, 'M'); q.addData(`https://ppgean.ufsc.br/biblioteca-de-projetos-de-pesquisa/index.html#/${id}`, 'Byte'); q.make();
  if (q.getModuleCount() > 57) erro(id, `QR muito denso (${q.getModuleCount()} módulos): encurte o id`);
}
const destaque = D.trabalhos.find(w => w.id === D.destaque);
if (D.destaque && !destaque?.titulo) erro('destaque', `"${D.destaque}" não existe ou não tem título`);

// sugestoes-ia.js: simulações "Como a IA pode ajudar" (os glifos são os desenhos de ia.js)
const ctxIA = { window: {} };
vm.runInNewContext(ler('sugestoes-ia.js'), ctxIA);
const IA = ctxIA.window.PPGEAN_SUGESTOES_IA?.sugestoes || [];
const GLIFOS = ['colembolo', 'acaro', 'minhoca', 'formiga', 'besouro', 'cupim', 'aranha', 'folha-oval', 'folha-lanceolada', 'folha-espinhosa', 'celula-normal', 'celula-micronucleo', 'celula-ponte', 'abelha'];
const fonteIA = ler('ia.js');
GLIFOS.forEach(g => fonteIA.includes(`${g.includes('-') ? `'${g}'` : g}: '<`) || erro('ia.js', `glifo "${g}" não existe no motor`));
const faixaOk = e => e && e.min < e.max && e.valor >= e.min && e.valor <= e.max && e.passo > 0;
const porIdIA = new Set();
for (const s of IA) {
  const id = `IA ${s.id}`, w = D.trabalhos.find(t => t.id === s.id);
  if (!w?.titulo) erro(id, 'projeto inexistente ou sem título');
  if (porIdIA.has(s.id)) erro(id, 'sugestão repetida'); porIdIA.add(s.id);
  ['titulo', 'ideia', 'tecnica', 'beneficio'].forEach(k => s[k]?.trim() || erro(id, `sem "${k}"`));
  if (s.motor === 'regressao') {
    if (!(s.entradas?.length >= 1 && s.entradas.length <= 3)) erro(id, 'regressão precisa de 1 a 3 entradas');
    (s.entradas || []).forEach((e, i) => { if (!faixaOk(e)) erro(id, `entrada ${i + 1}: faixa inválida`); if (!e.peso || Math.abs(e.peso) > 1) erro(id, `entrada ${i + 1}: peso deve estar em [-1, 1] e ≠ 0`); });
    if (!(s.saida?.min < s.saida?.max)) erro(id, 'saída inválida');
  } else if (s.motor === 'classificacao') {
    if (!(s.classes?.length >= 2 && s.classes.length <= 4)) erro(id, 'classificação precisa de 2 a 4 classes');
    (s.classes || []).forEach(c => GLIFOS.includes(c.forma) || erro(id, `glifo inexistente "${c.forma}"`));
  } else if (s.motor === 'mapa') {
    if (!faixaOk(s.controle)) erro(id, 'controle do mapa com faixa inválida');
    if (!['tempo', 'sobreposicao', 'acesso'].includes(s.modo)) erro(id, `modo inválido "${s.modo}"`);
    if (s.modo === 'sobreposicao' ? !(s.especies?.a && s.especies?.b) : !s.camada) erro(id, `faltam campos do modo "${s.modo}"`);
    if (s.modo === 'acesso' && !s.marcadores) erro(id, 'modo "acesso" precisa de "marcadores"');
    if (!s.indicador) erro(id, 'sem "indicador"');
  } else if (s.motor === 'agrupamento') {
    if (!(s.grupos?.length >= 2 && s.grupos.length <= 4) || !s.eixos?.x || !s.eixos?.y || !s.item) erro(id, 'agrupamento precisa de item, eixos e 2 a 4 grupos');
  } else if (s.motor === 'texto') {
    if (!s.trecho?.startsWith('Exemplo fictício')) erro(id, 'o trecho deve começar com "Exemplo fictício"');
    (s.entidades || []).forEach(e => { if (!s.trecho.includes(e.termo)) erro(id, `termo ausente do trecho: "${e.termo}"`); if (!s.tipos?.includes(e.tipo)) erro(id, `tipo não declarado: "${e.tipo}"`); });
  } else erro(id, `motor inválido "${s.motor}"`);
}

// Perguntas do LeapSpace: curtas, nos dois idiomas, e "ia" só onde há simulação
const LEAP = ctxIA.window.PPGEAN_SUGESTOES_IA?.leapspace || {};
const TIPOS_LEAP = ['panorama', 'evidencias', 'ia', 'especialistas', 'financiamento'];
for (const [pid, ps] of Object.entries(LEAP)) {
  const id = `LeapSpace ${pid}`;
  if (!D.trabalhos.find(t => t.id === pid)?.titulo) erro(id, 'projeto inexistente ou sem título');
  if (ps.length < 3) erro(id, 'menos de 3 perguntas');
  ps.forEach(p => {
    if (!TIPOS_LEAP.includes(p.tipo)) erro(id, `tipo inválido "${p.tipo}"`);
    if (p.tipo === 'ia' && !porIdIA.has(pid)) erro(id, 'pergunta "ia" sem simulação de IA no projeto');
    ['pt', 'en'].forEach(l => { if (!p[l]?.trim() || p[l].length > 200) erro(id, `pergunta ${p.tipo}/${l} vazia ou com mais de 200 caracteres`); });
  });
}

if (erros.length) { console.error(`✗ ${erros.length} problema(s):\n- ${erros.join('\n- ')}`); process.exit(1); }
console.log(`✓ dados ok: ${D.trabalhos.length} projetos, ${D.temas.length} temas, destaque "${D.destaque}", ${IA.length} simulações de IA, perguntas LeapSpace em ${Object.keys(LEAP).length} projetos.`);
