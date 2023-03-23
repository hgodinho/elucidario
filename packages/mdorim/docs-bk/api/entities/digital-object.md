# Objeto digital

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Objeto digital](#objeto-digital)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`DigitalObjectRef`](#digitalobjectref)
    - [`DigitalObject`](#digitalobject)

---

## Descrição

descrever

## Metadados

### `DigitalObjectRef`

[^topo](#objeto-digital)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como objeto digital embutido em outras entidades.

---

### `DigitalObject`

[^topo](#objeto-digital)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
