# Conceitos

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

## Menu <!-- omit in toc -->

- [Conceitos](#conceitos)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`ConceptRef`](#conceptref)
    - [`Concept`](#concept)
    - [`Criation`](#criation)

---

## Descrição

Utilizado para descrever conceitos como tipos, materiais, linguagens, medidas, entre outros tipos de conceitos. Funciona como um vocabulário controlado. É amplamente baseado no endpoint Concept do Linked Art.

Os Conceitos podem ser definidos como termos únicos ou como agrupamentos ou coleções de termos que compartilham algo em comum, em estruturas de tesauros são os termos definidos entre sinais de maior e menor, por exemplo: [`<nomes e conceitos relacionados>`](https://www.getty.edu/vow/AATFullDisplay?find=name&logic=AND&note=&subjectid=300404653) no Getty AAT.

Por padrão o MDORIM vem com [alguns conceitos pré-definidos](../concepts/pre-defined-concepts.md) baseados inteiramente em ontologias como FOAF e vocabulários do Getty. Os conceitos pré-definidos seguem o mesmo modelo do Concept e são criados automaticamente na instalação do Elucidário.art. Esses conceitos são utilizados para facilitar a integração do modelo com a interface de usuário, servindo também como exemplo de como definir novos conceitos no app.

## Metadados

### `ConceptRef`

[^topo](#conceitos)

> tipo `object` usado em `many`

**Descrição:** Utilizado como conceito embutido em outras entidades.

| name   | label  | type   | public | requirement | extra                           | map: linked-art | map: crm |
| ------ | ------ | ------ | ------ | ----------- | ------------------------------- | --------------- | -------- |
| id     | ID     | string | true   | REQUER      | DEVE ser URI                    | id              |          |
| type   | Tipo   | string | true   | REQUER      | DEVE ser mesmo tipo que Concept | type            |          |
| _label | Rótulo | string | true   | RECOMENDADO |                                 | _label          |          |

---

### `Concept`

[^topo](#conceitos)

> tipo `object` usado em `All`

| name           | label                 | type                                              | public | requirement | extra         | map: wp                |
| -------------- | --------------------- | ------------------------------------------------- | ------ | ----------- | ------------- | ---------------------- |
| _id            | ID                    | [_id](./../../metadados.md#_id)                   | true   | auto        |               | term->term_taxonomy_id |
| _label         | Label                 | [_label](./../../metadados.md#_label)             | true   | RECOMENDADO |               | term->name             |
| uri            | URI                   | [uri](./../../metadados.md#uri)                   | true   | auto        |               |                        |
| type           | Tipo                  | string                                            | true   | REQUER      | const:Concept |                        |
| identified_by  | Identificado como     | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER      |               |                        |
| classified_as  | Classificado como     | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | RECOMENDADO |               |                        |
| description    | Descrição             | descriptions                                      | true   | OPCIONAL    |               |                        |
| equivalent     | Equivalente           | equivalent                                        | true   | OPCIONAL    |               |                        |
| representation | Representação         | representation                                    | true   | OPCIONAL    |               |                        |
| member_of      | Coleções              | carried_out                                       | true   | OPCIONAL    |               |                        |
| subject_of     | Referenciado por      | subject_of                                        | true   | OPCIONAL    |               |                        |
| attributed_by  | Atribuído por         | contacts                                          | true   | OPCIONAL    |               |                        |
| broader        | Conceitos mais amplos | address                                           | true   | OPCIONAL    |               |                        |
| created_by     | Criação               | [Criation](#criation)                             | true   | OPCIONAL    |               |                        |

---

### `Criation`

[^topo](#conceitos)

> tipo `object` usado em [`Concept`](#concept)

| name          | label              | type                                              | public | requirement | extra          | map: linked-art                                                                      |
| ------------- | ------------------ | ------------------------------------------------- | ------ | ----------- | -------------- | ------------------------------------------------------------------------------------ |
| type          | Tipo               | string                                            | true   | REQUER      | const:Creation | ld:[Creations](https://linked.art/api/1.0/endpoint/concept/#properties-of-creations) |
| _label        | Label              | [_label](../../metadados.md#_label)               | true   | RECOMENDADO |                | ld:_label                                                                            |
| identified_by | Identificado como  | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER      |                | ld:identified_by                                                                     |
| classified_as | Classificado como  | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | OPCIONAL    |                | ld:classified_as                                                                     |
| timespan      | Intervalo de tempo | timespan                                          | true   | OPCIONAL    |                | ld:timespan                                                                          |
| description   | Descrição          | descriptions                                      | true   | OPCIONAL    |                | ld:referred_to_by                                                                    |
| influenced_by | Influenciado por   | influenced_by                                     | true   | OPCIONAL    |                | ld:influenced_by                                                                     |

---
