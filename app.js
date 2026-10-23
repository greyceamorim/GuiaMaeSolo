(function(){
  'use strict';
  var app = document.getElementById('app');
  var I = {
    marca:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    ok:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    okp:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    zap:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-13.4 7.9L3 21l1.1-4.6A9 9 0 1 1 21 12z"/></svg>'
  };

  /* Estados e o nome oficial da Defensoria Pública de cada um (os links oficiais entram depois de conferidos um a um) */
  var UFS = [
    ['AC','Acre','Defensoria Pública do Estado do Acre'],['AL','Alagoas','Defensoria Pública do Estado de Alagoas'],
    ['AP','Amapá','Defensoria Pública do Estado do Amapá'],['AM','Amazonas','Defensoria Pública do Estado do Amazonas'],
    ['BA','Bahia','Defensoria Pública do Estado da Bahia'],['CE','Ceará','Defensoria Pública do Estado do Ceará'],
    ['DF','Distrito Federal','Defensoria Pública do Distrito Federal'],['ES','Espírito Santo','Defensoria Pública do Estado do Espírito Santo'],
    ['GO','Goiás','Defensoria Pública do Estado de Goiás'],['MA','Maranhão','Defensoria Pública do Estado do Maranhão'],
    ['MT','Mato Grosso','Defensoria Pública do Estado de Mato Grosso'],['MS','Mato Grosso do Sul','Defensoria Pública do Estado de Mato Grosso do Sul'],
    ['MG','Minas Gerais','Defensoria Pública do Estado de Minas Gerais'],['PA','Pará','Defensoria Pública do Estado do Pará'],
    ['PB','Paraíba','Defensoria Pública do Estado da Paraíba'],['PR','Paraná','Defensoria Pública do Estado do Paraná'],
    ['PE','Pernambuco','Defensoria Pública do Estado de Pernambuco'],['PI','Piauí','Defensoria Pública do Estado do Piauí'],
    ['RJ','Rio de Janeiro','Defensoria Pública do Estado do Rio de Janeiro'],['RN','Rio Grande do Norte','Defensoria Pública do Estado do Rio Grande do Norte'],
    ['RS','Rio Grande do Sul','Defensoria Pública do Estado do Rio Grande do Sul'],['RO','Rondônia','Defensoria Pública do Estado de Rondônia'],
    ['RR','Roraima','Defensoria Pública do Estado de Roraima'],['SC','Santa Catarina','Defensoria Pública do Estado de Santa Catarina'],
    ['SP','São Paulo','Defensoria Pública do Estado de São Paulo'],['SE','Sergipe','Defensoria Pública do Estado de Sergipe'],
    ['TO','Tocantins','Defensoria Pública do Estado do Tocantins']
  ];
  function defensoria(){
    for (var i = 0; i < UFS.length; i++) if (UFS[i][0] === s.uf) return UFS[i][2];
    return 'Defensoria Pública do seu estado';
  }

  /* Valores de referência (os mesmos do Guia de Direitos). Atualizar todo janeiro. */
  var V = {i1:false, i2:false, i3:false};
  var SM = 1621;            /* salário mínimo */
  var LIMITE_BOLSA = 218;   /* renda por pessoa do Bolsa Família */
  var LIMITE_MCMV = 3200;   /* renda da família, faixa 1 do Minha Casa Minha Vida (urbano) */
  function brl(n){ return 'R$ ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  function tenho(v){ return s.idade.indexOf(v) >= 0; }
  function preciso(v){ return s.need.indexOf(v) >= 0; }

  var QS = [
    {key:'idade', tipo:'varios', pergunta:'Quem precisa de ajuda na sua casa?', ajuda:'Marque tudo o que serve.',
      opcoes:[{v:'gest',label:'Estou grávida'},{v:'a0',label:'Bebê com menos de 1 ano'},{v:'a03',label:'Criança de 1 a 3 anos'},{v:'a45',label:'Criança de 4 a 5 anos'},{v:'a615',label:'Criança de 6 a 15 anos'},{v:'a16',label:'Jovem de 16 ou 17 anos'}]},
    {key:'need', tipo:'varios', pergunta:'Do que você precisa agora?', ajuda:'Marque tudo o que serve.',
      opcoes:[{v:'vaga',label:'Conseguir vaga em creche ou escola'},{v:'horario',label:'Alguém para cuidar nos horários em que a criança não está na escola'},{v:'dinheiro',label:'Ajuda com dinheiro'},{v:'pensao',label:'Pensão do pai ou da mãe da criança'}]},
    {key:'tentou', tipo:'um', pergunta:'Você já tentou conseguir a vaga?', ajuda:'Assim a gente mostra o passo certo para você.',
      mostrar:function(){ return preciso('vaga'); },
      opcoes:[{v:'nao',label:'Ainda não tentei'},{v:'sem',label:'Tentei e disseram que não tem vaga'},{v:'fila',label:'Estou na fila e já faz tempo'}]},
    {key:'uf', tipo:'uf', pergunta:'Em que estado você mora?', ajuda:'Assim a gente mostra o nome da Defensoria Pública do seu estado.'},
    {key:'pessoas', tipo:'um', pergunta:'Quantas pessoas moram na sua casa?', ajuda:'Conte com você e com as crianças.',
      opcoes:[{v:2,label:'2 pessoas'},{v:3,label:'3 pessoas'},{v:4,label:'4 pessoas'},{v:5,label:'5 pessoas'},{v:6,label:'6 ou mais'}]},
    {key:'renda', tipo:'renda', pergunta:'Quanto entra por mês na sua casa?', ajuda:'Some tudo: salário, bico, Bolsa Família, pensão. Pode ser um valor aproximado. Serve só para mostrar os direitos certos.'},
    {key:'medo', tipo:'um', pergunta:'Você ou as crianças têm medo de alguém, como o pai ou o companheiro?', ajuda:'Pode responder “prefiro não dizer”. Esta resposta fica só no seu celular.',
      opcoes:[{v:'sim',label:'Sim, tenho medo'},{v:'nao',label:'Não'},{v:'prefiro',label:'Prefiro não dizer'}]}
  ];
  function visiveis(){ return QS.filter(function(q){ return !q.mostrar || q.mostrar(); }); }
  function novo(){ return {tela:'intro', qi:0, idade:[], need:[], tentou:null, uf:'', pessoas:null, renda:null, rendaTxt:'', medo:null, feitos:{}}; }
  var s = novo();
  var VERSAO = 'maesolo-1';
  function fbNovo(){ return {etapa:'pergunta', voto:null, id:null, chave:null, texto:''}; }
  var fb = fbNovo();
  function enviarFeedback(dados){
    if (!/^https?:$/.test(location.protocol) || !window.fetch) return Promise.resolve(null);
    return fetch('/api/feedback', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(dados), keepalive:true})
      .then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; });
  }
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function topo(){
    return '<div class="marca"><span class="ico">' + I.marca + '</span>Guia da Mãe Solo</div>';
  }

  /* Monta o passo a passo de acordo com as respostas */
  function montar(){
    var pequeno = tenho('a0') || tenho('a03') || tenho('a45');
    var escola = tenho('a615') || tenho('a16');
    var def = defensoria();
    var pediu = s.tentou === 'sem' || s.tentou === 'fila';
    var G = [], idx = {};
    var Z = {};
    function grupo(k, nome){ idx[k] = {k:k, nome:nome, passos:[]}; G.push(idx[k]); }
    function add(g, id, titulo, texto, chip, curto, nota, cr, pot){
      idx[g].passos.push({id:id, titulo:titulo, texto:texto, chip:chip, nota:!!nota, crit:cr || null, pot:pot || null});
      if (curto) Z[id] = curto + (cr && cr.lim ? ' Limite de renda: ' + cr.lim + '.' : '') + (pot ? ' Potencial benefício: confirmar com ' + pot + '.' : '');
    }

    /* ---------- Renda por pessoa e limite de cada direito ---------- */
    var pp = (s.renda === null || !s.pessoas) ? null : s.renda / s.pessoas;
    var ppTxt = pp === null ? '' : brl(pp);
    function fx(lim){ return pp === null ? 'talvez' : (pp <= lim ? 'sim' : 'nao'); }
    var abs218 = fx(LIMITE_BOLSA), meio = fx(SM / 2), quarto = fx(SM / 4);
    var mcmv = s.renda === null ? 'talvez' : (s.renda <= LIMITE_MCMV ? 'sim' : 'nao');
    var cadPossivel = s.renda === null || meio === 'sim' || mcmv !== 'nao';
    var meioTxt = 'meio salário mínimo por pessoa (cerca de ' + brl(SM / 2) + ')';
    function crit(nivel, limTxt){
      return {nivel:nivel, lim:limTxt,
        ok: nivel === 'sim' ? 'Você está dentro do limite: você pode ter direito a isso.' : 'Confira se você está dentro do limite.',
        txt: nivel === 'sim'
        ? 'Sua renda por pessoa é ' + ppTxt + '. O limite é ' + limTxt + '. Como a sua renda é menor que o limite, você se encaixa.'
        : 'Você não informou a renda. O limite é ' + limTxt + '. Se a renda por pessoa da sua casa for menor que isso, você se encaixa.'};
    }
    var criancaEscola = tenho('a615') || tenho('a16');
    var bebe = tenho('gest') || tenho('a0');
    var quais = [];
    if (meio !== 'nao') quais.push('desconto na conta de luz');
    if (abs218 !== 'nao') { quais.push('Bolsa Família'); quais.push('botijão de gás de graça'); quais.push('absorvente gratuito'); }
    else if (meio !== 'nao' && criancaEscola) quais.push('absorvente gratuito para estudantes');
    if (meio !== 'nao' && criancaEscola) quais.push('Pé-de-Meia');
    if (quarto !== 'nao') quais.push('BPC, se alguém da casa tem deficiência');
    var cadTxt = V.i1 && quais.length
      ? 'É gratuito. Com o cadastro, você pode pedir: ' + quais.join(', ') + '. Estar no cadastro não garante o benefício: cada um tem o seu limite de renda.'
      : 'Para pedir quase todos os direitos por renda, a família precisa estar no Cadastro Único. É gratuito. Estar no cadastro não garante o benefício: cada um tem o seu limite de renda.';
    var semDir = V.i2 && meio === 'nao' && s.renda !== null;
    var semBenef = (s.renda !== null && abs218 === 'nao' && meio === 'nao' && mcmv === 'nao') ? ' Pela renda que você informou, hoje talvez nenhum benefício por renda da lista valha, mas o cadastro já fica pronto se a renda da casa mudar.' : '';
    var limCad = 'meio salário mínimo por pessoa (cerca de ' + brl(SM / 2) + ')';
    var crCad = s.renda === null
      ? {nivel:'talvez', lim:limCad, ok:'Confira se você está dentro do limite.', txt:'Você não informou a renda. O Cadastro Único é para famílias com renda de até ' + limCad + '. Famílias com renda maior só entram quando um programa pede, como o Minha Casa Minha Vida.'}
      : (meio === 'sim'
        ? {nivel:'sim', lim:limCad, ok:'Você está dentro do limite: você pode se cadastrar.', txt:'A renda da sua casa é ' + brl(s.renda) + ' por mês, e por pessoa é ' + ppTxt + '. O limite é ' + limCad + '.'}
        : {nivel:'talvez', lim:limCad, ok:'Você pode se cadastrar por causa do Minha Casa Minha Vida.', txt:'Sua renda por pessoa é ' + ppTxt + ', acima do limite geral do cadastro, que é ' + limCad + '. Mas famílias com renda maior podem se cadastrar quando um programa pede, como a Faixa 1 do Minha Casa Minha Vida.'});

    if (preciso('vaga') && (pequeno || escola)) {
      grupo('vaga', 'Conseguir a vaga');
      if (pequeno) {
        add('vaga','v-direito','A creche e a pré-escola são um direito do seu filho','A creche (de 0 a 3 anos) e a pré-escola (de 4 a 5 anos) são obrigação da prefeitura. O Supremo Tribunal Federal decidiu isso em 2022, e a família pode cobrar na Justiça, de graça, pela Defensoria Pública.','dir','Creche (0 a 3 anos) e pré-escola (4 a 5 anos) são obrigação da prefeitura. A família pode cobrar na Justiça, de graça, pela Defensoria.', true);
        add('vaga','v-inscrever','Fazer a inscrição na Secretaria de Educação da sua cidade','Quem cuida de creche é a prefeitura. Pergunte onde fazer a inscrição, porque algumas cidades têm site, telefone ou posto de atendimento. Diga que você trabalha e precisa do dia todo. Costuma pedir: certidão de nascimento da criança, seu documento e CPF e comprovante de endereço. A secretaria pode pedir mais coisas.', pediu ? 'ate' : 'urg','Dizer que trabalha e precisa do dia todo. Levar certidão de nascimento da criança, documento e CPF e comprovante de endereço.');
        add('vaga','v-protocolo','Guardar a prova do seu pedido','Anote o número (protocolo) e a data, tire foto do comprovante e anote o nome de quem atendeu. Se disserem que não tem vaga, peça a resposta por escrito. Sem essa prova, a Defensoria tem mais dificuldade para cobrar a prefeitura.', pediu ? 'urg' : 'ate','Anotar o número (protocolo), a data e o nome de quem atendeu. Tirar foto do comprovante. Se negarem a vaga, pedir a resposta por escrito.');
        add('vaga','v-prioridade','Sua cidade pode dar prioridade na fila','Algumas cidades dão prioridade a quem trabalha, a famílias do Cadastro Único e a filhos de mulheres vítimas de violência. É regra de cada cidade. Leve comprovante de trabalho e do Cadastro Único e peça que a secretaria confira.','dir','Algumas cidades dão prioridade a quem trabalha, ao Cadastro Único e a filhos de vítimas de violência. Levar comprovantes e pedir que a secretaria confira.');
      }
      if (tenho('a45')) {
        add('vaga','v-idade','Idade para a pré-escola','Em geral, a criança precisa ter 4 anos completos até 31 de março do ano da matrícula. Pergunte na secretaria se na sua cidade há alguma regra diferente.','ate','Pré-escola: em geral, 4 anos completos até 31 de março do ano da matrícula.', true);
      }
      if (escola) {
        add('vaga','v-escola','Vaga na escola, de 6 a 17 anos','O ensino é obrigatório e gratuito até os 17 anos, e a criança tem direito a vaga em escola pública perto de casa. Procure a escola mais próxima ou a Secretaria de Educação e peça a matrícula. Guarde o comprovante.','dir','Obrigatória e gratuita até os 17 anos. Pedir a matrícula na escola mais próxima ou na Secretaria de Educação. Guardar o comprovante.');
      }

      grupo('negaram', 'Se disserem que não tem vaga');
      add('negaram','n-defensoria','Procurar a ' + def,'É de graça e não precisa de advogado. Procure a ' + def + ' (procure esse nome na internet para achar endereço e telefone) ou o Conselho Tutelar da sua região, que também encaminha. A Defensoria pede a vaga à prefeitura e, se não resolver, pode entrar na Justiça. Em alguns casos, pede uma vaga em escola particular paga pela prefeitura. Nada disso é garantido.', pediu ? 'urg' : 'ate','É de graça e não precisa de advogado. Também dá para procurar o Conselho Tutelar da região.');
      add('negaram','n-levar','O que levar à Defensoria','O comprovante da inscrição (protocolo), a certidão de nascimento da criança, seu documento e CPF, comprovante de endereço e comprovante de renda. A Defensoria pode pedir outros papéis.','ate','Protocolo da inscrição, certidão de nascimento da criança, documento, CPF e comprovantes de endereço e de renda.');
      add('negaram','n-trabalho','Para não faltar ao trabalho','Pergunte se a Defensoria atende por telefone, WhatsApp ou internet. Em algumas cidades há mutirões em fins de semana para pedir vaga em creche.','ate','Perguntar se atende por telefone, WhatsApp ou internet. Em algumas cidades há mutirões de fim de semana.');
    }

    if (preciso('horario')) {
      grupo('horario', 'Cuidado fora do horário da escola');
      if (pequeno) add('horario','h-integral','Peça período integral','Ao pedir a vaga, diga que você trabalha e precisa do dia todo. Nem toda creche oferece, mas vale pedir.','ate','Dizer que trabalha e precisa do dia todo.');
      if (tenho('a615')) add('horario','h-scfv','Perguntar no CRAS sobre o Serviço de Convivência','Para crianças de 6 a 15 anos, o CRAS oferece atividades gratuitas no período em que elas não estão na escola. Cada cidade tem um número de vagas, então pergunte se há e peça para entrar na lista.','dir','Perguntar no CRAS sobre o Serviço de Convivência (atividades gratuitas, de 6 a 15 anos, no contraturno). As vagas variam por cidade.');
    }

    if (preciso('dinheiro')) {
      grupo('dinheiro', 'Ajuda com dinheiro');
      if (cadPossivel && !semDir) {
        add('dinheiro','d-cadunico','Fazer ou atualizar o Cadastro Único no CRAS',cadTxt + semBenef + ' Leve os documentos de todos da casa e um comprovante de endereço.','urg','Levar os documentos de todos da casa e comprovante de endereço. O cadastro é gratuito, mas não garante benefício: cada um tem o seu limite de renda.', false, crCad);
      }
      if (abs218 !== 'nao') {
        add('dinheiro','d-bolsa','Bolsa Família','Famílias com crianças e gestantes recebem mais. O valor e as regras mudam, então confirme no CRAS. Para ver outros direitos, use o Guia de Direitos.','dir','Famílias com crianças recebem mais. Confirmar valor e regras no CRAS.', false, crit(abs218, brl(LIMITE_BOLSA) + ' por pessoa'));
      } else if (!cadPossivel) {
        idx.dinheiro.manter = true;
        add('dinheiro','d-semRenda','Pela renda que você informou','A renda da sua casa está acima dos limites do Cadastro Único e dos programas deste guia. Se a renda da casa mudar, responda de novo.','ate','', true);
      }
    }

    if (preciso('pensao')) {
      grupo('pensao', 'Pensão do pai ou da mãe');
      add('pensao','p-defensoria','Pedir a pensão pela Defensoria Pública','É de graça e não precisa de advogado. Você não precisa conversar com o pai ou a mãe da criança: a Defensoria é quem avisa. Se você tem medo, conte ao atendente.','urg','É de graça e não precisa de advogado. A Defensoria avisa o outro responsável.');
      add('pensao','p-levar','O que levar','Certidão de nascimento da criança, seu documento e CPF, comprovante de renda e tudo o que souber do outro responsável: nome completo, onde mora e onde trabalha. Se o nome dele não está na certidão, avise: a Defensoria também ajuda nisso, de graça. Se tiver, leve recibos dos gastos com a criança (comida, escola, remédio).','ate','Certidão de nascimento, documento, CPF e o que souber do outro responsável (nome completo, onde mora, onde trabalha). Se tiver, recibos dos gastos com a criança.');
    }

    /* ---------- Outros direitos, filtrados pela renda por pessoa ---------- */
    var cadNecessario = meio !== 'nao' || mcmv !== 'nao';

    grupo('direitos', 'Outros direitos que você pode ter');
    add('direitos','d-aviso','Valores e regras mudam','Os valores abaixo são de 2026. Cada direito tem o seu limite de renda por pessoa, e mostramos se você está dentro. Confirme no CRAS ou no órgão responsável antes de ir.','ate','', true);
    if (cadNecessario && !preciso('dinheiro')) {
      add('direitos','d-cadunico','Estar no Cadastro Único',cadTxt + semBenef + ' Procure o CRAS da sua cidade com os documentos de todos da casa e um comprovante de endereço.','urg','Estar no Cadastro Único: procurar o CRAS com os documentos de todos da casa e comprovante de endereço. É gratuito, mas não garante benefício: cada um tem o seu limite de renda.', false, crCad);
    }
    if (meio !== 'nao') {
      add('direitos','x-luz','Desconto na conta de luz (Tarifa Social)', 'Famílias do Cadastro Único podem ter desconto na conta de luz. O desconto é sobre o consumo, e as regras e o valor dependem da distribuidora de energia. Pergunte na sua distribuidora ou no CRAS.','dir','Desconto na conta de luz (Tarifa Social) para famílias do Cadastro Único. O desconto é sobre o consumo.', false, crit(meio, meioTxt), 'a distribuidora de energia ou o CRAS');
    }
    if (meio !== 'nao') {
      add('direitos','x-gas','Gás do Povo: botijão de graça', 'Para famílias no Cadastro Único, com o cadastro atualizado nos últimos 24 meses. Quem recebe o Bolsa Família tem prioridade. Dá direito a trocar o botijão vazio de 13 kg em revenda credenciada: até 4 por ano para famílias de 2 ou 3 pessoas, e até 6 por ano para 4 ou mais. Para tirar dúvidas, ligue 121 ou use o app Gás do Povo.','dir','Gás do Povo: botijão de graça para famílias do Cadastro Único com cadastro atualizado nos últimos 24 meses (prioridade para quem recebe Bolsa Família). Dúvidas: 121 ou app Gás do Povo.', false, crit(meio, meioTxt));
    }
    if (abs218 !== 'nao') {
      add('direitos','x-absorvente','Absorvente gratuito para mulheres e meninas (pela renda)', 'Vale para você e para as meninas da casa que têm de 10 a 49 anos, se a família estiver no Cadastro Único. Para estudantes de escola pública existe outro benefício, com limite de renda maior. Precisa de uma autorização, que se gera no app Meu SUS Digital (precisa de conta gov.br nível prata ou ouro) e vale para 40 absorventes a cada 56 dias. Se tiver dificuldade, pergunte na UBS. Dúvidas: Disque Saúde 136.','dir','Absorvente gratuito na Farmácia Popular para mulheres e meninas de 10 a 49 anos no Cadastro Único. Gerar a autorização no app Meu SUS Digital (conta gov.br prata ou ouro). Dúvidas: 136.', false, crit(abs218, brl(LIMITE_BOLSA) + ' por pessoa'));
    }
    if (meio !== 'nao' && abs218 !== 'sim' && criancaEscola) {
      add('direitos','x-absorvente-escola','Absorvente gratuito para estudantes (escola pública)', 'É outro benefício, só para quem estuda em escola pública e tem de 10 a 49 anos: você ou suas filhas. O limite de renda é maior do que o do benefício anterior. A família precisa estar no Cadastro Único. A autorização se gera no app Meu SUS Digital (precisa de conta gov.br nível prata ou ouro). Se tiver dificuldade, pergunte na UBS. Dúvidas: Disque Saúde 136.','dir','Absorvente gratuito para estudantes de escola pública de 10 a 49 anos (você ou suas filhas), no Cadastro Único. Autorização no app Meu SUS Digital (conta gov.br prata ou ouro). Dúvidas: 136.', false, crit(meio, meioTxt), 'o Disque Saúde 136 ou a UBS');
    }
    if (criancaEscola && meio !== 'nao') {
      add('direitos','x-pedemeia','Pé-de-Meia, para filhos no ensino médio', 'Programa que paga um incentivo em dinheiro a estudantes do ensino médio público de famílias do Cadastro Único, e exige presença nas aulas. As regras mudam de ano para ano: pergunte na escola se o seu filho está no programa.' + (tenho('a16') ? '' : ' Vale quando seu filho entrar no ensino médio.'),'dir','Pé-de-Meia: incentivo em dinheiro para estudantes do ensino médio público de famílias do Cadastro Único, com presença nas aulas. As regras mudam de ano para ano.', false, crit(meio, meioTxt), 'a escola');
    }
    if (bebe) {
      add('direitos','x-salmat','Salário-maternidade para quem não tem carteira assinada','Não depende de renda: depende de ter contribuído para o INSS. Autônoma, MEI e contribuinte facultativa precisam de 10 meses de contribuição. Quem está desempregada precisa ainda manter a qualidade de segurada. O benefício é de 120 dias. Quem tem carteira assinada recebe pela empresa. Peça no Meu INSS (Novo Pedido) ou pelo 135. Antes, confira se as suas contribuições aparecem no INSS, porque erros no cadastro são uma causa comum de negativa. Se você nunca contribuiu, em geral não tem direito, exceto trabalhadoras rurais.','ate','Salário-maternidade (não depende de renda, e sim de ter contribuído ao INSS) para quem contribuiu ao INSS (autônoma, MEI e facultativa: 10 meses de contribuição): 120 dias. Pedir no Meu INSS ou pelo 135. Conferir antes se as contribuições aparecem no cadastro.');
    }
    if (mcmv !== 'nao') {
      var crM = {nivel:mcmv, lim:brl(LIMITE_MCMV) + ' por mês, somando todos da casa',
        ok: mcmv === 'sim' ? 'Você está dentro do limite: você pode ter direito a isso.' : 'Confira se você está dentro do limite.',
        txt: mcmv === 'sim'
        ? 'Aqui conta a renda de toda a casa, não por pessoa. A sua é ' + brl(s.renda) + ' por mês. O limite é ' + brl(LIMITE_MCMV) + ' por mês, somando todos da casa. Como a sua renda é menor que o limite, você se encaixa.'
        : 'Você não informou a renda. Aqui conta a renda de toda a casa, não por pessoa. O limite é ' + brl(LIMITE_MCMV) + ' por mês, somando todos da casa.'};
      add('direitos','x-mcmv','Prioridade para mulheres no Minha Casa Minha Vida', 'Famílias chefiadas por mulheres e mulheres vítimas de violência têm prioridade nas moradias subsidiadas (Lei 14.620/2023). O contrato fica de preferência no nome dela. Prioridade não garante a casa. Para a Faixa 1 (renda da casa até ' + brl(LIMITE_MCMV) + ') é preciso estar no Cadastro Único. O pedido é pela prefeitura, e ninguém pode cobrar para dar prioridade.','dir','Minha Casa Minha Vida: famílias chefiadas por mulheres e mulheres vítimas de violência têm prioridade. Pedir no setor de habitação da prefeitura. Ninguém pode cobrar.', false, crM);
    }
    if (quarto !== 'nao') {
      add('direitos','x-bpc','Se alguém da casa tem deficiência: BPC', 'O BPC paga um salário mínimo por mês a pessoa com deficiência em família de baixa renda. Não precisa ter contribuído para o INSS. A deficiência passa por avaliação do INSS. Peça pelo 135 ou no Meu INSS, com o Cadastro Único atualizado há menos de 2 anos, e pergunte no CRAS se vale fazer o pedido.','dir','Se alguém da casa tem deficiência: BPC, um salário mínimo por mês, sem ter contribuído ao INSS. Pedir pelo 135 ou Meu INSS, com Cadastro Único atualizado. Perguntar no CRAS se vale pedir.', false, crit(quarto, 'um quarto de salário mínimo por pessoa, na regra geral (cerca de ' + brl(SM / 4) + ')'));
    }
    if (pequeno || tenho('gest')) {
      if (s.uf === 'PR' && (tenho('a0') || tenho('a03'))) {
        add('direitos','x-leite','Leite das Crianças (Paraná)','O Paraná tem o programa Leite das Crianças: 1 litro de leite por dia, de graça, para crianças de 6 meses a 3 anos de famílias com renda de até meio salário mínimo regional por pessoa. Faça o cadastro no CRAS da sua cidade e leve documento com foto, comprovante de endereço, comprovante de renda e a certidão de nascimento da criança.','dir','Leite das Crianças (Paraná): 1 litro de leite por dia, de graça, para crianças de 6 meses a 3 anos, com renda até meio salário mínimo regional por pessoa. Cadastro no CRAS com documento com foto, comprovantes de endereço e de renda e certidão de nascimento.');
      } else {
        add('direitos','x-leite','Programa de leite','Algumas cidades e alguns estados têm programa de leite de graça para crianças pequenas de famílias de baixa renda. Cada um tem as suas regras. Pergunte no CRAS ou na Secretaria de Assistência Social da sua cidade.','ate','Algumas cidades e estados têm programa de leite para crianças pequenas de famílias de baixa renda. Perguntar no CRAS ou na Secretaria de Assistência Social.');
      }
    }

    if (semDir && cadPossivel) {
      grupo('depois', 'Se a renda da casa baixar');
      add('depois','d-cadunico','Fazer o Cadastro Único no CRAS, só para deixar pronto','Hoje, pela renda que você informou, os direitos ligados ao cadastro (luz, gás, absorvente, Bolsa Família) provavelmente não valem. Mas você pode fazer o cadastro agora: ele fica pronto caso a renda da casa baixe. É gratuito. Leve os documentos de todos da casa e um comprovante de endereço.','ate','Cadastro Único: pode fazer agora para deixar pronto, caso a renda da casa baixe. Levar os documentos de todos da casa e comprovante de endereço.', false, crCad);
    }
    var sdi = [];
    if (preciso('vaga') && (pequeno || escola)) sdi.push('vaga em creche ou escola e a Defensoria');
    if (preciso('pensao')) sdi.push('pensão');
    if (bebe) sdi.push('salário-maternidade');
    var todos = [];
    if (preciso('vaga') && pequeno) todos.push('Vaga em creche ou pré-escola');
    if (preciso('vaga') && escola) todos.push('Vaga na escola');
    if (preciso('vaga') && (pequeno || escola)) todos.push('Defensoria Pública, de graça, se negarem a vaga');
    if (preciso('horario') && tenho('a615')) todos.push('Atividades gratuitas no CRAS, fora do horário da escola');
    if (preciso('pensao')) todos.push('Pensão pela Defensoria, sem precisar falar com o pai ou a mãe');
    if (bebe) todos.push('Salário-maternidade, se você contribuiu para o INSS');
    var dts = [];
    G.forEach(function(g){ g.passos.forEach(function(p){ if (p.crit && p.crit.nivel === 'sim' && p.id !== 'd-cadunico') dts.push({t:p.titulo, pot:!!p.pot}); }); });
    G = G.filter(function(g){ return g.manter || g.passos.some(function(p){ return !p.nota; }); });
    return {G:G, Z:Z, def:def, resumo:{renda:s.renda, pessoas:s.pessoas, pp:pp, dts:dts, todos:todos, semDir:semDir, sdi:sdi}};
  }

  var CHIP = {urg:'Comece por aqui', dir:'Seu direito', ate:'Atenção'};

  function telaIntro(){
    return topo() +
      '<section class="card"><h1 class="h1">Direitos e apoio para mães solo</h1>' +
      '<p class="lead">Responda poucas perguntas e veja o que você pode pedir para os seus filhos e para a sua casa, onde pedir e o que levar.</p></section>' +
      '<div class="checks">' +
      ['Poucas perguntas, uma de cada vez','Não pedimos nome nem documento','Tudo o que aparece aqui é gratuito'].map(function(t){ return '<div>'+I.ok+'<span>'+t+'</span></div>'; }).join('') +
      '</div><button type="button" class="btn" data-a="comecar">Começar</button>';
  }

  function telaPergunta(){
    var vis = visiveis(), q = QS[s.qi], pos = vis.indexOf(q) + 1, n = vis.length;
    var h = topo() +
      '<div class="prog"><div>Pergunta ' + pos + ' de ' + n + '</div><div class="bar"><div id="barra" data-w="' + Math.round(pos / n * 100) + '"></div></div></div>' +
      '<h2 class="h2" id="perg">' + esc(q.pergunta) + '</h2><p class="ajuda">' + esc(q.ajuda) + '</p>';
    if (q.tipo === 'um') {
      h += '<div class="opts" role="group" aria-labelledby="perg">' + q.opcoes.map(function(o, i){
        return '<button type="button" class="opt" data-a="um" data-i="' + i + '">' + esc(o.label) + '</button>'; }).join('') + '</div>';
    } else if (q.tipo === 'renda') {
      h += '<label class="sel-label" for="renda">Valor por mês, em reais</label>' +
        '<div class="reais"><span aria-hidden="true">R$</span><input id="renda" class="inp" type="text" inputmode="numeric" autocomplete="off" maxlength="6" value="' + esc(s.rendaTxt) + '"></div>' +
        '<button type="button" class="btn" data-a="continuar" aria-disabled="' + (s.rendaTxt === '') + '">' + (s.rendaTxt === '' ? 'Digite o valor' : 'Continuar') + '</button>' +
        '<button type="button" class="link" data-a="renda-ns">Não sei dizer</button>';
    } else if (q.tipo === 'uf') {
      h += '<label class="sel-label" for="uf">Escolha o estado</label><select id="uf" class="sel"><option value="">Toque para escolher</option>' +
        UFS.map(function(u){ return '<option value="' + u[0] + '"' + (s.uf === u[0] ? ' selected' : '') + '>' + esc(u[1]) + '</option>'; }).join('') + '</select>' +
        '<button type="button" class="btn" data-a="continuar" aria-disabled="' + (!s.uf) + '">' + (s.uf ? 'Continuar' : 'Escolha um estado') + '</button>';
    } else {
      var marc = s[q.key];
      h += '<div class="opts" role="group" aria-labelledby="perg">' + q.opcoes.map(function(o, i){
        return '<button type="button" class="opt" data-a="varios" data-i="' + i + '" aria-pressed="' + (marc.indexOf(o.v) >= 0) + '"><span class="box">' + I.okp + '</span><span class="opt-txt"><span>' + esc(o.label) + '</span></span></button>'; }).join('') + '</div>' +
        '<button type="button" class="btn" data-a="continuar" aria-disabled="' + (marc.length === 0) + '">' + (marc.length ? 'Continuar' : 'Marque pelo menos uma') + '</button>';
    }
    return h + '<button type="button" class="link" data-a="voltar">Voltar</button>';
  }

  /* A mensagem de WhatsApp não leva o aviso de segurança, para ninguém ver por cima do ombro de quem recebe */
  function mensagem(r){
    var feitos = [];
    var m = 'Seus direitos e o passo a passo para os seus filhos\n';
    r.G.forEach(function(g){
      var pend = g.passos.filter(function(p){ if (p.nota) return true; if (s.feitos[p.id]) { feitos.push(p); return false; } return true; });
      pend = pend.filter(function(p){ return !p.nota || r.Z[p.id]; });
      if (!pend.length) return;
      m += '\n*' + g.nome.toUpperCase() + '*\n';
      pend.forEach(function(p){
        if (p.nota) { m += '• ' + r.Z[p.id] + '\n'; return; }
        m += '• *' + p.titulo + '*\n' + (r.Z[p.id] ? '   ' + r.Z[p.id] + '\n' : '');
      });
    });
    if (feitos.length) {
      m += '\n*JÁ FEITO*\n';
      feitos.forEach(function(p){ m += '✔ ' + p.titulo + '\n'; });
    }
    m += '\nPedir esses direitos é gratuito. Ninguém pode cobrar para dar vaga, prioridade ou benefício.';
    return m;
  }

  function telaFeedback(){
    var h = '<section class="card fb-card" aria-labelledby="fb-tit">';
    if (fb.etapa === 'pergunta') {
      h += '<h3 id="fb-tit">Este guia ajudou?</h3><div class="fb-botoes">' +
        '<button type="button" class="fb-btn" data-a="fb-voto" data-v="sim">Sim, ajudou</button>' +
        '<button type="button" class="fb-btn" data-a="fb-voto" data-v="nao">Não ajudou</button></div>';
    } else if (fb.etapa === 'coment') {
      var n = fb.texto.trim().length;
      h += '<h3 id="fb-tit" tabindex="-1">Obrigada por responder</h3>' +
        '<label for="fb-texto" class="fb-label">Faltou algum passo ou alguma coisa ficou confusa? (opcional)</label>' +
        '<p class="fb-aviso">Não escreva nomes, telefone, CPF nem detalhes sobre você ou sobre as crianças.</p>' +
        '<textarea id="fb-texto" maxlength="300" rows="4">' + esc(fb.texto) + '</textarea>' +
        '<p class="fb-conta" id="fb-conta">' + fb.texto.length + ' de 300 letras</p>' +
        '<button type="button" class="btn" data-a="fb-enviar" aria-disabled="' + (n === 0) + '">Enviar</button>' +
        '<button type="button" class="link" data-a="fb-pular">Não quero escrever</button>';
    } else {
      h += '<h3 id="fb-tit" tabindex="-1">Recebemos. Obrigada!</h3><p class="ajuda">Sua resposta ajuda a melhorar o guia para outras famílias.</p>';
    }
    return h + '</section>';
  }
  function passosMostrados(){
    var ids = [];
    montar().G.forEach(function(g){ g.passos.forEach(function(p){ ids.push(p.id); }); });
    return ids;
  }

  function critHtml(p){
    if (!p.crit) return '';
    var pot = !!p.pot;
    return '<p class="crit crit-' + (pot ? 'talvez' : p.crit.nivel) + '"><span class="crit-ok">' + (pot ? 'Potencial benefício: confirme com ' + esc(p.pot) + '.' : (p.crit.nivel === 'sim' ? '✔ ' : '') + esc(p.crit.ok)) + '</span><span class="crit-txt">' + esc(p.crit.txt) + '</span></p>';
  }

  function telaResultado(){
    var r = montar(), total = 0, feitos = 0;
    r.G.forEach(function(g){ g.passos.forEach(function(p){ if (!p.nota){ total++; if (s.feitos[p.id]) feitos++; } }); });
    var h = topo();
    if (s.medo === 'sim') {
      h += '<section class="perigo" aria-labelledby="pg-tit"><h2 id="pg-tit">Se você ou as crianças estão em perigo</h2><ul>' +
        '<li><b>Ligue 180</b>: Central de Atendimento à Mulher, gratuita, a qualquer hora.</li>' +
        '<li><b>Ligue 190</b> se o perigo é agora.</li>' +
        '<li><b>Disque 100</b> para denunciar violência contra criança.</li>' +
        '<li>Na delegacia ou na Defensoria, você pode pedir medida protetiva.</li></ul>' +
        '<p>Para pedir vaga na creche, você não precisa falar com o pai das crianças.</p>' +
        '<small>Este aviso não vai na mensagem de WhatsApp.</small></section>';
    }
    var rs = r.resumo;
    h += '<section class="renda-box" aria-labelledby="rb-tit"><h2 id="rb-tit">Sua renda por pessoa</h2>' +
      (rs.pp === null
        ? '<p>Você não informou a renda. Em cada direito abaixo mostramos o limite, para você conferir.</p>'
        : '<p class="renda-n">' + brl(rs.pp) + '</p><p>' + brl(rs.renda) + ' por mês, dividido por ' + (rs.pessoas === 6 ? '6 ou mais' : rs.pessoas) + ' pessoas.</p><p>Cada direito tem um limite de renda por pessoa. Em cada um mostramos se você está dentro do limite.</p>') +
      (rs.todos.length ? '<h3 class="renda-h">Direitos que não dependem de renda</h3><ul class="renda-ul2">' + rs.todos.map(function(x){ return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      '<h3 class="renda-h">Benefícios por causa da sua renda</h3>' +
      (rs.pp === null
        ? '<p>Você não informou a renda. Confira o limite de cada benefício abaixo.</p>'
        : (rs.dts.length
            ? '<ul class="renda-ul">' + rs.dts.map(function(x){ return '<li>' + (x.pot ? '? ' + esc(x.t) + ' (potencial, confirme)' : '✔ ' + esc(x.t)) + '</li>'; }).join('') + '</ul><p>Para pedir esses benefícios, faça antes o Cadastro Único. É gratuito.</p>'
            : '<p>Com essa renda, nenhum benefício por renda deste guia por enquanto.</p>')) +
      '</section>';
    if (rs.semDir) {
      h += '<section class="cuidado"><h3>Pela sua renda</h3><p>Os direitos ligados ao Cadastro Único (luz, gás, absorvente, Bolsa Família) provavelmente não valem agora. Mas estes não dependem de renda: ' + esc(rs.sdi.length ? rs.sdi.join(', ') : 'vaga em creche ou escola, Defensoria, pensão e salário-maternidade') + '.' + (rs.sdi.length ? '' : ' Para ver esses passos, refaça o guia escolhendo o que você precisa.') + '</p></section>';
    }
    h += '<section class="acolhe"><h2>Seus passos</h2>' +
      '<p>Estes são os passos para o seu caso. Comece pelos marcados “Comece por aqui”.</p>' +
      (total ? '<p class="feitos">' + feitos + ' de ' + total + ' passos feitos</p><p>Toque no quadrado quando terminar um passo.</p>' : '') + '</section>';
    r.G.forEach(function(g){
      var n = g.passos.filter(function(p){ return !p.nota; }).length;
      h += '<section class="etapa" aria-labelledby="et-' + g.k + '"><div class="etapa-top"><h3 id="et-' + g.k + '">' + esc(g.nome) + '</h3><span>' + (n ? n + (n === 1 ? ' passo' : ' passos') : '') + '</span></div>' +
        g.passos.map(function(p){
          if (p.nota) {
            return '<article class="passo nota"><div class="passo-txt"><span class="chip ' + p.chip + '">' + CHIP[p.chip] + '</span><b>' + esc(p.titulo) + '</b>' + critHtml(p) + '<p>' + esc(p.texto) + '</p></div></article>';
          }
          var f = !!s.feitos[p.id];
          return '<article class="passo' + (f ? ' feito' : '') + (p.chip === 'urg' && !f ? ' urgente' : '') + '">' +
            '<button type="button" class="marcar" data-a="feito" data-id="' + p.id + '" aria-pressed="' + f + '" aria-label="Marcar como feito: ' + esc(p.titulo) + '">' + I.okp + '</button>' +
            '<div class="passo-txt"><span class="chip ' + p.chip + '">' + CHIP[p.chip] + '</span><b>' + esc(p.titulo) + '</b>' + critHtml(p) + '<p>' + esc(p.texto) + '</p></div></article>';
        }).join('') + '</section>';
    });
    h += '<section class="cuidado"><h3>Cuidado com golpes</h3><ul>' +
      '<li>Ninguém pode cobrar para dar vaga em creche ou escola pública.</li>' +
      '<li>Pedir ajuda na Defensoria Pública e no CRAS é de graça.</li>' +
      '<li>Não passe senha, código ou dinheiro para ninguém que prometa “liberar” benefício.</li>' +
      '<li>Não existe programa oficial chamado “auxílio mãe solteira”. Desconfie de sites e mensagens que prometem isso.</li></ul></section>';
    h += '<section class="ajudas"><h3>Onde pedir ajuda de graça</h3><ul>' +
      '<li><b>Secretaria Municipal de Educação</b>: vaga em creche e escola</li>' +
      '<li><b>CRAS</b> da sua cidade: Cadastro Único e benefícios</li>' +
      '<li><b>Conselho Tutelar</b>: quando o direito da criança não é respeitado</li>' +
      '<li><b>' + esc(r.def) + '</b>: vaga, pensão e outros direitos</li>' +
      '<li><b>Ligue 180</b>: ajuda para mulheres em situação de violência</li></ul></section>';
    h += '<section class="ajudas"><h3>O que vai na mensagem</h3><ul class="lista-zap">' +
      '<li><span aria-hidden="true">•</span> O que falta fazer vai completo, com onde ir e o que levar.</li>' +
      '<li><span aria-hidden="true">✔</span> O que você marcou como feito vai no fim, só com o nome.</li></ul></section>';
    h += '<a class="btn" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=' + encodeURIComponent(mensagem(r)) + '">' + I.zap + 'Mandar a lista pelo WhatsApp</a>' +
      '<button type="button" class="link" data-a="recomecar">Responder de novo</button>' +
      telaFeedback() +
      '<p class="rodape">As informações não substituem a orientação da Defensoria Pública ou da prefeitura. Valores e regras mudam: confirme sempre no CRAS.</p>';
    return h;
  }

  function render(foco){
    app.innerHTML = s.tela === 'intro' ? telaIntro() : s.tela === 'q' ? telaPergunta() : telaResultado();
    var b = document.getElementById('barra'); if (b) b.style.width = b.getAttribute('data-w') + '%';
    if (foco){ window.scrollTo(0, 0); var t = app.querySelector('h1,h2'); if (t){ t.setAttribute('tabindex','-1'); t.focus({preventScroll:true}); } }
  }
  function avancar(){
    var i = s.qi + 1;
    while (i < QS.length && QS[i].mostrar && !QS[i].mostrar()) i++;
    if (i >= QS.length) s.tela = 'res'; else s.qi = i;
    render(true);
  }
  function voltar(){
    var i = s.qi - 1;
    while (i >= 0 && QS[i].mostrar && !QS[i].mostrar()) i--;
    if (i < 0) s.tela = 'intro'; else s.qi = i;
    render(true);
  }

  app.addEventListener('click', function(e){
    var b = e.target.closest('[data-a]'); if (!b) return;
    var a = b.getAttribute('data-a'), q = QS[s.qi];
    if (a === 'comecar'){ s.tela = 'q'; s.qi = 0; render(true); }
    else if (a === 'um'){ s[q.key] = q.opcoes[+b.getAttribute('data-i')].v; avancar(); }
    else if (a === 'varios'){
      var v = q.opcoes[+b.getAttribute('data-i')].v, arr = s[q.key];
      if (arr.indexOf(v) >= 0) arr = arr.filter(function(x){ return x !== v; }); else arr = arr.concat([v]);
      s[q.key] = arr; render(false);
    }
    else if (a === 'continuar'){ if (b.getAttribute('aria-disabled') === 'true') return; if (q.tipo === 'renda') s.renda = parseInt(s.rendaTxt, 10); avancar(); }
    else if (a === 'renda-ns'){ s.renda = null; s.rendaTxt = ''; avancar(); }
    else if (a === 'voltar'){ voltar(); }
    else if (a === 'feito'){
      var id = b.getAttribute('data-id'); s.feitos[id] = !s.feitos[id];
      var y = window.scrollY; render(false); window.scrollTo(0, y);
      var nb = app.querySelector('[data-id="' + id + '"]'); if (nb) nb.focus({preventScroll:true});
    }
    else if (a === 'fb-voto'){
      fb.voto = b.getAttribute('data-v'); fb.etapa = 'coment';
      enviarFeedback({voto:fb.voto, ferramenta:'maesolo', beneficios:passosMostrados(), versao:VERSAO})
        .then(function(r){ if (r && r.id){ fb.id = r.id; fb.chave = r.chave; } });
      var y1 = window.scrollY; render(false); window.scrollTo(0, y1);
      var t1 = document.getElementById('fb-tit'); if (t1) t1.focus({preventScroll:true});
    }
    else if (a === 'fb-enviar' || a === 'fb-pular'){
      if (a === 'fb-enviar'){
        var txt = fb.texto.trim(); if (!txt) return;
        enviarFeedback({voto:fb.voto, ferramenta:'maesolo', id:fb.id, chave:fb.chave, comentario:txt});
      }
      fb.etapa = 'final';
      var y2 = window.scrollY; render(false); window.scrollTo(0, y2);
      var t2 = document.getElementById('fb-tit'); if (t2) t2.focus({preventScroll:true});
    }
    else if (a === 'recomecar'){ s = novo(); fb = fbNovo(); render(true); }
  });
  app.addEventListener('change', function(e){
    if (e.target.id !== 'uf') return;
    s.uf = e.target.value;
    var bt = app.querySelector('[data-a="continuar"]');
    if (bt){ bt.setAttribute('aria-disabled', String(!s.uf)); bt.textContent = s.uf ? 'Continuar' : 'Escolha um estado'; }
  });
  app.addEventListener('input', function(e){
    if (e.target.id === 'renda'){
      var d = e.target.value.replace(/\D/g,'').slice(0,6);
      if (e.target.value !== d) e.target.value = d;
      s.rendaTxt = d;
      var bb = app.querySelector('[data-a="continuar"]');
      if (bb){ bb.setAttribute('aria-disabled', String(d === '')); bb.textContent = d === '' ? 'Digite o valor' : 'Continuar'; }
      return;
    }
    if (e.target.id !== 'fb-texto') return;
    fb.texto = e.target.value;
    var c = document.getElementById('fb-conta'); if (c) c.textContent = fb.texto.length + ' de 300 letras';
    var bt = app.querySelector('[data-a="fb-enviar"]'); if (bt) bt.setAttribute('aria-disabled', String(fb.texto.trim().length === 0));
  });
  render(false);
})();
