# Objeto visual

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Objeto visual](#objeto-visual)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`VisualObjectRef`](#visualobjectref)
    - [`VisualObject`](#visualobject)

---

## Descrição

descrever

## Metadados

### `VisualObjectRef`

[^topo](#objeto-visual)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como objeto visual embutido em outras entidades.

---

### `VisualObject`

[^topo](#objeto-visual)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
