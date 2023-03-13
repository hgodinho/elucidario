# Digital Object

## Descrição

descrever

## Metadados

### `DigitalObjectRef`

> tipo [`Ref`](../metadata#ref) usado em `many`

**Descrição:** Utilizado como objeto digital embutido em outras entidades.

---

### `DigitalObject`

| name         | label            | type                                     | public | required     |
| ------------ | ---------------- | ---------------------------------------- | ------ | ------------ |
| id           | ID               | [id](../metadata#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](../metadata#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](../metadata#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](../metadata#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](../metadata#referredtoby) | true   | RECOMENDÁVEL |

---
