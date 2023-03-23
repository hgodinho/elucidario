# Lugares

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Lugares](#lugares)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`PlacesRef`](#placesref)
    - [`Places`](#places)

---

## Descrição

descrever

## Metadados

### `PlacesRef`

[^topo](#lugares)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como lugar embutido em outras entidades.

---

### `Places`

[^topo](#lugares)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
