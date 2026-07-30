# Comece aqui

Instruções operacionais do trabalho. Este documento é do curso: não faz parte
do produto herdado, e não deve ser confundido com o `README.md`, que foi escrito
pela equipe anterior.

Todo o trabalho é feito pela interface web do GitHub. A rede da escola não
libera terminal, e nada aqui precisa dele.

---

## 1. Criar o repositório da equipe

Neste repositório, acione **Use this template → Create a new repository**.

- **Nome:** `viveiro-` seguido do nome da equipe.
- **Visibilidade: público.** Por duas razões: o GitHub Pages, que vocês vão usar
  para executar a aplicação, exige repositório público em contas gratuitas; e a
  Norma 1 — nenhum dado de pessoa real — vale integralmente para o que está
  publicado na internet.
- **Acesso de todos:** em `Settings → Collaborators`, acrescentem cada
  integrante da equipe. Quem não constar ali não consegue salvar alterações.

## 2. Publicar a aplicação

Em `Settings → Pages`, escolham **Source: Deploy from a branch**, com
**Branch: `main`** e pasta **`/ (root)`**, e confirmem em `Save`.

Em alguns minutos a aplicação estará no ar, no endereço indicado na própria
página de configuração — algo como
`https://<usuário>.github.io/viveiro-<equipe>/`.

Esse endereço é o que vocês vão abrir no laboratório e apresentar na revisão de
20/08. Cada alteração salva no repositório atualiza a página publicada, com um
ou dois minutos de atraso.

## 3. Escolher a base de dados da equipe

A pasta `dados/` traz doze bases fictícias. A base da sua equipe foi indicada
em aula.

Abram o `index.html`, acionem o lápis de edição e alterem a letra na penúltima
linha:

    <script src="dados/dados_A.js"></script>

Confirmem em **Commit changes**. Para conferir: o rodapé da aplicação passa a
exibir o código da base escolhida.

## 4. Registrar a equipe

Abram **uma** issue no repositório do curso, em
`https://github.com/<usuário-do-professor>/viveiro-template/issues`, contendo:

- no título, o nome da equipe;
- no corpo, o endereço do repositório de vocês, o endereço da aplicação
  publicada, os nomes dos integrantes e a indicação de quem é o porta-voz.

Uma issue por equipe. Se algo mudar depois — o porta-voz, um integrante, o
endereço —, comentem na mesma issue, em vez de abrir outra.

## 5. Como trabalhar nos arquivos

- **Editar:** abrir o arquivo, acionar o lápis, escrever, confirmar em
  *Commit changes*.
- **Criar:** `Add file → Create new file`.
- **Enviar um arquivo pronto:** `Add file → Upload files`.

O botão *Commit changes* é o que efetivamente salva. Enquanto ele não for
acionado, o que foi escrito existe apenas na tela de quem está escrevendo.

Duas pessoas editando o mesmo arquivo ao mesmo tempo é receita de trabalho
perdido: combinem quem mexe em quê antes de começar. Essa combinação é assunto
da equipe, e o registro dela cabe no diário.

## 6. O que vocês mantêm

Os documentos da pasta `docs/`. O arquivo `docs/LEIA-ME.md` explica o que cada
um registra, quem o atualiza e quando.

Três deles vieram da equipe anterior e estão incompletos ou incorretos —
`BACKLOG.md`, `PRONTO.md` e `GLOSSARIO.md`. Avaliá-los e corrigi-los é a
primeira tarefa da sprint, não um favor ao cliente.

Dois são de vocês, e começam vazios: `PLANO.md` e `DIARIO.md`.

## 7. Antes de salvar qualquer coisa

Este repositório é público, e a Norma 1 não admite exceção: nenhum dado de
pessoa real entra em nenhum arquivo — nem para teste, nem por um instante. Os
nomes que aparecem nas bases são inventados.
