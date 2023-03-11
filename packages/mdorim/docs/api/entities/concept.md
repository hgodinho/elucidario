# Conceitos

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

## Menu <!-- omit in toc -->

- [Conceitos](#conceitos)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`ConceptRef`](#conceptref)
    - [`Concept`](#concept)
    - [`ConceptCollection`](#conceptcollection)
    - [`Criation`](#criation)

---

## Descrição

Utilizado para descrever conceitos como tipos, materiais, linguagens, medidas, entre outros tipos de conceitos. Funciona como um vocabulário controlado. É amplamente baseado no endpoint Concept do Linked Art.

Os Conceitos podem ser definidos como termos únicos ou como agrupamentos ou coleções de termos que compartilham algo em comum, em estruturas de tesauros são os termos definidos entre sinais de maior e menor, por exemplo: [`<nomes e conceitos relacionados>`](https://www.getty.edu/vow/AATFullDisplay?find=name&logic=AND&note=&subjectid=300404653) no Getty AAT.

Por padrão o MDORIM vem com [alguns conceitos pré-definidos](../concepts/pre-defined-concepts.md) baseados inteiramente em ontologias como FOAF e vocabulários do Getty. Os conceitos pré-definidos seguem o mesmo modelo do Concept e são criados automaticamente na instalação do Elucidário.art. Esses conceitos são utilizados para facilitar a integração do modelo com a interface de usuário, servindo também como exemplo de como definir novos conceitos no app.

## Metadados

### `ConceptRef`

[^topo](#conceitos)

> tipo [`Ref`](./../../metadados.md#ref) usado em `many`

**Descrição:** Utilizado como conceito embutido em outras entidades.

---

### `Concept`

[^topo](#conceitos)

> tipo `object` usado em `All`

**Descrição:** Objeto completo de um conceito, retornado quando chamado explicitamente.

| name           | label                 | type                                                  | public | requirement | extra                                                 | map: wp                |
| -------------- | --------------------- | ----------------------------------------------------- | ------ | ----------- | ----------------------------------------------------- | ---------------------- |
| _type          | Tipo                  | [_type](./../../metadados.md#_type)                   | true   | REQUER      | const:Concept                                         |                        |
| _label         | Label                 | [_label](./../../metadados.md#_label)                 | true   | REQUER      | criado automaticamente baseado no campo identified_by | term->name             |
| ID             | ID                    | [ID](./../../metadados.md#ID)                         | true   | REQUER      | criado automaticamente pelo sistema                   | term->term_taxonomy_id |
| URI            | URI                   | [URI](./../../metadados.md#uri)                       | true   | REQUER      | criado automaticamente pelo sistema                   | term->url? permalink?  |
| identified_by  | Identificado como     | [IdentifiedBy](./../../metadados.md#identifiedby)     | true   | REQUER      |                                                       |                        |
| classified_as  | Classificado como     | [ClassifiedAs](./../../metadados.md#classifiedas)     | true   | OPCIONAL    |                                                       |                        |
| referred_to_by | Referenciado por      | [ReferredToBy](./../../metadados.md#referredtoby)     | true   | OPCIONAL    |                                                       |                        |
| equivalent     | Equivalente           | [Equivalent](./../../metadados.md#equivalent)         | true   | OPCIONAL    |                                                       |                        |
| representation | Representação         | [Representation](./../../metadados.md#representation) | true   | OPCIONAL    |                                                       |                        |
| member_of      | Coleções              | [MemberOf](./../../metadados.md#memberof)             | true   | OPCIONAL    |                                                       |                        |
| subject_of     | Referenciado por      | [SubjectOf](./../../metadados.md#subjectof)           | true   | OPCIONAL    |                                                       |                        |
| attributed_by  | Atribuído por         | [AttributedBy](./../../metadados.md#attributedby)     | true   | OPCIONAL    |                                                       |                        |
| broader        | Conceitos mais amplos | Broader                                               | true   | OPCIONAL    |                                                       |                        |
| created_by     | Criação               | [Criation](#criation)                                 | true   | OPCIONAL    |                                                       |                        |

---

### `ConceptCollection`

[^topo](#conceitos)

> tipo `object` usado em `All`

**Descrição:** Extende o [`Concept`](#concept), portanto possui todas suas propriedades e mais as descritas na tabela a seguir:

| name   | label   | type                                  | public | requirement  | extra                                                                       | map: wp |
| ------ | ------- | ------------------------------------- | ------ | ------------ | --------------------------------------------------------------------------- | ------- |
| _type  | Tipo    | [_type](./../../metadados.md#_type)   | true   | REQUER       | const:ConceptCollection                                                     |         |
| _label | Label   | [_label](./../../metadados.md#_label) | true   | REQUER       | criado automaticamente baseado no campo identified_by e colocado entre `<>` |         |
| member | Membros | [ConceptRef[]](#conceptref)           | true   | RECOMENDÁVEL |                                                                             |         |

---

### `Criation`

[^topo](#conceitos)

> tipo `object` usado em [`Concept`](#concept)

**Descrição:** Objeto que descreve a criação do conceito, e não da criação do conceito na base de dados. Isso significa que esta classe serve descrever quando e como o conceito foi criado.

| name           | label              | type                                              | public | requirement | extra                                     | map: linked-art                                                                   |
| -------------- | ------------------ | ------------------------------------------------- | ------ | ----------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| type           | Tipo               | [type](./../../metadados.md#type)                 | true   | REQUER      | const:Creation                            | [Creations](https://linked.art/api/1.0/endpoint/concept/#properties-of-creations) |
| _label         | Label              | [_label](../../metadados.md#_label)               | true   | RQUER       | criado automaticamente pelo identified_by | _label                                                                            |
| identified_by  | Identificado como  | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER      |                                           | identified_by                                                                     |
| classified_as  | Classificado como  | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | OPCIONAL    |                                           | classified_as                                                                     |
| timespan       | Intervalo de tempo | Timespan                                          | true   | OPCIONAL    |                                           | timespan                                                                          |
| referred_to_by | Descrição          | [ReferredToBy](./../../metadados.md#referredtoby) | true   | OPCIONAL    |                                           | referred_to_by                                                                    |
| influenced_by  | Influenciado por   | InfluencedBy                                      | true   | OPCIONAL    |                                           | influenced_by                                                                     |

---
