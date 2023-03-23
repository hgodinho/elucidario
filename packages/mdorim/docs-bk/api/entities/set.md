# Coleção

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Coleção](#coleção)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`SetRef`](#setref)
    - [`Set`](#set)

---

## Descrição

descrever

## Metadados

### `SetRef`

[^topo](#coleção)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como coleção embutida em outras entidades.

---

### `Set`

[^topo](#coleção)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
