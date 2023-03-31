---
title: 'Metadata'
description: Definições de metadados utilizados no MDORIM.
---

# Metadados

Definições de metadados utilizados no MDORIM.

## Definições

### `_id`

> tipo `integer`

Identificador único do conceito. É um `integer` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link |
| --- | --- |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| schema.org | <http://schema.org/identifier> |

[Voltar para o topo](#)

---

### `_type`

> tipo `string`

Tipo do conceito. É um `string` gerado automaticamente baseado no tipo da classe

#### Mapeamento

| Vocabulário | Link |
| --- | --- |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P2_has_type> |
| linked.art | <_type> |
| schema.org | <http://schema.org/type> |

[Voltar para o topo](#)

---

### `_uri`

> tipo `string`

Identificador único do conceito. É um `string` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link |
| --- | --- |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| schema.org | <http://schema.org/identifier> |

[Voltar para o topo](#)

---

### `identified_by`

> tipo `array` anyOf<[`Name`](#name) | [`Identifier`](#identifier)>

Define o nome ou identificador de uma entidade. Pode ser `Name` ou `Identifier`.

[Voltar para o topo](#)

---

### `Identifier`

> tipo `object` com propriedades

Identificador de uma entidade.

#### Propriedades

| Nome | Tipo | Descrição | Obrigatório? |
| ---- | ---- | --------- | ------------ |
| [ConceptRef](./concept.md#conceptref) |  |  | Não |
| type | string | Tipo do identificador. Valor constante: `Identifier`. | Sim |
| value | string | Valor do identificador. | Sim |

#### Mapeamento

| Vocabulário | Link |
| --- | --- |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| schema.org | <http://schema.org/identifier> |

[Voltar para o topo](#)

---

### `slug`

> tipo `string`

Nome do conceito. É um `string` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link |
| --- | --- |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://www.w3.org/2000/01/rdf-schema#label> |
| schema.org | <http://schema.org/name> |

[Voltar para o topo](#)

---