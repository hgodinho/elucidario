# Agent

## Descrição

Agente criador/modificador de algum [Object](object), [Set](set), [Event](event), [VisualObject](visual-object), [TextualObject](textual-object), [DigitalObject](digital-object), [Place](place). Diferentemente do Linked Art em que são definidas duas entidades para agentes: [`Person`](https://linked.art/api/1.0/schema_docs/person/) e [`Group`](https://linked.art/api/1.0/schema_docs/group/), e a única diferença entre elas são os metadados que representam o nascimento e morte de uma `Person` ou a criação e encerramento de um `Group`, o MDORIM sintetiza esses metadados em somente um para criação `Begin` e um para término `End` que pertencem a somente uma entidade denominada `Agent` que possui uma propriedade `AgentType` que desambígua o tipo de agente classificando-o como um dos [`<AgentsByType>`](../concepts/pre-defined-concepts#agentsbytype) nos conceitos pré-definidos.

## Classes

### `AgentRef`

> tipo [`Ref`](../metadata#ref) usado em `many`

**Descrição:** Utilizado como agente embutido em outras entidades.

---

### `Agent`

> tipo `object` extende [`EntityGenericBase`](generic#entitygenericbase)

**Descrição:** Extende a `EntityGenericBase`, portanto possui todas suas propriedades e mais as descritas a seguir

| name           | label            | type                                         | public | required |
| -------------- | ---------------- | -------------------------------------------- | ------ | -------- |
| equivalent     | Equivalente      | [Equivalent](../metadata#equivalent)         | true   | OPCIONAL |
| representation | Representação    | [Representation](../metadata#representation) | true   | OPCIONAL |
| member_of      | Membro de        | [MemberOf](../metadata#memberof)             | true   | OPCIONAL |
| subject_of     | Referenciado por | [SubjectOf](../metadata#subjectof)           | true   | OPCIONAL |
| attributed_by  | Atribuições      | [AttributedBy](../metadata#attributedby)     | true   | OPCIONAL |
| carried_out    | Realizações      | CarriedOut                                   | true   | OPCIONAL |
| contacts       | Contato          | Contacts                                     | true   | OPCIONAL |
| address        | Endereço         | Address                                      | true   | OPCIONAL |
| begin          | Origem           | Begin                                        | true   | OPCIONAL |
| end            | Término          | End                                          | true   | OPCIONAL |

---
