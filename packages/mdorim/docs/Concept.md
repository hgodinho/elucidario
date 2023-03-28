---
title: "Concept"
description: Concept
---

# Concept

:::warning Em desenvolvimento

Em desenvolvimento

:::

## Descrição

Utilizado para descrever conceitos como tipos, materiais, linguagens, medidas, entre outros tipos de conceitos. Funciona como um vocabulário controlado. É amplamente baseado no endpoint Concept do Linked Art.

Os Conceitos podem ser definidos como termos únicos ou como agrupamentos ou coleções de termos que compartilham algo em comum, em estruturas de tesauros esses agrupamentos são os termos definidos entre sinais de maior e menor, por exemplo: __nomes e conceitos relacionados__ no Getty AAT.

Por padrão o MDORIM vem com alguns conceitos pré-definidos baseados inteiramente em ontologias como FOAF e vocabulários do Getty. Os conceitos pré-definidos seguem o mesmo modelo do Concept e são criados automaticamente na instalação do Elucidário.art. Esses conceitos são utilizados para facilitar a integração do modelo com a interface de usuário, servindo também como exemplo de como definir novos conceitos no app.

---

## Classes

### `ConceptRef`

Referência a um conceito

[ConceptRef](./metadata.md#conceptref)

---

### `Concept`

> tipo `object` com propriedades

Conceito

#### Propriedades

| Nome | Tipo | Descrição | Obrigatório? |
| ---- | ---- | --------- | ------------ |
| [ID](./metadata.md#id) |  |  | Sim |
| [URI](./metadata.md#uri) |  |  | Sim |

---