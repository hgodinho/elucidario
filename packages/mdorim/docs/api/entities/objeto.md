# Objeto

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Agente](./agente.md) | [Coleção >](./colecao.md)

---

- [Objeto](#objeto)
  - [Descrição](#descrição)
    - [Metadados](#metadados)

---

## Descrição

Agente criador/modificador de algum Object, Set, Event, VisualWork, TextualWork, DigitalObject.

### Metadados

| name          | label             | type                    | public | required | extra |
| ------------- | ----------------- | ----------------------- | ------ | -------- | ----- |
| identified_by | Identificações    | anyOf(Identifier\|Name) | true   | true     | extra |
| classified_as | Classificado como | array\[Type\]           | true   | true     | extra |

---
