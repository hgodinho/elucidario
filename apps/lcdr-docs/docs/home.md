---
id: doc
slug: /
---

# Elucidário.art

teste

:::note Observação no desenvolvimento

Precisa separar em dois tipos:

1. Para registro na DB
    > O registro na DB é feito através de referências pela ID de outras entidades ou taxonomias.
2. Para retorno na API
    > O retorno da API traz consigo todas as referências resolvidas em objetos completos (entidades ou taxonomias).

:::

## Descrição

Modelo de Dados para Organização e Representação da Informação Museológica

Baseado em [Linked-Art](https://linked.art/) e [SPECTRUM](https://collectionstrust.org.uk/spectrum/)

### Como ler este documento?

Este documento é dividido em 5 partes principais:

1. Tabelas - Definição das tabelas criadas no wordpress para funcionamento adequado do Elucidário e do MDORIM;
2. Entidades - Classes principais de conteúdo, representam as entidades utilizadas no modelo;
3. Metadata - Classes secundárias, definem os metadados utilizados pelas classes em sua representação;
4. Conceitos pré-definidos - utilizados pelo modelo;
5. Glossário - definição de termos utilizados no modelo;

Cada parte contém definições de classes e propriedades, além de exemplos de uso. Em cada definição de classe deste documento é possível encontrar um resumo objetivo da classe, uma descrição mais detalhada, além de exemplos de uso.

O resumo objetivo de cada classe é apresentado da seguinte forma:

:::info

tipo [`ConceptRef[]`](/entities/concept#conceptref) usado em [`Concept`](/entities/concept#concept).

:::

O documento também conta com informações sobre o status de desenvolvimento de cada classe que auxilia no andamento do desenvolvimento e devem ser removidas ao final, por exemplo:

:::caution Status

- [ ] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

Em @to-do listamos o andamento do denvolvimento como um todo.

### Como contribuir?

Para contribuir com o desenvolvimento do MDORIM, basta abrir uma [issue](https://github.com/hgodinho/elucidario/issues) e selecionar uma das opções disponíveis:

![issues](../static/img/issues.png)
