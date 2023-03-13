# Visual Object

## Descrição

:::caution Status da página

- [x] em definição

:::

descrever

## Classes

### `VisualObjectRef`

:::info

tipo [`Ref`](../metadata#ref) usado em `many`

:::

**Descrição:** Utilizado como objeto visual embutido em outras entidades.

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `VisualObject`

:::info

tipo `object` extende [`EntityGenericBase`](generic#entitygenericbase)

:::

**Descrição:** Extende a `EntityGenericBase`, portanto possui todas suas propriedades e mais as descritas a seguir

| name         | label            | type                                     | public | required     |
| ------------ | ---------------- | ---------------------------------------- | ------ | ------------ |
| id           | ID               | [id](../metadata#id)                     | true   | auto         |
| agentType    | Tipo de agente   | [AgentType](../metadata#agenttype)       | true   | REQUER       |
| identifiedBy | Identificações   | [IdentifiedBy](../metadata#identifiedby) | true   | REQUER       |
| classifiedAs | Classificacoes   | [ClassifiedAs](../metadata#classifiedas) | true   | REQUER       |
| referredToBy | Referenciado por | [ReferredToBy](../metadata#referredtoby) | true   | RECOMENDÁVEL |

:::caution Status

- [ ] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---
