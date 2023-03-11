# Usuário

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Usuário](#usuário)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`UserRef`](#userref)
    - [`User`](#user)

---

## Descrição

descrever

## Metadados

### `UserRef`

[^topo](#usuário)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como usuário embutido em outras entidades.

---

### `User`

[^topo](#usuário)

| name         | label            | type                                              | public | required     |
| ------------ | ---------------- | ------------------------------------------------- | ------ | ------------ |
| id           | ID               | [id](./../../metadados.md#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby) | true   | RECOMENDÁVEL |

---
