# Metadados

[Início](../README.md) | [Glossário](./glossario.md) | [< Taxonomias](./api/taxonomies.md)

---

## Menu <!-- omit in toc -->

- [Metadados](#metadados)
  - [MDORIM](#mdorim)
    - [`_id`](#_id)
    - [`agent_type`](#agent_type)
    - [`ClassifiedAs`](#classifiedas)
    - [`Descriptions`](#descriptions)
    - [`IdentifiedBy`](#identifiedby)
    - [`Identifier`](#identifier)
    - [`Name`](#name)
  - [`uri`](#uri)
  - [Linked-Art](#linked-art)
    - [`@context`](#context)
    - [`id`](#id)
    - [`type`](#type)
    - [`_label`](#_label)

---

## MDORIM

### `_id`

[^topo](#metadados)

> tipo `number` usado em [`Entidades`](./api/entities.md).

**Descrição:** ID no formato `number` respeitando o formato de gravação do WP.

| name | label | type   | public | requirement | extra        |
| ---- | ----- | ------ | ------ | ----------- | ------------ |
| _id  | ID    | number | true   | auto        | ID do objeto |

---

### `agent_type`

[^topo](#metadados)

> tipo `string` usado em [`Agente`](./api/entities/agent.md)

**Descrição:** description

| name | label | type | public | requirement | extra                                | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ------------------------------------ | --------------- | -------- |
| name | label | type | true   | true        | [enum(AgentType)](enum.md#agenttype) | linked-art      | crm      |

---

### `ClassifiedAs`

[^topo](#metadados)

> tipo [`ConceptRef[]`](../docs/api/entities/concept.md#conceptref) usado em `All`

**Descrição:** Array de objetos referência a um conceito

---

### `Descriptions`

[^topo](#metadados)

> tipo `object` usado em `Entities`

**Descrição:** description

| name | label | type | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ----- | --------------- | -------- |
| name | label | type | true   | true        | extra | linked-art      | crm      |

---

### `IdentifiedBy`

> tipo `anyOf<Name|Identifier>` usado em [`Entidades`](./api/entities.md)

**Descrição:** description

| name         | label          | type                                            | public | requirement | extra | map: linked-art | map: crm |
| ------------ | -------------- | ----------------------------------------------- | ------ | ----------- | ----- | --------------- | -------- |
| IdentifiedBy | Identificações | anyOf<[Name](#name)\|[Identifier](#identifier)> | true   | true        |       | identified_by   |          |

---

### `Identifier`

[^topo](#metadados)

> tipo `object` usado em `IdentifiedBy`

**Descrição:** description

| name | label | type | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ----- | --------------- | -------- |
| name | label | type | true   | true        | extra | Identifier      | crm      |

---

### `Name`

> tipo `object` usado em [`IdentifiedBy`](#identifiedby) mesmo que [ld:Name](https://linked.art/api/1.0/shared/name/)

**Descrição:** description

| name          | label            | type            | public | requirement | extra      | map: linked-art  | map: crm |
| ------------- | ---------------- | --------------- | ------ | ----------- | ---------- | ---------------- | -------- |
| type          | Tipo             | string          | true   | REQUER      | const:Name | ld:type          |          |
| classified_as | Classificações   | ClassifiedAs    | true   | OPCIONAL    |            | ld:classified_as |          |
| content       | Conteúdo         | string          | true   | REQUER      |            | ld:content       |          |
| language      | Idioma           | string          | true   | OPCIONAL    |            | ld:language      |          |

---

## `uri`

[^topo](#metadados)

> tipo `string` usado em `many class`

**Descrição:** description

| name | label | type   | public | requirement | extra        | map: linked-art | map: crm |
| ---- | ----- | ------ | ------ | ----------- | ------------ | --------------- | -------- |
| uri  | URI   | string | true   | REQUER      | pattern: url | ld:id           |          |

---

## Linked-Art

### `@context`

[^topo](#metadados)

> tipo `string|array` usado em [`Entities`](./api/entities.md)

| name     | label    | type            | public | requirement | extra                                                                         | map: linked-art | map: crm |
| -------- | -------- | --------------- | ------ | ----------- | ----------------------------------------------------------------------------- | --------------- | -------- |
| @context | Contexto | (string\|array) | true   | true        | Contexto dos vocabulários utilizados, string ou array de URIs de vocabulários | @context        |          |

---

### `id`

[^topo](#metadados)

> tipo `string` usado em `Entities`

| name | label | type   | public | requirement | extra                    | map: linked-art | map: crm |
| ---- | ----- | ------ | ------ | ----------- | ------------------------ | --------------- | -------- |
| id   | ID    | string | true   | true        | ID DEVE ser HTTTP(s) URI | id              |          |

---

### `type`

[^topo](#metadados)

> tipo `string` usado em `Entities`

| name | label | type   | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ------ | ------ | ----------- | ----- | --------------- | -------- |
| type | Tipo  | string | true   | true        |       | type            |          |

---

### `_label`

[^topo](#metadados)

> tipo `string` usado em `Entities`

| name   | label | type   | public | requirement | extra | map: linked-art | map: crm |
| ------ | ----- | ------ | ------ | ----------- | ----- | --------------- | -------- |
| _label | label | string | true   | true        |       | _label          |          |

---
