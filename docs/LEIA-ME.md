# Artefatos da equipe — como este diretório se organiza

Este diretório (`docs/`) reúne os documentos que a equipe mantém durante a
sprint. Cada arquivo tem um responsável pela atualização e um momento próprio.

| Arquivo | O que registra | Quem atualiza | Quando |
|---|---|---|---|
| `BACKLOG.md` | as histórias e sua triagem | toda a equipe | 30/07, e sempre que uma história mudar |
| `PRONTO.md` | a Definição de Pronto e os critérios de aceitação | toda a equipe | 30/07, revisado quando necessário |
| `GLOSSARIO.md` | o sentido fixado dos termos do domínio | quem identificar ambiguidade | contínuo |
| `PLANO.md` | a meta, o compromisso, as estimativas e o quadro | o escriba do encontro | a cada encontro |
| `DIARIO.md` | o que aconteceu em cada encontro e sessão extra | o escriba do encontro | a cada encontro e sessão |

## O princípio que atravessa todos: rastreabilidade

Deve ser possível seguir qualquer história pelo caminho completo:

    BACKLOG.md  →  PLANO.md (quadro)  →  PRONTO.md (critérios)  →  código

Se uma história consta como concluída no quadro, seus critérios de aceitação
devem estar escritos, e o código deve satisfazê-los. A avaliação percorre esse
caminho por amostragem: escolhe-se uma história e segue-se o fio.

## Registro da triagem (acrescentar ao BACKLOG.md em 30/07)

A primeira tarefa da equipe é a triagem da especificação herdada. Seu registro
é uma seção nova, ao final do `BACKLOG.md`, neste formato:

    ## Registro da triagem — 30/07

    | História | Situação em que foi recebida | O que foi alterado | Justificativa |
    |---|---|---|---|
    | V-02 | ... | ... | ... |

Histórias mantidas sem alteração também entram na tabela, com a justificativa
da manutenção. A tabela é a evidência de que a especificação foi lida com
critério — ela integra a Entrega 1.

## O papel de escriba

O escriba é definido no início de cada encontro e informado no `DIARIO.md`.
A função circula: ao longo da sprint, todos os integrantes devem tê-la
exercido ao menos uma vez.
