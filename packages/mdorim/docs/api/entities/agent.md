# Agente

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Agente](#agente)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`AgentRef`](#agentref)
    - [`Agent`](#agent)

---

## Descrição

Agente criador/modificador de algum Objeto, Coleção, Evento, ObjetoVisual, ObjetoTextual, ObjetoDigital. Diferentemente do Linked Art em que são definidas duas entidades para agentes: [`Person`](https://linked.art/api/1.0/schema_docs/person/) e [`Group`](https://linked.art/api/1.0/schema_docs/group/), e a única diferença entre elas são os metadados que representam o nascimento e morte de uma `Person` ou a criação e encerramento de um `Group`, o MDORIM sintetiza esses metadados em somente um para criação `Begin` e um para término `End` que pertencem a somente uma entidade denominada `Agent` que possui uma propriedade `AgentType`.

## Metadados

### `AgentRef`

[^topo](#agent)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como agente embutido em outras entidades.

---

### `Agent`

[^topo](#agente)

| name           | label            | type                                                  | public | required     |
| -------------- | ---------------- | ----------------------------------------------------- | ------ | ------------ |
| id             | ID               | [id](./../../metadados.md#id)                         | true   | auto         |
| agent_type     | Tipo de agente   | [AgentType](./../../metadados.md#agenttype)           | true   | REQUER       |
| identified_by  | Identificações   | [IdentifiedBy](./../../metadados.md#identifiedby)     | true   | REQUER       |
| classified_as  | Classificacoes   | [ClassifiedAs](./../../metadados.md#classifiedas)     | true   | REQUER       |
| referred_to_by | Referenciado por | [ReferredToBy](./../../metadados.md#referredtoby)     | true   | RECOMENDÁVEL |
| equivalent     | Equivalente      | [Equivalent](./../../metadados.md#equivalent)         | true   | OPCIONAL     |
| representation | Representação    | [Representation](./../../metadados.md#representation) | true   | OPCIONAL     |
| member_of      | Membro de        | [MemberOf](./../../metadados.md#memberof)             | true   | OPCIONAL     |
| subject_of     | Referenciado por | [SubjectOf](./../../metadados.md#subjectof)           | true   | OPCIONAL     |
| attributed_by  | Atribuições      | [AttributedBy](./../../metadados.md#attributedby)     | true   | OPCIONAL     |
| carried_out    | Realizações      | CarriedOut                                            | true   | OPCIONAL     |
| contacts       | Contato          | Contacts                                              | true   | OPCIONAL     |
| address        | Endereço         | Address                                               | true   | OPCIONAL     |
| begin          | Origem           | Begin                                                 | true   | OPCIONAL     |
| end            | Término          | End                                                   | true   | OPCIONAL     |

---
