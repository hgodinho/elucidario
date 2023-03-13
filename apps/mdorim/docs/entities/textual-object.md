# Textual Object

## Descrição

descrever

## Classes

### `TextualObjectRef`

> tipo [`Ref`](../metadata#ref) usado em `many`

**Descrição:** Utilizado como objeto textual embutido em outras entidades.

---

### `TextualObject`

| name         | label            | type                                     | public | required     |
| ------------ | ---------------- | ---------------------------------------- | ------ | ------------ |
| id           | ID               | [id](../metadata#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](../metadata#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](../metadata#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](../metadata#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](../metadata#referredtoby) | true   | RECOMENDÁVEL |

---
