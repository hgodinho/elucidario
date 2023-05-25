---
title: Concept
description: Concept
---

# Concept

:::warning Em desenvolvimento

-   [ ] Revisão geral

:::

## Descrição

Utilizado para descrever conceitos como tipos, materiais, linguagens, medidas, entre outros tipos de conceitos.

Os Conceitos podem ser definidos como termos únicos ou como agrupamentos ou coleções de termos que compartilham algo em comum, em estruturas de tesauros esses agrupamentos são os termos definidos entre sinais de maior e menor, por exemplo: `<nomes e conceitos relacionados>` no Getty AAT.

Por padrão o MDORIM vem com alguns conceitos pré-definidos baseados inteiramente em ontologias como [FOAF](http://xmlns.com/foaf/0.1/) e [vocabulários do Getty](https://www.getty.edu/research/tools/vocabularies/). Os conceitos pré-definidos seguem o mesmo modelo do Concept e são criados automaticamente na instalação do Elucidário.art. Esses conceitos são utilizados para facilitar a integração do modelo com a interface de usuário, servindo também como exemplo de como definir novos conceitos no app.

## Classes

## Definitions

### `concept_ref`

> type $ref([`ref`](#ref))

**Description**: Referência a um conceito

[Back to top](#)

---

### `Concept`

> type `object` with properties

**Description**: Conceito

| Name | Type                | Description | Required |
| ---- | ------------------- | ----------- | -------- |
| \_id | $ref([`_id`](#_id)) |             | Yes      |
| uri  | $ref([`uri`](#uri)) |             | Yes      |
