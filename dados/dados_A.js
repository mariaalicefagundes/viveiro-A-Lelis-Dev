// dados/dados_A.js
// Dados de exemplo (semente) do Viveiro. Carregados apenas na primeira
// visita — depois disso, o que está salvo no navegador manda.
// Datas são geradas em relação a "hoje" para que os exemplos de
// histórias como V-10 (ideias paradas) continuem fazendo sentido em
// qualquer dia em que o site for aberto.

(function () {
  function diasAtras(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  const pessoas = [
    { id: "p1", nome: "Ana Beatriz Souza", tipo: "aluno", curso: "Ciência da Computação", interesses: ["inteligência artificial", "jogos", "robótica"] },
    { id: "p2", nome: "Diego Ferraz Lima", tipo: "aluno", curso: "Ciência da Computação", interesses: ["robótica", "automação", "iot"] },
    { id: "p3", nome: "Camila Nogueira", tipo: "aluno", curso: "Sistemas de Informação", interesses: ["dados", "música", "acessibilidade"] },
    { id: "p4", nome: "Rafael Tadeu Prado", tipo: "aluno", curso: "Engenharia de Software", interesses: ["jogos", "realidade aumentada"] },
    { id: "p5", nome: "Juliana Weber", tipo: "aluno", curso: "Design Gráfico", interesses: ["design de interfaces", "acessibilidade", "música"] },
    { id: "p6", nome: "Otávio Marques", tipo: "aluno", curso: "Sistemas de Informação", interesses: ["dados", "sustentabilidade"] },
    { id: "p7", nome: "Larissa Andrade", tipo: "aluno", curso: "Engenharia de Software", interesses: ["mobile", "saúde"] },
    { id: "p8", nome: "Pedro Henrique Vaz", tipo: "aluno", curso: "Ciência da Computação", interesses: ["inteligência artificial", "dados"] },
    { id: "p9", nome: "Profª. Marta Coelho", tipo: "professor", curso: "Ciência da Computação", interesses: ["inteligência artificial", "robótica"] },
    { id: "p10", nome: "Prof. Ivan Rezende", tipo: "professor", curso: "Sistemas de Informação", interesses: ["dados", "sustentabilidade"] }
  ];

  const ideias = [
    {
      id: "i1",
      titulo: "Sensor de umidade para hortas escolares",
      resumo: "Um kit simples com sensor de umidade e alerta por celular para hortas mantidas por escolas públicas, evitando que as mudas sequem nas férias.",
      tags: ["automação", "iot", "sustentabilidade"],
      autorId: "p2",
      data: diasAtras(3),
      interessados: ["p1", "p6"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i2",
      titulo: "Tradutor de Libras para avisos do campus",
      resumo: "Aplicativo que traduz avisos escritos (murais, e-mails da coordenação) em vídeos curtos com um avatar em Libras.",
      tags: ["acessibilidade", "mobile"],
      autorId: "p5",
      data: diasAtras(6),
      interessados: ["p3", "p7", "p1"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i3",
      titulo: "Painel de dados de evasão por curso",
      resumo: "Um painel que cruza notas, frequência e trancamentos para ajudar a coordenação a identificar turmas em risco de evasão com antecedência.",
      tags: ["dados", "sustentabilidade"],
      autorId: "p6",
      data: diasAtras(9),
      interessados: ["p3", "p8", "p10", "p1"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i4",
      titulo: "Jogo de tabuleiro digital sobre lógica de programação",
      resumo: "Um jogo por turnos, jogável no navegador, em que cada carta representa um comando; pensado para as primeiras semanas de Algoritmos.",
      tags: ["jogos", "inteligência artificial"],
      autorId: "p1",
      data: diasAtras(2),
      interessados: ["p4"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i5",
      titulo: "Assistente de estudos com repetição espaçada",
      resumo: "App de flashcards que usa repetição espaçada e sugere o melhor horário de revisão com base no histórico de acertos do aluno.",
      tags: ["inteligência artificial", "mobile", "saúde"],
      autorId: "p8",
      data: diasAtras(20),
      interessados: ["p1", "p7", "p4", "p2"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i6",
      titulo: "Rota acessível dentro do campus",
      resumo: "Mapa do campus que calcula rotas evitando escadas e trechos sem rampa, pensado para cadeirantes e pessoas com mobilidade reduzida.",
      tags: ["acessibilidade", "dados"],
      autorId: "p3",
      data: diasAtras(25),
      interessados: ["p5"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i7",
      titulo: "Braço robótico de baixo custo para oficinas",
      resumo: "Braço robótico feito com peças impressas em 3D e motores de sucata, para ensinar cinemática básica sem depender de kits caros.",
      tags: ["robótica", "automação"],
      autorId: "p9",
      data: diasAtras(30),
      interessados: ["p2", "p1", "p8", "p4"],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i8",
      titulo: "Playlist colaborativa da sala de estudos",
      resumo: "Uma fila de música compartilhada para as salas de estudo em grupo, com votos para pular faixas e limite de volume por horário.",
      tags: ["música", "mobile"],
      autorId: "p5",
      data: diasAtras(28),
      interessados: [],
      anexoId: null,
      estadoForcado: null
    },
    {
      id: "i9",
      titulo: "Óculos com realidade aumentada para prática de solda",
      resumo: "Óculos de segurança com overlay de realidade aumentada mostrando ângulo e distância recomendados durante a prática de solda.",
      tags: ["realidade aumentada", "automação"],
      autorId: "p4",
      data: diasAtras(1),
      interessados: [],
      anexoId: null,
      estadoForcado: null
    }
  ];

  const grupos = [
    { id: "g1", nome: "Robótica & Automação", tema: "robótica", membros: ["p2", "p1", "p9"] },
    { id: "g2", nome: "Dados para a gestão acadêmica", tema: "dados", membros: ["p6", "p10", "p3"] },
    { id: "g3", nome: "Acessibilidade no campus", tema: "acessibilidade", membros: ["p5", "p3"] },
    { id: "g4", nome: "Jogos e aprendizagem", tema: "jogos", membros: ["p1"] }
  ];

  window.DADOS_SEMENTE = { pessoas, ideias, grupos, mensagens: [], buscas: [], atividades: [] };
})();
