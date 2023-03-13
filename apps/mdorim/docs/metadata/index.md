---
id: metadata
---

# Metadata

## MDORIM

### `ID`

:::info

tipo `number` usado em [`Entidades`](/entities).

:::

**Descrição:** ID no formato `number` respeitando o formato de gravação do WP. O ID é gerado automaticamente pelo WP e é usado para identificar uma entidade de forma única. Representa a coluna `ID` do banco de dados.

| name | label | type   | public | requirement | extra        | map: wp | map: crm                                                                                            |
| ---- | ----- | ------ | ------ | ----------- | ------------ | ------- | --------------------------------------------------------------------------------------------------- |
| id   | ID    | number | true   | auto        | ID do objeto | ID      | [E15 Identifier Assignment](https://cidoc-crm.org/html/cidoc_crm_v7.1.2_with_translations.html#E15) |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `URI`

:::info

tipo `string` usado em `many class`

:::

**Descrição:** URI segue o formato da [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986). O URI é gerado automaticamente pelo WP e é usado para identificar uma entidade de forma única.

| name | label | type   | public | requirement | extra        | map: linked-art | map: crm                                                                                           |
| ---- | ----- | ------ | ------ | ----------- | ------------ | --------------- | -------------------------------------------------------------------------------------------------- |
| uri  | URI   | string | true   | auto        | pattern: url | ld:id           | [E15 Ientifier Assignment](https://cidoc-crm.org/html/cidoc_crm_v7.1.2_with_translations.html#E15) |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `AgentType`

:::info

tipo `string` usado em [`Agente`](/entities/agent)

:::

**Descrição:** Define o tipo de agente. O tipo de agente DEVE ser um dos conceitos pré-definidos em [`AgentsByType`](/concepts#agentsbytype).

| name      | label          | type   | public | requirement | extra                                           |
| --------- | -------------- | ------ | ------ | ----------- | ----------------------------------------------- |
| agentType | Tipo de agente | string | true   | REQUER      | oneOf<[`AgentsByType`](/concepts#agentsbytype)> |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Assigned`

:::info

tipo anyOf< [`AgentRef`](/entities/agent#agentref) | [`ConceptRef`](/entities/concept#conceptref) | [`ObjectRef`](/entities/object#objectref) | [`DigitalObjectRef`](/entities/digital-object#digitalobjectref) | [`TextualObjectRef`](/entities/textual-object#textualobjectref) | [`PlaceRef`](/entities/place#placeref) | [`SetRef`](/entities/set#setref) | [`EventRef`](/entities/event#eventref) > usado em [`AttributedBy`](#attributedby).

:::

**Descrição:** Define o objeto que foi atribuído. O objeto DEVE ser uma das referências de entidades definidas em [`Entities`](/entities).

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `AttributedBy`

:::info

tipo `object` extende [`GenericBase`](/entities/generic#genericbase), usado em `Entities`

:::

**Descrição:** Classe utilizada para definir relações entre objetos sem necessariamente uma relação semântica entre eles. Utiizada no caso de relações que não possam ser definidas em outras propriedades que atribuem valores semânticos mais precisos. Extende a `GenericBase`, portanto possui todas suas propriedades e mais as descritas a seguir:

| name           | label              | type                          | public | requirement | extra                      | map: linked-art   | map: crm                                                                                               |
| -------------- | ------------------ | ----------------------------- | ------ | ----------- | -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| \_type         | Tipo               | [\_type](#_type)              | true   | REQUER      | const: AttributeAssignment | ld:_type          | [crm:E13 Attribute Assignment](https://cidoc-crm.org/html/cidoc_crm_v7.1.2_with_translations.html#E13) |
| carried_out_by | Realizado por      | [CarriedOutBy](#carriedoutby) | true   | OPCIONAL    |                            | ld:carried_out_by | [crm:P14 carried ou by](https://cidoc-crm.org/html/cidoc_crm_v7.1.2_with_translations.html#P14)        |
| timespan       | Intervalo de tempo | [Timespan](#timespan)         | true   | OPCIONAL    |                            | ld:timespan       | [crm:P4 has time span](https://cidoc-crm.org/html/cidoc_crm_v7.1.2_with_translations.html#P4)          |
| assigned       | Atribuído          | [Assigned](#assigned)         | true   | REQUER      |                            | ld:assigned       | [crm:P141 assigned](https://cidoc-crm.org/html/cidoc_crm_v7.1.2_with_translations.html#P141)           |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Broader`

:::info

tipo [`ConceptRef[]`](/entities/concept#conceptref) usado em [`Concept`](/entities/concept#concept).

:::

**Descrição:** Define o conceito mais amplo que o conceito atual. Se definido, DEVE ser uma ou mais referências [`ConceptRef`](/entities/concept#conceptref).

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `CarriedOutBy`

:::info

tipo [`AgentRef[]`](/entities/agent#agentref) usado em [`AttributedBy`](#attributedby) e [`Event`](/entities/event#event). Igual a [`crm:P14_carried_out_by`](http://cidoc-crm.org/cidoc-crm/7.1.2/P14_carried_out_by). Igual a [`ld:carried_out_by`](https://linked.art/api/1.0/shared/assignment/).

:::

**Descrição**: Define o agente que realizou a atribuição. Se definido, DEVE ser uma ou mais referências [`AgentRef`](/entities/agent#agentref).

:::caution Status

- [x] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `ClassifiedAs`

:::info

tipo [`ConceptRef[]`](/entities/concept#conceptref) usado em `All`

:::

**Descrição:** Define o conceito que classifica o objeto. Se definido, DEVE ser uma ou mais referências [`ConceptRef`](/entities/concept#conceptref).

:::caution Status

- [x] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Dimension`

:::info

tipo `object` usado em [Timespan](#timespan)

:::

**Descrição:** Define as dimensões de uma classe. Extende a [`GenericBase`](/entities/generic#genericbase), portanto possui todas suas propriedades e mais as descritas a seguir:

| name        | label         | type                                        | public | requirement | extra                      | map: linked-art | map: crm                                                                |
| ----------- | ------------- | ------------------------------------------- | ------ | ----------- | -------------------------- | --------------- | ----------------------------------------------------------------------- |
| value       | Valor         | number                                      | true   | REQUER      | valor numérico da dimensão | ld:value        | [crm:P90 has value](http://cidoc-crm.org/cidoc-crm/7.1.2/P90_has_value) |
| unit        | Unidade       | [MeasurementUnit](#measurementunit)         | true   | REQUER      |                            | ld:unit         | [crm:P91 has unit](http://cidoc-crm.org/cidoc-crm/7.1.2/P91_has_unit)   |
| assigned_by | Atribuído por | [MeasurementActivity](#measurementactivity) | true   | OPCIONAL    |                            | ld:assigned_by  | [crm:P141 assigned](http://cidoc-crm.org/cidoc-crm/7.1.2/P141_assigned) |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `MeasurementUnit`

:::info

tipo [ConceptRef](/entities/concept#conceptref) usado em [Dimension](#dimension)

:::

**Descrição:** Define a unidade de medida de uma dimensão. DEVE ser uma referência [`ConceptRef`](/entities/concept#conceptref) que aponte para um conceito do tipo [`MeasurementUnit`](/entities/concept#measurementunit).

:::caution Status

- [x] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `MeasurementActivity`

:::info

tipo `object` usado em [Dimension](#dimension)

:::

**Descrição:** Define a atividade de medição de uma dimensão. Extende a [`GenericBase`](/entities/generic#genericbase), portanto possui todas suas propriedades e mais as descritas a seguir:

| name           | label              | type                          | public | requirement  | extra                      | map: linked-art   | map: crm                                                                          |
| -------------- | ------------------ | ----------------------------- | ------ | ------------ | -------------------------- | ----------------- | --------------------------------------------------------------------------------- |
| \_type         | Tipo               | [\_type](#_type)              | true   | REQUER       | const: AttributeAssignment | ld:type           | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)               |
| carried_out_by | Realizado por      | [CarriedOutBy](#carriedoutby) | true   | RECOMENDÁVEL |                            | ld:carried_out_by | [crm:P14_carried_out_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P14_carried_out_by) |
| timespan       | Intervalo de tempo | [Timespan](#timespan)         | true   | OPCIONAL     |                            | ld:timespan       | [crm:P4_has_time-span](http://cidoc-crm.org/cidoc-crm/7.1.2/P4_has_time-span)     |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Equivalent`

:::info

tipo [`ExternalRef[]`](#externalref) usado em `Concept` e `Agent`.

:::

**Descrição:** Define uma ou mais referências externas que apontam para o mesmo conceito ou agente. Se definido, DEVE ser uma ou mais referências [`ExternalRef`](#externalref).

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `ExternalRef`

:::info

tipo `object` extende [`GenericBase`](/entities/generic#genericbase) usado em [`Equivalent`](#equivalent) e [`IdentifiedBy`](#identifiedby) mesmo que [ExternalRef](https://linked.art/api/1.0/shared/identifier/)

:::

**Descrição:** Utilizado para descrever uma referência externa. Extende a `GenericBase`, portanto possui todas as suas propriedades.

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `IdentifiedBy`

:::info

tipo anyOf<[`Name`](#name)|[`Identifier`](#identifier)> usado em [`Entidades`](/entities)

:::

**Descrição:** Define o nome ou identificador de uma entidade. Pode ser um [`Name`](#name) ou um [`Identifier`](#identifier).

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Identifier`

:::info

tipo `object` usado em [`IdentifiedBy`](#identifiedby) mesmo que [Identifier](https://linked.art/api/1.0/shared/identifier/)

:::

**Descrição:** Utilizado para descrever um identificador.

| name          | label             | type                          | public | requirement | extra             | map: linked-art  | map: crm                                                                            |
| ------------- | ----------------- | ----------------------------- | ------ | ----------- | ----------------- | ---------------- | ----------------------------------------------------------------------------------- |
| \_type        | Tipo              | [\_type](#_type)              | true   | REQUER      | const: Identifier | ld:type          | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| content       | Conteúdo          | string                        | true   | REQUER      |                   | ld:content       | [crm:P1_is_identified_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P1_is_identified_by) |
| classified_as | Classificado como | [ClassifiedAs](#classifiedas) | true   | OPCIONAL    |                   | ld:classified_as | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| assigned_by   | Assinado por      | [AssignedBy](#assigned)       | true   | OPCIONAL    |                   | ld:assigned_by   | [crm:P37_assigned](http://cidoc-crm.org/cidoc-crm/7.1.2/P37_assigned)               |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Name`

:::info

tipo `object` usado em [`IdentifiedBy`](#identifiedby) mesmo que [Name](https://linked.art/api/1.0/shared/name/)

:::

**Descrição:** Utilizado para descrever um nome.

| name          | label          | type             | public | requirement | extra      | map: linked-art  | map: crm                                                                            |
| ------------- | -------------- | ---------------- | ------ | ----------- | ---------- | ---------------- | ----------------------------------------------------------------------------------- |
| \_type        | Tipo           | [\_type](#_type) | true   | REQUER      | const:Name | ld:type          | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| content       | Conteúdo       | string           | true   | REQUER      |            | ld:content       | [crm:P1_is_identified_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P1_is_identified_by) |
| classified_as | Classificações | ClassifiedAs     | true   | OPCIONAL    |            | ld:classified_as | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| language      | Idioma         | string           | true   | OPCIONAL    |            | ld:language      | [crm:P72_has_language](https://cidoc-crm.org/html/cidoc_crm_v7.1.2.html#P2)         |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `InfluencedBy`

:::info

tipo `object` usado em [`Criation`](/entities/concept#criation)

:::

**Descrição:** Define uma ou mais influências que influenciaram a criação do conceito.

| name | label | type | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ----- | --------------- | -------- |
| name | label | type | true   | true        | extra | linked-art      | crm      |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `MemberOf`

:::info

tipo Array<[`AgentRef`](/entities/agent#agentref)|[`ConceptRef`](/entities/concept#conceptref) > usado em `Entidades`

:::

**Descrição:** Membro de algum ou alguns [`Agent`](/entities/agent) com a propriedade [`AgentType`](#agenttype) definida como Group ou Organization no contexto de uso do `Agent`. No contexto de uso do `Concept` será membro de algum ou alguns [`ConceptCollection`](/entities/concept#conceptcollection) representado por um `ConceptRef`, uma vez o `ConceptCollection` extende o objeto principal `Concept`, logo também é um `Concept`.

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `ReferredToBy`

:::info

tipo anyOf< [`Statement`](#statement) | [TextualObjectRef](/entities/textual-object#textualobjectref) > usado em `Entities`

:::

**Descrição:** Referenciado por algum ou alguns [`Statement`](#statement) ou [`TextualObject`](/entities/textual-object) representado por um [`TextualObjectRef`](/entities/textual-object#textualobjectref).

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Statement`

:::info

tipo `object` usado em `object`

:::

**Descrição:** Representa uma declaração de alguma entidade.

| name          | label             | type                                                                      | public | requirement | extra                  | map: linked-art  | map: crm                                                                            |
| ------------- | ----------------- | ------------------------------------------------------------------------- | ------ | ----------- | ---------------------- | ---------------- | ----------------------------------------------------------------------------------- |
| _type         | Tipo              | [\_type](#_type)                                                          | true   | REQUER      | const:LinguisticObject | ld:type          | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| classified_as | Classificado como | anyOf<[DescriptionsByTypeConcepts](/concepts#descriptionsbytypeconcepts)> | true   | REQUER      |                        | ld:classified_as | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| content       | Conteúdo          | string                                                                    | true   | REQUER      |                        | ld:content       | [crm:P1_is_identified_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P1_is_identified_by) |
| language      | Idioma            | anyOf<[LanguagesByTypeConcepts](/concepts#languagesbytypeconcepts)>       | true   | REQUER      |                        | ld:language      | [crm:P72_has_language](https://cidoc-crm.org/html/cidoc_crm_v7.1.2.html#P2)         |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Ref`

:::info

tipo `object` usado em `many`

:::

**Descrição:** Utilizado como classe genérica para ser extendida em outras Refs como [ConceptRef](/entities/concept#conceptref), [AgentRef](/entities/agent#agentref), etc.

| name    | label  | type                  | public | requirement | extra                           | map: linked-art | map: crm |
| ------- | ------ | --------------------- | ------ | ----------- | ------------------------------- | --------------- | -------- |
| \_id    | ID     | [ld:\_id](#_id)       | true   | REQUER      | DEVE ser URI                    | ld:id           |          |
| \_type  | Tipo   | [ld:\_type](#_type)   | true   | REQUER      | DEVE ser mesmo tipo que Concept | ldtype          |          |
| \_label | Rótulo | [ld:\_label](#_label) | true   | RECOMENDADO |                                 | ld:_label       |          |

:::caution Status

- [x] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Representation`

:::info

tipo `object` usado em `Entidades`

:::

**Descrição:** descrição

| name | label | type | public | requirement | extra | map: linked-art | map: crm |
| ---- | ----- | ---- | ------ | ----------- | ----- | --------------- | -------- |
| name | label | type | true   | true        | extra | linked-art      |          |

:::caution Status

- [ ] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `SubjectOf`

:::info

tipo anyOf<[`TextualObjectRef`](/entities/textual-object#textualobjectref) | [`VisualObjectRef`](/entities/visual-object#visualobjectref)> usado em `Entities`

:::

**Descrição:** Representa o assunto de uma entidade referenciada por TextualObjectRef ou ViusualObjectRef.

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Timespan`

:::info

tipo `object` usado em [`AttributedBy`](#attributedby)

:::

**Descrição:** Descreve intervalos de tempos, é RECOMENDÁVEL classificar o intervalo com algum [`Concept`](/entities/concept) criado com base na faceta [Estilos e Períodos](https://www.getty.edu/vow/AATHierarchy?find=period&logic=AND&note=&subjectid=300264088) do Getty AAT ou algum outro vocabulário com faceta temporal. Extende a [`GenericBase`](/entities/generic#genericbase), portanto possui todos suas propriedades e mais as propriedades a seguir:

| name               | label            | type                    | public | requirement  | extra           | map: linked-art       | map: crm                                                                                    |
| ------------------ | ---------------- | ----------------------- | ------ | ------------ | --------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| \_type             | Tipo             | [\_type](#_type)        | true   | REQUER       | const: Timespan | ld:type               | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                         |
| begin_of_the_begin | Inicio do início | date                    | true   | RECOMENDÁVEL | ISO8601         | ld:begin_of_the_begin | [crm:P82a_begin_of_the_begin](http://cidoc-crm.org/cidoc-crm/7.1.2/P82_at_some_time_within) |
| end_of_the_end     | Fim do fim       | date                    | true   | RECOMENDÁVEL | ISO8601         | ld:end_of_the_end     | [crm:P82b_end_of_the_end](http://cidoc-crm.org/cidoc-crm/7.1.2/P82_at_some_time_within)     |
| end_of_the_begin   | Fim do início    | date                    | true   | OPCIONAL     | ISO8601         | ld:end_of_the_begin   | [crm:P82_at_some_time_within](http://cidoc-crm.org/cidoc-crm/7.1.2/P82_at_some_time_within) |
| begin_of_the_end   | Começo do fim    | date                    | true   | OPCIONAL     | ISO8601         | ld:begin_of_the_end   | [crm:P82_at_some_time_within](http://cidoc-crm.org/cidoc-crm/7.1.2/P82_at_some_time_within) |
| duration           | Duração          | [Dimension](#dimension) | true   | OPCIONAL     |                 | ld:duration           | [crm:P4_has_time-span](http://cidoc-crm.org/cidoc-crm/7.1.2/P4_has_time-span)               |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

## Linked-Art

### `@context`

:::info

tipo `string|array` usado em [`Entities`](/entities)

:::

| name     | label    | type            | public | requirement | extra                                                                         | map: linked-art |
| -------- | -------- | --------------- | ------ | ----------- | ----------------------------------------------------------------------------- | --------------- |
| @context | Contexto | (string\|array) | true   | true        | Contexto dos vocabulários utilizados, string ou array de URIs de vocabulários | @context        |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `_id`

:::info

tipo `string` usado em `Entities`

:::

| name | label | type   | public | requirement | extra                    | map: linked-art |
| ---- | ----- | ------ | ------ | ----------- | ------------------------ | --------------- |
| \_id | ID    | string | true   | true        | ID DEVE ser HTTTP(s) URI | ld:id           |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `_type`

:::info

tipo `string` usado em `Entities`

:::

| name   | label | type   | public | requirement | extra | map: linked-art |
| ------ | ----- | ------ | ------ | ----------- | ----- | --------------- |
| \_type | Tipo  | string | true   | true        |       | ld:type         |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `_label`

:::info

tipo `string` usado em `many classes`

:::

| name    | label | type   | public | requirement | extra | map: linked-art |
| ------- | ----- | ------ | ------ | ----------- | ----- | --------------- |
| \_label | label | string | true   | true        |       | ld:_label       |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---
