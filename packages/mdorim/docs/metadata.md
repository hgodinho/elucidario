---
title: "Metadata"
description: Definições de metadados utilizados no MDORIM.
---

# Metadados

Definições de metadados utilizados no MDORIM.

## Definições

### `ID`

> tipo `integer`

Identificador único do conceito. É um `integer` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link |
| ----------- | ---- |
| schema.org | <http://schema.org/identifier> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

> [Voltar para metadados](#metadados)

---

### `URI`

> tipo `string`

Identificador único do conceito. É um `string` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link |
| ----------- | ---- |
| schema.org | <http://schema.org/identifier> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

> [Voltar para metadados](#metadados)

---

### `type`

> tipo `string`

Tipo do conceito. É um `string` gerado automaticamente baseado no tipo da classe

#### Mapeamento

| Vocabulário | Link |
| ----------- | ---- |
| schema.org | <http://schema.org/type> |
| linked.art | <_type> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P2_has_type> |

> [Voltar para metadados](#metadados)

---

### `slug`

> tipo `string`

Nome do conceito. É um `string` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link |
| ----------- | ---- |
| schema.org | <http://schema.org/name> |
| linked.art | <http://www.w3.org/2000/01/rdf-schema#label> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

> [Voltar para metadados](#metadados)

---

### `identified_by`

> tipo `array` anyOf<[Name](#name) | [Identifier](#identifier)>

Define o nome ou identificador de uma entidade. Pode ser `Name` ou `Identifier`.

> [Voltar para metadados](#metadados)

---

### `Identifier`

> tipo `object` com propriedades

Identificador de uma entidade.

#### Propriedades

| Nome | Tipo | Descrição | Obrigatório? |
| ---- | ---- | --------- | ------------ |
| type | string | Tipo do identificador. Valor constante: `Identifier`. | Sim |
| value | string | Valor do identificador. | Sim |
| [ConceptRef](./concept.md#conceptref) |  |  | Não |

#### Mapeamento

| Vocabulário | Link |
| ----------- | ---- |
| schema.org | <http://schema.org/identifier> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

> [Voltar para metadados](#metadados)

---