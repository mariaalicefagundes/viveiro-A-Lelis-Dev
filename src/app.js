// src/app.js
// Lógica do Viveiro. Vanilla JS, sem framework — mesma linha do projeto
// original. Comentários indicam qual história do BACKLOG.md cada trecho
// atende, e as decisões tomadas onde a história deixava algo em aberto.
//
// Decisões registradas (histórias que exigiram uma escolha da equipe):
//  V-06 estado por interesse: menos de 2 interessados = semente,
//       de 2 a 4 = germinando, 5 ou mais = proposta.
//  V-10 ideia parada: some do mural se tiver 14 dias ou mais de publicada
//       E menos de 3 interessados (o que acontecer primeiro mantém a ideia
//       visível: nova o suficiente OU concorrida o suficiente).
//  V-11 "curso mais ativo": conta publicações, interesses registrados,
//       entradas em grupo e buscas feitas por alunos daquele curso.
//  V-12 "mais de três interessados": tratado como 4 ou mais.

(function () {
  "use strict";

  const CHAVE_DADOS = "viveiro:dados";
  const CHAVE_USUARIO = "viveiro:usuario";
  const CHAVE_RASCUNHO = "viveiro:rascunho:";

  let dados; // { pessoas, ideias, grupos, mensagens, buscas, atividades }
  let usuarioAtualId;
  let filtroIdeiaId = null; // usado por V-01 (abrir uma ideia específica a partir da página da pessoa)
  let mostrarSoRecomendadas = false;
  let painelMensagensAberto = false;

  // ---------------------------------------------------------------- util

  function hojeISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function diasEntre(dataISO) {
    const ms = new Date(hojeISO()) - new Date(dataISO);
    return Math.floor(ms / 86400000);
  }

  function formatarData(dataISO) {
    // corrige o defeito B-03 (data em formato ISO na tela)
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function normalizar(txt) {
    // corrige o defeito B-04 (acentos e maiúsculas atrapalhando a busca)
    return (txt || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function escaparHtml(txt) {
    const div = document.createElement("div");
    div.textContent = txt == null ? "" : String(txt);
    return div.innerHTML;
  }

  function pessoaPorId(id) {
    return dados.pessoas.find((p) => p.id === id);
  }

  function ideiaPorId(id) {
    return dados.ideias.find((i) => i.id === id);
  }

  function usuarioAtual() {
    return pessoaPorId(usuarioAtualId);
  }

  // ---------------------------------------------------------- persistência

  function carregarDados() {
    const salvo = localStorage.getItem(CHAVE_DADOS);
    if (salvo) {
      try {
        const guardado = JSON.parse(salvo);
        // pessoas continuam vindo da semente (não há cadastro de pessoas no MVP)
        guardado.pessoas = window.DADOS_SEMENTE.pessoas;
        return guardado;
      } catch (e) {
        console.warn("Não foi possível ler os dados salvos, usando a semente.", e);
      }
    }
    return JSON.parse(JSON.stringify(window.DADOS_SEMENTE));
  }

  function salvar() {
    const { pessoas, ...persistivel } = dados;
    localStorage.setItem(CHAVE_DADOS, JSON.stringify(persistivel));
  }

  function registrarAtividade(tipo, pessoaId) {
    const pessoa = pessoaPorId(pessoaId);
    if (!pessoa) return;
    dados.atividades.push({ tipo, pessoaId, curso: pessoa.curso, data: hojeISO() });
    salvar();
  }

  // -------------------------------------------------------------- estado

  function estadoDe(ideia) {
    if (ideia.estadoForcado) return ideia.estadoForcado;
    const n = ideia.interessados.length;
    if (n >= 5) return "proposta";
    if (n >= 2) return "germinando";
    return "semente";
  }

  const ROTULO_ESTADO = { semente: "semente", germinando: "germinando", proposta: "proposta" };

  // ----------------------------------------------------- V-10, filtragem

  function ideiaAtiva(ideia) {
    return diasEntre(ideia.data) < 14 || ideia.interessados.length >= 3;
  }

  function ideiasParaExibir() {
    let lista = dados.ideias.filter(ideiaAtiva);

    if (filtroIdeiaId) {
      return lista.filter((i) => i.id === filtroIdeiaId);
    }

    const termoBusca = normalizar(document.getElementById("busca").value);
    const termoCurso = normalizar(document.getElementById("filtro-curso").value);

    if (termoBusca) {
      lista = lista.filter((i) => {
        const alvo = normalizar(i.titulo + " " + i.resumo + " " + i.tags.join(" "));
        return alvo.includes(termoBusca);
      });
    }

    if (termoCurso) {
      lista = lista.filter((i) => {
        const autor = pessoaPorId(i.autorId);
        return autor && normalizar(autor.curso).includes(termoCurso);
      });
    }

    if (mostrarSoRecomendadas) {
      const interesses = usuarioAtual().interesses.map(normalizar);
      lista = lista.filter((i) => i.tags.some((t) => interesses.includes(normalizar(t))));
    }

    return lista.slice().sort((a, b) => (a.data < b.data ? 1 : -1));
  }

  // ------------------------------------------------------------- V-01

  function abrirPessoa(id) {
    filtroIdeiaId = null;
    mudarView("pessoa");
    const pessoa = pessoaPorId(id);
    const ideiasDaPessoa = dados.ideias.filter((i) => i.autorId === id);

    const listaHtml = ideiasDaPessoa.length
      ? `<ul class="lista-ideias-pessoa">${ideiasDaPessoa
          .map((i) => `<li><button data-abrir-ideia="${i.id}">${escaparHtml(i.titulo)}</button></li>`)
          .join("")}</ul>`
      : `<p>ainda não publicou ideias</p>`;

    document.getElementById("conteudo-pessoa").innerHTML = `
      <button class="botao-secundario voltar" id="voltar-mural">← voltar ao mural</button>
      <div class="cabecalho-pessoa">
        <h2>${escaparHtml(pessoa.nome)}</h2>
        <p class="tipo-curso">${pessoa.tipo === "professor" ? "Professor(a)" : "Aluno(a)"} · ${escaparHtml(pessoa.curso)}</p>
        <div class="tags">${pessoa.interesses.map((t) => `<span class="tag">${escaparHtml(t)}</span>`).join("")}</div>
      </div>
      <h3>Ideias publicadas</h3>
      ${listaHtml}
    `;

    document.getElementById("voltar-mural").addEventListener("click", () => mudarView("mural"));
    document.querySelectorAll("[data-abrir-ideia]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filtroIdeiaId = btn.getAttribute("data-abrir-ideia");
        mudarView("mural");
      });
    });
  }

  // ------------------------------------------------------------- Mural

  function renderCartao(ideia) {
    const autor = pessoaPorId(ideia.autorId);
    const estado = estadoDe(ideia);
    const jaInteressado = ideia.interessados.includes(usuarioAtualId);
    const podeExportar = ideia.interessados.length > 3; // V-12: "mais de três interessados"
    const anexo = ideia.anexoId ? ideiaPorId(ideia.anexoId) : null;

    return `
      <article class="cartao estado-${estado}" data-id="${ideia.id}">
        <span class="badge-estado estado-${estado}">${ROTULO_ESTADO[estado]}</span>
        <h3>${escaparHtml(ideia.titulo)}</h3>
        <p class="resumo">${escaparHtml(ideia.resumo)}</p>
        <div class="tags">${ideia.tags.map((t) => `<span class="tag">${escaparHtml(t)}</span>`).join("")}</div>
        ${anexo ? `<p class="vinculo">herda o estado de “${escaparHtml(anexo.titulo)}”</p>` : ""}
        <div class="rodape-cartao">
          <div class="linha-autor">
            <span>por <button class="link-autor" data-autor="${autor.id}">${escaparHtml(autor.nome)}</button></span>
            <span>${formatarData(ideia.data)}</span>
          </div>
          <div class="linha-acoes">
            <button class="botao-interesse ${jaInteressado ? "registrado" : ""}" data-interesse="${ideia.id}">
              ${jaInteressado ? "✓ interesse registrado (desfazer)" : "tenho interesse em participar"}
            </button>
            <span class="contagem-interesse">${ideia.interessados.length} interessado(s)</span>
            ${podeExportar ? `<button class="botao-exportar" data-exportar="${ideia.id}">exportar como nova proposta</button>` : ""}
          </div>
        </div>
      </article>
    `;
  }

  function renderMural() {
    const lista = ideiasParaExibir();
    const total = dados.ideias.filter(ideiaAtiva).length;
    document.getElementById("contagem").textContent = `${total} ideia(s) no mural`;

    const painelFiltro = document.getElementById("filtro-ativo");
    if (filtroIdeiaId) {
      const ideia = ideiaPorId(filtroIdeiaId);
      painelFiltro.classList.remove("escondido");
      painelFiltro.innerHTML = `mostrando apenas “${escaparHtml(ideia ? ideia.titulo : "")}” <button id="limpar-filtro-ideia">ver o mural inteiro</button>`;
      document.getElementById("limpar-filtro-ideia").addEventListener("click", () => {
        filtroIdeiaId = null;
        renderMural();
      });
    } else {
      painelFiltro.classList.add("escondido");
    }

    const container = document.getElementById("cartoes");
    if (lista.length === 0) {
      // corrige o defeito B-02 (mural em branco sem explicação)
      container.innerHTML = `
        <div class="vazio">
          <strong>Nenhuma ideia encontrada</strong>
          Tente outro termo de busca, outro curso, ou publique a sua própria ideia acima.
        </div>`;
    } else {
      container.innerHTML = lista.map(renderCartao).join("");
    }

    document.querySelectorAll("[data-autor]").forEach((btn) => {
      btn.addEventListener("click", () => abrirPessoa(btn.getAttribute("data-autor")));
    });
    document.querySelectorAll("[data-interesse]").forEach((btn) => {
      btn.addEventListener("click", () => alternarInteresse(btn.getAttribute("data-interesse")));
    });
    document.querySelectorAll("[data-exportar]").forEach((btn) => {
      btn.addEventListener("click", () => exportarComoNovaProposta(btn.getAttribute("data-exportar")));
    });

    atualizarOpcoesAnexo();
  }

  // ------------------------------------------------------------- V-07

  function alternarInteresse(ideiaId) {
    const ideia = ideiaPorId(ideiaId);
    if (!ideia) return;
    const indice = ideia.interessados.indexOf(usuarioAtualId);

    if (indice === -1) {
      ideia.interessados.push(usuarioAtualId);
      if (ideia.autorId !== usuarioAtualId) {
        // V-09: avisa o autor
        dados.mensagens.push({
          id: "m" + Date.now(),
          autorId: ideia.autorId,
          interessadoNome: usuarioAtual().nome,
          ideiaId: ideia.id,
          ideiaTitulo: ideia.titulo,
          data: hojeISO(),
          lida: false
        });
      }
      registrarAtividade("interesse", usuarioAtualId);
    } else {
      ideia.interessados.splice(indice, 1);
    }
    salvar();
    renderMural();
    atualizarSino();
  }

  // ------------------------------------------------------------- V-12

  function ideiasElegiveisParaAnexo(tagsDigitadas) {
    const tagsNorm = tagsDigitadas.map(normalizar).filter(Boolean);
    return dados.ideias.filter((i) => {
      if (i.interessados.length <= 3) return false; // "mais de três interessados"
      if (tagsNorm.length === 0) return false;
      return i.tags.some((t) => tagsNorm.includes(normalizar(t)));
    });
  }

  function atualizarOpcoesAnexo() {
    const campoTags = document.getElementById("campo-tags");
    const select = document.getElementById("campo-anexo");
    const dica = document.getElementById("dica-anexo");
    if (!campoTags || !select) return;

    const tags = campoTags.value.split(",").map((t) => t.trim()).filter(Boolean);
    const elegiveis = ideiasElegiveisParaAnexo(tags);
    const valorAtual = select.value;

    select.innerHTML = `<option value="">— nenhuma —</option>` +
      elegiveis.map((i) => `<option value="${i.id}">${escaparHtml(i.titulo)} (${ROTULO_ESTADO[estadoDe(i)]})</option>`).join("");

    if (elegiveis.some((i) => i.id === valorAtual)) select.value = valorAtual;

    if (select.value) {
      const origem = ideiaPorId(select.value);
      dica.classList.remove("escondido");
      dica.textContent = `esta ideia vai herdar o estado "${ROTULO_ESTADO[estadoDe(origem)]}" de "${origem.titulo}".`;
    } else {
      dica.classList.add("escondido");
    }
  }

  function exportarComoNovaProposta(ideiaId) {
    const origem = ideiaPorId(ideiaId);
    if (!origem) return;
    mudarView("mural");
    document.getElementById("campo-titulo").value = "";
    document.getElementById("campo-resumo").value = `Continuação de "${origem.titulo}": `;
    document.getElementById("campo-tags").value = origem.tags.join(", ");
    atualizarOpcoesAnexo();
    document.getElementById("campo-anexo").value = origem.id;
    atualizarOpcoesAnexo();
    document.getElementById("campo-titulo").scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("campo-titulo").focus();
  }

  // ------------------------------------------------------------- V-03 / V-08

  function chaveRascunho() {
    return CHAVE_RASCUNHO + usuarioAtualId;
  }

  function salvarRascunho() {
    const rascunho = {
      titulo: document.getElementById("campo-titulo").value,
      resumo: document.getElementById("campo-resumo").value,
      tags: document.getElementById("campo-tags").value
    };
    localStorage.setItem(chaveRascunho(), JSON.stringify(rascunho));
  }

  function carregarRascunho() {
    const salvo = localStorage.getItem(chaveRascunho());
    if (!salvo) return;
    try {
      const r = JSON.parse(salvo);
      document.getElementById("campo-titulo").value = r.titulo || "";
      document.getElementById("campo-resumo").value = r.resumo || "";
      document.getElementById("campo-tags").value = r.tags || "";
    } catch (e) { /* rascunho corrompido, ignora */ }
  }

  function limparRascunho() {
    localStorage.removeItem(chaveRascunho());
  }

  function publicarIdeia(ev) {
    ev.preventDefault();
    const titulo = document.getElementById("campo-titulo").value.trim();
    const resumo = document.getElementById("campo-resumo").value.trim();
    const tags = document.getElementById("campo-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
    const anexoId = document.getElementById("campo-anexo").value || null;
    const erro = document.getElementById("erro-titulo");

    if (!titulo) {
      erro.classList.remove("escondido");
      document.getElementById("campo-titulo").classList.add("erro-campo");
      document.getElementById("campo-titulo").focus();
      return;
    }
    erro.classList.add("escondido");
    document.getElementById("campo-titulo").classList.remove("erro-campo");

    const nova = {
      id: "i" + Date.now(),
      titulo,
      resumo,
      tags,
      autorId: usuarioAtualId,
      data: hojeISO(),
      interessados: [],
      anexoId,
      estadoForcado: anexoId ? estadoDe(ideiaPorId(anexoId)) : null
    };

    dados.ideias.unshift(nova);
    registrarAtividade("publicacao", usuarioAtualId);
    salvar();
    limparRascunho();
    document.getElementById("form-publicar").reset();
    document.getElementById("dica-anexo").classList.add("escondido");
    filtroIdeiaId = null;
    renderMural();
  }

  // ------------------------------------------------------------- V-04

  function alternarRecomendadas() {
    mostrarSoRecomendadas = !mostrarSoRecomendadas;
    document.getElementById("chip-recomendadas").classList.toggle("ativo", mostrarSoRecomendadas);
    renderMural();
  }

  // ------------------------------------------------------------- V-05

  function renderGrupos() {
    const container = document.getElementById("lista-grupos");
    container.innerHTML = dados.grupos
      .map((g) => {
        const dentro = g.membros.includes(usuarioAtualId);
        const nomes = g.membros.map((id) => pessoaPorId(id)?.nome).filter(Boolean).join(", ") || "ninguém ainda";
        return `
          <li class="item-grupo">
            <div class="cabecalho-grupo">
              <div>
                <h3>${escaparHtml(g.nome)} ${dentro ? '<span class="selo-dentro">você está dentro</span>' : ""}</h3>
                <p class="membros-nomes">${g.membros.length} membro(s): ${escaparHtml(nomes)}</p>
              </div>
              <button class="botao-secundario" data-grupo="${g.id}">${dentro ? "sair do grupo" : "entrar no grupo"}</button>
            </div>
          </li>`;
      })
      .join("");

    document.querySelectorAll("[data-grupo]").forEach((btn) => {
      btn.addEventListener("click", () => alternarGrupo(btn.getAttribute("data-grupo")));
    });
  }

  function alternarGrupo(grupoId) {
    const grupo = dados.grupos.find((g) => g.id === grupoId);
    if (!grupo) return;
    const indice = grupo.membros.indexOf(usuarioAtualId);
    if (indice === -1) {
      grupo.membros.push(usuarioAtualId);
      registrarAtividade("grupo", usuarioAtualId);
    } else {
      grupo.membros.splice(indice, 1);
    }
    salvar();
    renderGrupos();
  }

  // ------------------------------------------------------------- V-09

  function mensagensDoUsuario() {
    return dados.mensagens
      .filter((m) => m.autorId === usuarioAtualId)
      .slice()
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }

  function atualizarSino() {
    const naoLidas = mensagensDoUsuario().filter((m) => !m.lida).length;
    const bolha = document.getElementById("bolha-mensagens");
    if (naoLidas > 0) {
      bolha.textContent = naoLidas;
      bolha.classList.remove("escondido");
    } else {
      bolha.classList.add("escondido");
    }
  }

  function renderPainelMensagens() {
    const lista = mensagensDoUsuario();
    const ul = document.getElementById("lista-mensagens");
    ul.innerHTML = lista.length
      ? lista
          .map(
            (m) => `
        <li><button data-msg="${m.id}" data-ideia="${m.ideiaId}">
          <strong>${escaparHtml(m.interessadoNome)}</strong> demonstrou interesse em “${escaparHtml(m.ideiaTitulo)}”
          <span class="msg-data">${formatarData(m.data)}</span>
        </button></li>`
          )
          .join("")
      : `<li class="vazio">nenhum aviso por aqui ainda.</li>`;

    ul.querySelectorAll("[data-msg]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const msg = dados.mensagens.find((m) => m.id === btn.getAttribute("data-msg"));
        if (msg) msg.lida = true;
        salvar();
        filtroIdeiaId = btn.getAttribute("data-ideia");
        painelMensagensAberto = false;
        document.getElementById("painel-mensagens").classList.add("escondido");
        atualizarSino();
        mudarView("mural");
      });
    });
  }

  // ------------------------------------------------------------- V-11

  function renderRelatorio() {
    const cursos = [...new Set(dados.pessoas.map((p) => p.curso))];

    // curso mais ativo
    const contagemAtividade = {};
    cursos.forEach((c) => (contagemAtividade[c] = 0));
    dados.atividades.forEach((a) => {
      contagemAtividade[a.curso] = (contagemAtividade[a.curso] || 0) + 1;
    });
    const ranking = cursos.slice().sort((a, b) => contagemAtividade[b] - contagemAtividade[a]);

    document.getElementById("relatorio-atividade").innerHTML = ranking.length
      ? `<table class="relatorio"><thead><tr><th>curso</th><th>eventos de atividade</th></tr></thead><tbody>
          ${ranking
            .map(
              (c, idx) =>
                `<tr><td class="${idx === 0 ? "curso-destaque" : ""}">${escaparHtml(c)}${idx === 0 ? " ★" : ""}</td><td>${contagemAtividade[c]}</td></tr>`
            )
            .join("")}
        </tbody></table>`
      : `<p>ainda não há atividade registrada.</p>`;

    // tags mais buscadas por curso, últimos 7 dias
    const recentes = dados.buscas.filter((b) => diasEntre(b.data) <= 7);
    const porCurso = {};
    cursos.forEach((c) => (porCurso[c] = {}));
    recentes.forEach((b) => {
      const pessoa = pessoaPorId(b.pessoaId);
      if (!pessoa || pessoa.tipo !== "aluno" || !b.termo) return;
      const alvo = porCurso[pessoa.curso] || (porCurso[pessoa.curso] = {});
      alvo[b.termo] = (alvo[b.termo] || 0) + 1;
    });

    document.getElementById("relatorio-tags").innerHTML = cursos
      .map((c) => {
        const contagens = porCurso[c] || {};
        const top5 = Object.entries(contagens)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        return `
          <h3>${escaparHtml(c)}</h3>
          ${
            top5.length
              ? `<table class="relatorio"><tbody>${top5
                  .map(([termo, n]) => `<tr><td>${escaparHtml(termo)}</td><td>${n}×</td></tr>`)
                  .join("")}</tbody></table>`
              : `<p>sem buscas registradas nos últimos 7 dias.</p>`
          }`;
      })
      .join("");
  }

  let tempoDebounceBusca = null;
  function registrarBusca(termo) {
    const limpo = normalizar(termo);
    if (!limpo) return;
    limpo.split(/\s+/).forEach((palavra) => {
      dados.buscas.push({ termo: palavra, pessoaId: usuarioAtualId, data: hojeISO() });
    });
    registrarAtividade("busca", usuarioAtualId);
  }

  // ------------------------------------------------------------- navegação

  function mudarView(view) {
    ["mural", "pessoa", "grupos", "relatorio"].forEach((v) => {
      document.getElementById(v).classList.toggle("escondido", v !== view);
    });
    document.querySelectorAll(".aba").forEach((btn) => {
      btn.classList.toggle("ativa", btn.getAttribute("data-view") === view);
    });
    if (view === "mural") renderMural();
    if (view === "grupos") renderGrupos();
    if (view === "relatorio") renderRelatorio();
  }

  // ------------------------------------------------------------- setup

  function preencherSelecaoUsuario() {
    const select = document.getElementById("quem");
    select.innerHTML = dados.pessoas
      .map((p) => `<option value="${p.id}">${escaparHtml(p.nome)} — ${escaparHtml(p.curso)}</option>`)
      .join("");
    select.value = usuarioAtualId;
    select.addEventListener("change", () => {
      usuarioAtualId = select.value;
      localStorage.setItem(CHAVE_USUARIO, usuarioAtualId);
      filtroIdeiaId = null;
      mostrarSoRecomendadas = false;
      document.getElementById("chip-recomendadas").classList.remove("ativo");
      carregarRascunho();
      atualizarSino();
      mudarView("mural");
    });
  }

  function ligarEventos() {
    document.querySelectorAll(".aba").forEach((btn) => {
      btn.addEventListener("click", () => mudarView(btn.getAttribute("data-view")));
    });

    document.getElementById("form-publicar").addEventListener("submit", publicarIdeia);
    ["campo-titulo", "campo-resumo"].forEach((id) => {
      document.getElementById(id).addEventListener("input", salvarRascunho);
    });
    document.getElementById("campo-tags").addEventListener("input", () => {
      salvarRascunho();
      atualizarOpcoesAnexo();
    });
    document.getElementById("campo-anexo").addEventListener("change", atualizarOpcoesAnexo);

    document.getElementById("busca").addEventListener("input", () => {
      renderMural();
      clearTimeout(tempoDebounceBusca);
      tempoDebounceBusca = setTimeout(() => {
        registrarBusca(document.getElementById("busca").value);
        salvar();
      }, 500);
    });
    document.getElementById("filtro-curso").addEventListener("input", renderMural);
    document.getElementById("chip-recomendadas").addEventListener("click", alternarRecomendadas);

    document.getElementById("sino").addEventListener("click", () => {
      painelMensagensAberto = !painelMensagensAberto;
      document.getElementById("painel-mensagens").classList.toggle("escondido", !painelMensagensAberto);
      document.getElementById("sino").setAttribute("aria-expanded", String(painelMensagensAberto));
      if (painelMensagensAberto) renderPainelMensagens();
    });
    document.addEventListener("click", (ev) => {
      const dentroDoSino = ev.target.closest("#sino, #painel-mensagens");
      if (!dentroDoSino && painelMensagensAberto) {
        painelMensagensAberto = false;
        document.getElementById("painel-mensagens").classList.add("escondido");
      }
    });
  }

  function iniciar() {
    dados = carregarDados();
    usuarioAtualId = localStorage.getItem(CHAVE_USUARIO) || dados.pessoas[0].id;
    if (!pessoaPorId(usuarioAtualId)) usuarioAtualId = dados.pessoas[0].id;

    document.getElementById("base").textContent = `entrando como ${usuarioAtual().nome}`;

    preencherSelecaoUsuario();
    ligarEventos();
    carregarRascunho();
    atualizarSino();
    mudarView("mural");
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
