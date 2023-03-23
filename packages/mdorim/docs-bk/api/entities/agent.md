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

Agente criador/modificador de algum [Object](object.md), [Set](set.md), [Event](event.md), [VisualObject](visual-object.md), [TextualObject](textual-object.md), [DigitalObject](digital-object.md), [Place](places.md). Diferentemente do Linked Art em que são definidas duas entidades para agentes: [`Person`](https://linked.art/api/1.0/schema_docs/person/) e [`Group`](https://linked.art/api/1.0/schema_docs/group/), e a única diferença entre elas são os metadados que representam o nascimento e morte de uma `Person` ou a criação e encerramento de um `Group`, o MDORIM sintetiza esses metadados em somente um para criação `Begin` e um para término `End` que pertencem a somente uma entidade denominada `Agent` que possui uma propriedade `AgentType` que desambígua o tipo de agente classificando-o como um dos [`<AgentsByType>`](../concepts/pre-defined-concepts.md#agentsbytype) nos conceitos pré-definidos.

## Metadados

### `AgentRef`

[^topo](#agent)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como agente embutido em outras entidades.

---

### `Agent`

[^topo](#agente)

> tipo `object` extende [`EntityGenericBase`](generic.md#entitygenericbase)

**Descrição:** Extende a `EntityGenericBase`, portanto possui todas suas propriedades e mais as descritas a seguir

| name           | label            | type                                                  | public | required     |
| -------------- | ---------------- | ----------------------------------------------------- | ------ | ------------ |
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
