# Evento

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Evento](#evento)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`EventRef`](#eventref)
    - [`Event`](#event)

---

## Descrição

descrever

## Metadados

### `EventRef`

[^topo](#evento)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como objeto visual embutido em outras entidades.

---

### `Event`

[^topo](#evento)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
