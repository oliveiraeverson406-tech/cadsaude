/* 📁 dados.js — lógica compartilhada do Painel de Saúde (v5 Completo) */

const CHAVE_STORAGE = 'cadastroPessoasSaude';

function carregarPessoas() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  if (!dados) return [];
  try {
    let pessoas = JSON.parse(dados);
    if (!Array.isArray(pessoas)) return [];

    // 👉 ORDENAÇÃO EM ORDEM ALFABÉTICA (A a Z) PELO NOME
    pessoas.sort((a, b) => {
      const nomeA = (a.nome || "").toLowerCase();
      const nomeB = (b.nome || "").toLowerCase();
      return nomeA.localeCompare(nomeB);
    });

    return pessoas;
  } catch (e) {
    return [];
  }
}

function salvarPessoas(pessoas) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pessoas));
}

function gerarId() {
  return 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

function calcularIdade(nascimento) {
  if (!nascimento) return null;
  const hoje = new Date();
  const nasc = new Date(nascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
}

function formatarData(nascimento) {
  if (!nascimento) return '';
  const [ano, mes, dia] = nascimento.split('-');
  return `${dia}/${mes}/${ano}`;
}

function temCondicao(pessoa, condicao) {
  return Array.isArray(pessoa.condicoes) && pessoa.condicoes.includes(condicao);
}

function calcularTotais(pessoas) {
  const totais = {
    totalGeral: pessoas.length,
    criancas: 0,
    adultos: 0,
    idosos: 0,
    diabeticos: 0,
    hipertensos: 0,
    ambos: 0,
    acamados: 0
  };

  pessoas.forEach(p => {
    const idade = calcularIdade(p.nascimento);
    if (idade !== null) {
      if (idade < 18) totais.criancas++;
      else if (idade < 60) totais.adultos++;
      else totais.idosos++;
    }

    const diabetico = temCondicao(p, 'diabetico');
    const hipertenso = temCondicao(p, 'hipertenso');
    const acamado = temCondicao(p, 'acamado');

    if (diabetico && hipertenso) totais.ambos++;
    else if (diabetico) totais.diabeticos++;
    else if (hipertenso) totais.hipertensos++;

    if (acamado) totais.acamados++;
  });

  return totais;
}

function exportarBackup() {
  const pessoas = carregarPessoas();
  const backup = {
    tipo: 'backup-cadastro-pessoas',
    geradoEm: new Date().toISOString(),
    pessoas: pessoas
  };

  const arquivo = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = `backup-cadastro-pessoas-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`;
  link.click();

  const totais = calcularTotais(pessoas);
  alert(`✅ Backup exportado com sucesso!\n\nTotal de pessoas: ${totais.totalGeral}`);
}

function importarBackup(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = function (e) {
    try {
      const conteudo = JSON.parse(e.target.result);

      // Compatibilidade tanto para objetos estruturados quanto arrays diretos
      const listaPessoas = Array.isArray(conteudo) ? conteudo : conteudo.pessoas;

      if (!Array.isArray(listaPessoas)) {
        alert('❌ Arquivo inválido! Esse arquivo não contém uma lista de cadastros reconhecida.');
        return;
      }

      salvarPessoas(listaPessoas);

      const totalBackup = listaPessoas.length;
      alert(`✅ Backup importado com sucesso!\n\nTotal de cadastros carregados: ${totalBackup}`);

      if (typeof atualizarTela === 'function') {
        atualizarTela();
      }

    } catch (erro) {
      alert('❌ Erro ao ler o arquivo JSON. O arquivo pode estar corrompido.');
    } finally {
      event.target.value = '';
    }
  };
  leitor.readAsText(arquivo);
}
