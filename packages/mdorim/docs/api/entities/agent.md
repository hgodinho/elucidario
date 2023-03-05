# Agente

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

- [Agente](#agente)
  - [Descrição](#descrição)
    - [Metadados](#metadados)

---

## Descrição

Agente criador/modificador de algum Objeto, Coleção, Evento, ObjetoVisual, ObjetoTextual, ObjetoDigital.

### Metadados

| status | name                                        | label            | type           | public | required |
| ------ | ------------------------------------------- | ---------------- | -------------- | ------ | -------- |
|        | [id](./../../metadados.md#id)               | ID               | number         | true   | auto     |
|        | [agent_type](../../metadados.md#agent_type) | Tipo de agente   | string         | true   | true     |
|        | identified_by                               | Identificações   | IdentifiedBy   | true   | one      |
|        | classified_as                               | Classificacoes   | ClassifiedAs   | true   | one      |
|        | description                                 | Descrição        | Descriptions   | true   | false    |
|        | equivalent                                  | Equivalente      | Equivalent     | true   | false    |
|        | representation                              | Representação    | Representation | true   | false    |
|        | subject_of                                  | Referenciado por | SubjectOf      | true   | true     |
|        | carried_out                                 | Realizações      | CarriedOut     | true   | true     |
|        | contacts                                    | Contato          | Contacts       | true   | true     |
|        | address                                     | Endereço         | Address        | true   | true     |
|        | born                                        | Nascimento       | CarriedOut     | true   | true     |
|        | died                                        | Morte            | CarriedOut     | true   | true     |

---
