function temCondicao(pessoa, condicaoBuscada) {
  if (!Array.isArray(pessoa.condicoes)) return false;
  
  // Normaliza a busca e os dados para evitar erros com acentos ou maiúsculas
  return pessoa.condicoes.some(c => {
    const condNormalizada = String(c).toLowerCase().trim();
    const buscaNormalizada = String(condicaoBuscada).toLowerCase().trim();
    
    if (buscaNormalizada === 'diabetico') {
      return condNormalizada.includes('diabét') || condNormalizada.includes('diabetico');
    }
    if (buscaNormalizada === 'hipertenso') {
      return condNormalizada.includes('hipertens') || condNormalizada.includes('hipertenso');
    }
    if (buscaNormalizada === 'acamado') {
      return condNormalizada.includes('acamad') || condNormalizada.includes('acamado');
    }
    
    return condNormalizada === buscaNormalizada;
  });
}
