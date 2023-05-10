---
title: Metadata
description: Metadata
---

# Metadata

:::warning Em desenvolvimento

-   [ ] Criar endpoint para criação de usuários
-   [ ] Sei la mil coisas

:::

## Descrição

Metadados do modelo

## Classes

## Definitions

### `_id`

> type `integer`

**Description**: Identificador único de uma entidade. É um `integer` gerado automaticamente.

#### Mapping

| Vocabulary | Link                                                     |
| ---------- | -------------------------------------------------------- |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://linked.art/ns/terms/identifier>                  |
| schema.org | <http://schema.org/identifier>                           |

[Back to top](#)

---

### `_type`

> type `string`

**Description**: Tipo de classe.

#### Mapping

| Vocabulary | Link                                             |
| ---------- | ------------------------------------------------ |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P2_has_type> |
| linked.art | <https://linked.art/ns/v1/linked-art.json#type>  |
| schema.org | <http://schema.org/type>                         |

[Back to top](#)

---

### `uri`

> type `string`

**Description**: Uniform Resource Identifier (URI) de um recurso.

#### Mapping

| Vocabulary | Link                                                     |
| ---------- | -------------------------------------------------------- |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://linked.art/ns/terms/identifier>                  |
| schema.org | <http://schema.org/identifier>                           |

[Back to top](#)

---

### `ref`

> type $ref([`uri`](#uri))

**Description**: Referência genérica a uma entidade.

[Back to top](#)

---

### `identified_by`

> type array<anyOf<[`Identifier`](#identifier) | [`Name`](#name)>>

**Description**: Define o nome ou identificador de uma entidade. Pode ser `Name` ou `Identifier`.

#### Mapping

| Vocabulary | Link                                                     |
| ---------- | -------------------------------------------------------- |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://www.w3.org/2000/01/rdf-schema#label>             |
| schema.org | <http://schema.org/name>                                 |

[Back to top](#)

---

### `Identifier`

> type `object` with properties

**Description**: Identificador de uma entidade.

| Name  | Type   | Description                                           | Required |
| ----- | ------ | ----------------------------------------------------- | -------- |
| type  | string | Tipo do identificador. Valor constante: `Identifier`. | Yes      |
| value | string | Valor do identificador.                               | Yes      |

#### Mapping

| Vocabulary | Link                                                     |
| ---------- | -------------------------------------------------------- |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://linked.art/ns/terms/identifier>                  |
| schema.org | <http://schema.org/identifier>                           |

### `Name`

> type `object` with properties

**Description**: Nome de uma entidade.

| Name  | Type   | Description                            | Required |
| ----- | ------ | -------------------------------------- | -------- |
| type  | string | Tipo do nome. Valor constante: `Name`. | Yes      |
| value | string | Valor do nome.                         | Yes      |

#### Mapping

| Vocabulary | Link                                                     |
| ---------- | -------------------------------------------------------- |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://www.w3.org/2000/01/rdf-schema#label>             |
| schema.org | <http://schema.org/name>                                 |

### `slug`

> type `string`

**Description**: Nome do conceito. É um `string` gerado automaticamente.

#### Mapping

| Vocabulary | Link                                                     |
| ---------- | -------------------------------------------------------- |
| crm        | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art | <http://www.w3.org/2000/01/rdf-schema#label>             |
| schema.org | <http://schema.org/name>                                 |

[Back to top](#)

---
