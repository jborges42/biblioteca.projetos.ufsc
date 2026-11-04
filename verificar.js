// Verifica trabalhos.js antes de publicar:  node verificar.js
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

if (erros.length) { console.error(`✗ ${erros.length} problema(s):\n- ${erros.join('\n- ')}`); process.exit(1); }
console.log(`✓ trabalhos.js ok: ${D.trabalhos.length} projetos, ${D.temas.length} temas, destaque "${D.destaque}".`);
