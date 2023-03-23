# Objeto textual

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Objeto textual](#objeto-textual)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`TextualObjectRef`](#textualobjectref)
    - [`TextualObject`](#textualobject)

---

## Descrição

descrever

## Metadados

### `TextualObjectRef`

[^topo](#objeto-textual)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como objeto textual embutido em outras entidades.

---

### `TextualObject`

[^topo](#objeto-textual)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
