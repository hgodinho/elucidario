# Metadados

[Início](../README.md) | [Glossário](./glossario.md) | [< Taxonomias](./api/taxonomies.md)

---

## Menu <!-- omit in toc -->

- [Metadados](#metadados)
  - [MDORIM](#mdorim)
    - [`ID`](#id)
    - [`URI`](#uri)
    - [`AgentType`](#agenttype)
    - [`Assigned`](#assigned)
    - [`AttributedBy`](#attributedby)
    - [`CarriedOutBy`](#carriedoutby)
    - [`ClassifiedAs`](#classifiedas)
    - [`Dimension`](#dimension)
      - [`MeasurementUnit`](#measurementunit)
      - [`MeasurementActivity`](#measurementactivity)
    - [`Equivalent`](#equivalent)
    - [`ExternalRef`](#externalref)
    - [`IdentifiedBy`](#identifiedby)
      - [`Identifier`](#identifier)
      - [`Name`](#name)
    - [`MemberOf`](#memberof)
    - [`ReferredToBy`](#referredtoby)
      - [`Statement`](#statement)
    - [`Ref`](#ref)
    - [`Representation`](#representation)
    - [`SubjectOf`](#subjectof)
    - [`Timespan`](#timespan)
  - [Linked-Art](#linked-art)
    - [`@context`](#context)
    - [`_id`](#_id)
    - [`_type`](#_type)
    - [`_label`](#_label)

---

## MDORIM

### `ID`

[^topo](#metadados)

> tipo `number` usado em [`Entidades`](./api/entities.md).

**Descrição:** ID no formato `number` respeitando o formato de gravação do WP.

| name | label | type   | public | requirement | extra        |
| ---- | ----- | ------ | ------ | ----------- | ------------ |
| id   | ID    | number | true   | auto        | ID do objeto |

---

### `URI`

[^topo](#metadados)

> tipo `string` usado em `many class`

**Descrição:** description

| name | label | type   | public | requirement | extra        | map: linked-art | map: crm |
| ---- | ----- | ------ | ------ | ----------- | ------------ | --------------- | -------- |
| uri  | URI   | string | true   | REQUER      | pattern: url | ld:id           |          |

---

### `AgentType`

[^topo](#metadados)

> tipo `string` usado em [`Agente`](./api/entities/agent.md)

**Descrição:** description

| name      | label          | type   | public | requirement | extra                                                                       | map: linked-art | map: crm |
| --------- | -------------- | ------ | ------ | ----------- | --------------------------------------------------------------------------- | --------------- | -------- |
| agentType | Tipo de agente | string | true   | REQUER      | oneOf\<[`AgentsByType`](api/concepts/pre-defined-concepts.md#agentsbytype)> |                 |          |

---

### `Assigned`

[^topo](#metadados)

> tipo anyOf\< [`AgentRef`](./api/entities/agent.md#agentref) | [`ConceptRef`](./api/entities/concept.md#conceptref) | [`ObjectRef`](api/entities/object.md#objectref) | [`DigitalObjectRef`](api/entities/digital-object.md#digitalobjectref) | [`TextualObjectRef`](api/entities/textual-object.md#textualobjectref) | [`PlaceRef`](api/entities/places.md#placesref) | [`SetRef`](./api/entities/set.md#setref) | [`EventRef`](./api/entities/event.md#eventref) > usado em [`AttributedBy`](#attributedby)

**Descrição:** descrição

---

### `AttributedBy`

[^topo](#metadados)

> tipo `object` usado em `Entities`

**Descrição:** descrição

| name              | label                 | type                          | public | requirement  | extra                                            | map: linked-art | map: crm |
| ----------------- | --------------------- | ----------------------------- | ------ | ------------ | ------------------------------------------------ | --------------- | -------- |
| _type             | Tipo                  | [ld:_type](#_type)            | true   | REQUER       | const: AttributeAssignment                       |                 |          |
| _label            | Label                 | [ld:_label](#_label)          | true   | REQUER       | gerado automaticamente pelo campo `IdentifiedBy` |                 |          |
| identified_by     | Identificado por      | [IdentifiedBy](#identifiedby) | true   | REQUER       |                                                  |                 |          |
| classified_as     | Classificado como     | [ClassifiedAs](#classifiedas) | true   | RECOMENDÁVEL |                                                  |                 |          |
| referred_to_by    | Referenciado por      | [ReferredToBy](#referredtoby) | true   | RECOMENDÁVEL |                                                  |                 |          |
| carried_out_by    | Realizado por         | [CarriedOutBy](#carriedoutby) | true   | RECOMENDÁVEL |                                                  |                 |          |
| timespan          | Intervalo de tempo    | [Timespan](#timespan)         | true   | RECOMENDÁVEL |                                                  |                 |          |
| assigned          | Atribuído             | [Assigned](#assigned)         | true   | RECOMENDÁVEL |                                                  |                 |          |
| assigned_property | Propriedade atribuída | [ClassifiedAs](#classifiedas) | true   | RECOMENDÁVEL |                                                  |                 |          |

---

### `CarriedOutBy`

[^topo](#metadados)

> tipo [`AgentRef[]`](api/entities/agent.md#agentref) usado em `many`

---

### `ClassifiedAs`

[^topo](#metadados)

> tipo [`ConceptRef[]`](../docs/api/entities/concept.md#conceptref) usado em `All`

**Descrição:** Array de objetos referência a um conceito

---

### `Dimension`

[^topo](#metadados)

> tipo `object` usado em `???`

**Descrição:** descrição

| name           | label             | type                                        | public | requirement  | extra                           | map: linked-art | map: crm |
| -------------- | ----------------- | ------------------------------------------- | ------ | ------------ | ------------------------------- | --------------- | -------- |
| _type          | Tipo              | [_type](#_type)                             | true   | REQUER       | const: Dimension                |                 |          |
| _label         | Tipo              | [_label](#_label)                           | true   | REQUER       | criado com base no IdentifiedBy |                 |          |
| value          | Valor             | number                                      | true   | REQUER       | valor numérico da dimensão      |                 |          |
| unit           | Unidade           | [MeasurementUnit](#measurementunit)         | true   | REQUER       |                                 |                 |          |
| identified_by  | Identificado por  | [IdentifiedBy](#identifiedby)               | true   | REQUER       |                                 |                 |          |
| classified_as  | Classificado como | [ClassifieAs](#classifiedas)                | true   | RECOMENDÁVEL |                                 |                 |          |
| referred_to_by | Referenciado por  | [ReferredToBy](#referredtoby)               | true   | RECOMENDÁVEL |                                 |                 |          |
| assigned_by    | Atribuído por     | [MeasurementActivity](#measurementactivity) | true   | OPCIONAL     |                                 |                 |          |

#### `MeasurementUnit`

[^topo](#metadados)

> tipo `object` usado em [`Dimension`](#dimension)

**Descrição:** descrição

| name | label | type | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ----- | --------------- | -------- |
| name | label | type | true   | true        | extra | linked-art      | crm      |

#### `MeasurementActivity`

[^topo](#metadados)

> tipo `object` usado em `nome`

**Descrição:** descrição

| name           | label              | type                          | public | requirement  | extra                      | map: linked-art | map: crm |
| -------------- | ------------------ | ----------------------------- | ------ | ------------ | -------------------------- | --------------- | -------- |
| _type          | Tipo               | [_type](#_type)               | true   | REQUER       | const: AttributeAssignment |                 |          |
| classified_as  | Classificado como  | [ClassifiedAs](#classifiedas) | true   | RECOMENDÁVEL |                            |                 |          |
| carried_out_by | Realizado por      | [CarriedOutBy](#carriedoutby) | true   | RECOMENDÁVEL |                            |                 |          |
| timespan       | Intervalo de tempo | [Timespan](#timespan)         | true   | OPCIONAL     |                            |                 |          |
| referred_to_by | Referenciado por   | [ReferredToBy](#referredtoby) | true   | OPCIONAL     |                            |                 |          |

---

### `Equivalent`

[^topo](#metadados)

> tipo [`ExternalRef[]`](#externalref) usado em `Concept`

---

### `ExternalRef`

[^topo](#metadados)

> tipo `object` usado em `object`

**Descrição:** Utilizado para descreve uma referência externa

| name          | label             | type                          | public | requirement | extra                                                  | map: linked-art | map: crm |
| ------------- | ----------------- | ----------------------------- | ------ | ----------- | ------------------------------------------------------ | --------------- | -------- |
| _uri          | URI               | [URI](#uri)                   | true   | REQUER      |                                                        | id              |          |
| _label        | Label             | [_label](#_label)             | true   | auto        | criado automaticamente a partir do campo identified_by | _label          |          |
| type          | Tipo              | [_type](#_type)               | true   | RECOMENDADO | DEVE ser o mesmo tipo da entidade referenciada         | type            |          |
| identified_by | Identificado por  | [IdentifiedBy](#identifiedby) | true   | REQUER      |                                                        | identified_by   |          |
| classified_as | Classificado como | [ClassifiedAs](#classifiedas) | true   | RECOMENDADO |                                                        | classified_as   |          |

---

### `IdentifiedBy`

> tipo anyOf<[`Name`](#name)|[`Identifier`](#identifier)> usado em [`Entidades`](./api/entities.md)

---

#### `Identifier`

[^topo](#metadados)

> tipo `object` usado em [`IdentifiedBy`](#identifiedby) mesmo que [Identifier](https://linked.art/api/1.0/shared/identifier/)

**Descrição:** description

| name          | label             | type                          | public | requirement | extra            | map: linked-art | map: crm |
| ------------- | ----------------- | ----------------------------- | ------ | ----------- | ---------------- | --------------- | -------- |
| _type         | Tipo              | [_type](#_type)               | true   | REQUER      | const:Identifier | type            |          |
| content       | Conteúdo          | string                        | true   | REQUER      |                  | content         |          |
| classified_as | Classificado como | [ClassifiedAs](#classifiedas) | true   | OPCIONAL    |                  | classified_as   |          |
| assigned_by   | Assinado por      | [AssignedBy](#assigned)       | true   | OPCIONAL    |                  | assigned_by     |          |

---

#### `Name`

> tipo `object` usado em [`IdentifiedBy`](#identifiedby) mesmo que [Name](https://linked.art/api/1.0/shared/name/)

**Descrição:** description

| name          | label          | type            | public | requirement | extra      | map: linked-art | map: crm |
| ------------- | -------------- | --------------- | ------ | ----------- | ---------- | --------------- | -------- |
| _type         | Tipo           | [_type](#_type) | true   | REQUER      | const:Name | type            |          |
| content       | Conteúdo       | string          | true   | REQUER      |            | content         |          |
| classified_as | Classificações | ClassifiedAs    | true   | OPCIONAL    |            | classified_as   |          |
| language      | Idioma         | string          | true   | OPCIONAL    |            | language        |          |

---

### `MemberOf`

[^topo](#metadados)

> tipo Array\<[`AgentRef`](./api/entities/agent.md#agentref)|[`ConceptRef`](./api/entities/concept.md#conceptref) > usado em `Entidades`

**Descrição:** Membro de algum ou alguns [`Agent`](./api/entities/agent.md) com a propriedade [`AgentType`](#agenttype) definida como Group ou Organization no contexto de uso do `Agent`. No contexto de uso do `Concept` será membro de algum ou alguns [`ConceptCollection`](./api/entities/concept.md#conceptcollection) representado por um `ConceptRef`, uma vez o `ConceptCollection` extende o objeto principal `Concept`, logo também é um `Concept`.

---

### `ReferredToBy`

[^topo](#metadados)

> tipo anyOf\< [`Statement`](#statement) | [TextualObjectRef](./api/entities/textual-object.md#textualobjectref) > usado em `Entities`

**Descrição:** description

#### `Statement`

[^topo](#metadados)

> tipo `object` usado em `object`

**Descrição:** description

| name          | label             | type                                                                                                    | public | requirement | extra                  | map: linked-art | map: crm |
| ------------- | ----------------- | ------------------------------------------------------------------------------------------------------- | ------ | ----------- | ---------------------- | --------------- | -------- |
| type          | Tipo              | [_type](#_type)                                                                                         | true   | REQUER      | const:LinguisticObject | type            |          |
| content       | Conteúdo          | string                                                                                                  | true   | REQUER      |                        | content         |          |
| language      | Idioma            | anyOf\<[LanguagesByTypeConcepts](./api/concepts/pre-defined-concepts.md#languagesbytypeconcepts)>       | true   | REQUER      |                        | content         |          |
| classified_as | Classificado como | anyOf\<[DescriptionsByTypeConcepts](./api/concepts/pre-defined-concepts.md#descriptionsbytypeconcepts)> | true   | REQUER      |                        | content         |          |

---

### `Ref`

[^topo](#metadados)

> tipo `object` usado em `many`

**Descrição:** Utilizado como classe genérica para ser extendida em outras Refs como [ConceptRef](./api/entities/concept.md#conceptref), [AgentRef](./api/entities/agent.md#agentref), etc.

| name   | label  | type                 | public | requirement | extra                           | map: linked-art | map: crm |
| ------ | ------ | -------------------- | ------ | ----------- | ------------------------------- | --------------- | -------- |
| _id    | ID     | [ld:_id](#_id)       | true   | REQUER      | DEVE ser URI                    | id              |          |
| _type  | Tipo   | [ld:_type](#_type)   | true   | REQUER      | DEVE ser mesmo tipo que Concept | type            |          |
| _label | Rótulo | [ld:_label](#_label) | true   | RECOMENDADO |                                 | _label          |          |

---

### `Representation`

[^topo](#metadados)

> tipo `object` usado em `Entidades`

**Descrição:** descrição

| name | label | type | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ----- | --------------- | -------- |
| name | label | type | true   | true        | extra | linked-art      |          |

---

### `SubjectOf`

[^topo](#metadados)

> tipo anyOf\<[`TextualObjectRef`](api/entities/textual-object.md#textualobjectref) | [`VisualObjectRef`](./api/entities/visual-object.md#visualobjectref)> usado em `Entities`

**Descrição:** representa o assunto de uma entidade referenciada por TextualObjectRef ou ViusualObjectRef.

---

### `Timespan`

[^topo](#metadados)

> tipo `object` usado em [`AttributedBy`](#attributedby)

**Descrição:** Descreve intervalos de tempos, é RECOMENDÁVEL classificar o intervalo com algum [`Concept`](./api/entities/concept.md) criado com base na faceta [Estilos e Períodos](https://www.getty.edu/vow/AATHierarchy?find=period&logic=AND&note=&subjectid=300264088) do Getty AAT ou algum outro vocabulário com faceta temporal.

| name               | label             | type                          | public | requirement  | extra                                          | map: linked-art | map: crm |
| ------------------ | ----------------- | ----------------------------- | ------ | ------------ | ---------------------------------------------- | --------------- | -------- |
| _type              | Tipo              | [_type](#_type)               | true   | REQUER       | const: Timespan                                |                 |          |
| _label             | Label             | [_label](#_label)             | true   | REQUER       | automaticamente criada pelo campo IdentifiedBy |                 |          |
| identified_by      | Identificado por  | [IdentifiedBy](#identifiedby) | true   | REQUER       |                                                |                 |          |
| classified_as      | Classificado como | [ClassifiedAs](#classifiedas) | true   | RECOMENDÁVEL |                                                |                 |          |
| begin_of_the_begin | Inicio do início  | date                          | true   | RECOMENDÁVEL | ISO8601                                        |                 |          |
| end_of_the_end     | Fim do fim        | date                          | true   | RECOMENDÁVEL | ISO8601                                        |                 |          |
| end_of_the_begin   | Fim do início     | date                          | true   | OPCIONAL     | ISO8601                                        |                 |          |
| begin_of_the_end   | Começo do fim     | date                          | true   | OPCIONAL     | ISO8601                                        |                 |          |
| referred_to_by     | Referenciado por  | [ReferredToBy](#referredtoby) | true   | OPCIONAL     |                                                |                 |          |
| duration           | Duração           | [Dimension](#dimension)       | true   | OPCIONAL     |                                                |                 |          |

---

## Linked-Art

### `@context`

[^topo](#metadados)

> tipo `string|array` usado em [`Entities`](./api/entities.md)

| name     | label    | type            | public | requirement | extra                                                                         | map: linked-art | map: crm |
| -------- | -------- | --------------- | ------ | ----------- | ----------------------------------------------------------------------------- | --------------- | -------- |
| @context | Contexto | (string\|array) | true   | true        | Contexto dos vocabulários utilizados, string ou array de URIs de vocabulários | @context        |          |

---

### `_id`

[^topo](#metadados)

> tipo `string` usado em `Entities`

| name | label | type   | public | requirement | extra                    | map: linked-art | map: crm |
| ---- | ----- | ------ | ------ | ----------- | ------------------------ | --------------- | -------- |
| _id  | ID    | string | true   | true        | ID DEVE ser HTTTP(s) URI | id              |          |

---

### `_type`

[^topo](#metadados)

> tipo `string` usado em `Entities`

| name  | label | type   | public | requirement | extra | map: linked-art | map: crm |
| ----- | ----- | ------ | ------ | ----------- | ----- | --------------- | -------- |
| _type | Tipo  | string | true   | true        |       | type            |          |

---

### `_label`

[^topo](#metadados)

> tipo `string` usado em `Entities`

| name   | label | type   | public | requirement | extra | map: linked-art | map: crm |
| ------ | ----- | ------ | ------ | ----------- | ----- | --------------- | -------- |
| _label | label | string | true   | true        |       | _label          |          |

---
