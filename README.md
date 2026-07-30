# Viveiro

Berçário de ideias de projeto do campus. Uma pessoa publica uma ideia; outras
encontram, apoiam e se agrupam. Nada aqui é oficial — é o que vem antes.

Versão 0.1 (MVP), primeiro semestre de 2026.

## Como abrir

Dá um duplo clique em `index.html`. Não precisa instalar nada, não precisa de
servidor. Funciona direto no navegador.

Se você chegou aqui pelo GitHub e não tem os arquivos na sua máquina, veja o
`COMECE-AQUI.md`.

## Onde está cada coisa

    index.html        a página: cabeçalho, abas, mural e grupos
    dados/            os dados (pessoas, ideias, grupos). O index.html carrega
                      um destes arquivos: é só uma variável DADOS.
    src/estilo.css    as cores, os cartões, o formato da tela
    src/app.js        a lógica: filtra, monta os cartões, responde aos cliques
    docs/             backlog, definição de pronto e glossário

## Como o app.js funciona

São três coisas, nesta ordem:

1. o objeto `estado` guarda o que está selecionado agora (pessoa, busca, tag, aba);
2. `ideiasVisiveis()` devolve só as ideias que passam pelos filtros do estado;
3. `desenhar()` apaga a tela e monta tudo de novo a partir daí.

Se você mudar alguma coisa nos dados, chame `desenhar()` de novo e a tela
se atualiza. É sempre esse o caminho.

## O que ainda não existe

Nada é salvo: ao fechar o navegador, o que você fez se perde. Não dá para
publicar ideia pela tela (só editando `dados.js` na mão), não dá para entrar
em grupo, e não existe página de pessoa. A lista de defeitos conhecidos está
em `docs/BACKLOG.md`.

## Login

Não tem. Enquanto não existe cadastro, usa-se o seletor "navegando como",
no alto à direita, para fingir que você é outra pessoa.
