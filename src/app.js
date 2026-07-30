/* Viveiro — lógica da página
   escrita no 1o semestre de 2026

   Como funciona, resumido:
   - os dados vêm do arquivo dados.js, na variável DADOS
   - o objeto `estado` guarda o que está selecionado agora
   - a função desenhar() apaga a tela e redesenha tudo a partir do estado
   Se você mudar alguma coisa nos dados, chame desenhar() de novo.
*/

var estado = {
  pessoa: null,      // id da pessoa que está navegando
  busca: "",         // texto digitado
  tag: null,         // tag clicada, se houver
  aba: "mural"
};

/* ------------------------------------------------ atalhos aos dados */

function pessoaPorId(id) {
  for (var i = 0; i < DADOS.pessoas.length; i++) {
    if (DADOS.pessoas[i].id === id) return DADOS.pessoas[i];
  }
  return null;
}

function nomeDe(id) {
  var p = pessoaPorId(id);
  return p ? p.nome : "(desconhecido)";
}

function ideiaPorId(id) {
  for (var i = 0; i < DADOS.ideias.length; i++) {
    if (DADOS.ideias[i].id === id) return DADOS.ideias[i];
  }
  return null;
}

/* ------------------------------------------------------- filtragem */

function ideiasVisiveis() {
  var resultado = [];
  for (var i = 0; i < DADOS.ideias.length; i++) {
    var ideia = DADOS.ideias[i];

    // filtro por texto
    var casaTexto = true;
    if (estado.busca !== "") {
      casaTexto = ideia.titulo.includes(estado.busca) ||
                  ideia.resumo.includes(estado.busca);
    }

    // filtro por tag
    var casaTag = true;
    if (estado.tag !== null) {
      casaTag = ideia.tags.indexOf(estado.tag) >= 0;
    }

    if (casaTexto && casaTag) resultado.push(ideia);
  }
  return resultado;
}

/* --------------------------------------------------------- desenho */

function desenhar() {
  desenharSeletorDePessoas();
  desenharMural();
  desenharGrupos();
  document.getElementById("base").textContent = "base " + DADOS.codigo;
}

function desenharSeletorDePessoas() {
  var alvo = document.getElementById("quem");
  if (alvo.options.length > 0) return;   // só monta uma vez
  for (var i = 0; i < DADOS.pessoas.length; i++) {
    var p = DADOS.pessoas[i];
    var opcao = document.createElement("option");
    opcao.value = p.id;
    opcao.textContent = p.nome + " (" + p.curso + ")";
    alvo.appendChild(opcao);
  }
  alvo.value = estado.pessoa;
}

function desenharMural() {
  var lista = ideiasVisiveis();
  var alvo = document.getElementById("cartoes");
  alvo.innerHTML = "";

  for (var i = 0; i < lista.length; i++) {
    alvo.appendChild(montarCartao(lista[i]));
  }

  document.getElementById("contagem").textContent =
    lista.length + " de " + DADOS.ideias.length + " ideias";

  var aviso = document.getElementById("filtro-ativo");
  if (estado.tag !== null) {
    aviso.textContent = "mostrando apenas ideias com a etiqueta: " + estado.tag;
  } else {
    aviso.textContent = "";
  }
}

function montarCartao(ideia) {
  var cartao = document.createElement("div");
  cartao.className = "cartao";

  var titulo = document.createElement("h3");
  titulo.textContent = ideia.titulo;
  cartao.appendChild(titulo);

  var autoria = document.createElement("div");
  autoria.className = "autoria";
  autoria.textContent = nomeDe(ideia.autor) + " · " + ideia.data;
  cartao.appendChild(autoria);

  var resumo = document.createElement("p");
  resumo.className = "resumo";
  resumo.textContent = ideia.resumo;
  cartao.appendChild(resumo);

  var tags = document.createElement("div");
  tags.className = "tags";
  for (var i = 0; i < ideia.tags.length; i++) {
    var etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = ideia.tags[i];
    etiqueta.onclick = criarCliqueDeTag(ideia.tags[i]);
    tags.appendChild(etiqueta);
  }
  cartao.appendChild(tags);

  var rodape = document.createElement("div");
  rodape.className = "rodape";

  var botao = document.createElement("button");
  botao.className = "apoiar";
  botao.textContent = "apoiar";
  botao.onclick = criarCliqueDeApoio(ideia.id);
  rodape.appendChild(botao);

  var contador = document.createElement("span");
  contador.className = "apoios";
  contador.textContent = ideia.apoios + " apoios";
  rodape.appendChild(contador);

  cartao.appendChild(rodape);
  return cartao;
}

function desenharGrupos() {
  var alvo = document.getElementById("lista-grupos");
  alvo.innerHTML = "";
  for (var i = 0; i < DADOS.grupos.length; i++) {
    var g = DADOS.grupos[i];
    var item = document.createElement("li");

    var quantos = document.createElement("span");
    quantos.className = "quantos";
    quantos.textContent = g.membros.length + " membros";
    item.appendChild(quantos);

    var nome = document.createElement("span");
    nome.className = "nome";
    nome.textContent = g.nome;
    item.appendChild(nome);

    var descricao = document.createElement("p");
    descricao.className = "descricao";
    descricao.textContent = g.descricao;
    item.appendChild(descricao);

    alvo.appendChild(item);
  }
}

/* ---------------------------------------------------------- ações */

function criarCliqueDeTag(tag) {
  return function () {
    estado.tag = tag;
    desenhar();
  };
}

function criarCliqueDeApoio(idIdeia) {
  return function () {
    var ideia = ideiaPorId(idIdeia);
    ideia.apoios = ideia.apoios + 1;
  };
}

function trocarAba(qual) {
  estado.aba = qual;
  document.getElementById("mural").className = (qual === "mural") ? "" : "escondido";
  document.getElementById("grupos").className = (qual === "grupos") ? "" : "escondido";
  document.getElementById("aba-mural").className = (qual === "mural") ? "aba ativa" : "aba";
  document.getElementById("aba-grupos").className = (qual === "grupos") ? "aba ativa" : "aba";
}

/* --------------------------------------------------------- início */

function iniciar() {
  estado.pessoa = DADOS.pessoas[0].id;

  document.getElementById("busca").oninput = function (e) {
    estado.busca = e.target.value;
    desenharMural();
  };

  document.getElementById("quem").onchange = function (e) {
    estado.pessoa = Number(e.target.value);
  };

  document.getElementById("aba-mural").onclick  = function () { trocarAba("mural"); };
  document.getElementById("aba-grupos").onclick = function () { trocarAba("grupos"); };

  desenhar();
}

iniciar();
