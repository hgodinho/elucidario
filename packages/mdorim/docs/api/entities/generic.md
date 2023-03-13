# Base genérica

[Início](../../../README.md) | [Glossário](../../glossario.md) | [< Entidades](../entities.md) | [Objeto >](./objeto.md)

---

## Menu <!-- omit in toc -->

- [Base genérica](#base-genérica)
  - [Descrição](#descrição)
  - [Metadados](#metadados)
    - [`GenericBase`](#genericbase)
    - [`EntityGenericBase`](#entitygenericbase)

---

## Descrição

Define uma base genérica para ser extendida pelas outras entidades, útil para definir propriedades iguais em entidades diferentes.

---

## Metadados

### `GenericBase`

[^topo](#base-genérica)

status:

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo
  
> tipo `object` usado em `Entities`

**Descrição:** Objeto genérico, define as propriedades comuns a todas as entidades e propriedades complexas.

| name           | label             | type                                              | public | requirement | extra                                                   | map: linked art | map: crm                                                                            |
| -------------- | ----------------- | ------------------------------------------------- | ------ | ----------- | ------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| _type          | Tipo              | [_type](./../../metadados.md#_type)               | true   | REQUER      | const: DEVE ser igual ao tipo que extende a GenericBase | _type           | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| _label         | Label             | [_label](./../../metadados.md#_label)             | true   | REQUER      | criado automaticamente baseado no campo identified_by   | _label          | [crm:P1_is_identified_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P1_is_identified_by) |
| identified_by  | Identificado como | [IdentifiedBy](./../../metadados.md#identifiedby) | true   | REQUER      |                                                         | identified_by   | [crm:P1_is_identified_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P1_is_identified_by) |
| classified_as  | Classificado como | [ClassifiedAs](./../../metadados.md#classifiedas) | true   | OPCIONAL    |                                                         | classified_as   | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                 |
| referred_to_by | Referenciado por  | [ReferredToBy](./../../metadados.md#referredtoby) | true   | OPCIONAL    |                                                         | referred_to_by  | [crm:P67_refers_to](http://cidoc-crm.org/cidoc-crm/7.1.2/P67_refers_to)             |

---

### `EntityGenericBase`

[^topo](#base-genérica)

status:

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

> tipo `object` usado em `Entities`

**Descrição:** Objeto genérico de uma entidade, define as propriedades comuns a todas as entidades principais. Extende a `GenericBase`, portanto possui todas suas propriedades e mais as definidas a seguir.

| name | label | type                            | public | requirement | extra                               | map: wp |
| ---- | ----- | ------------------------------- | ------ | ----------- | ----------------------------------- | ------- |
| ID   | ID    | [ID](./../../metadados.md#ID)   | true   | REQUER      | criado automaticamente pelo sistema | wp:ID   |
| URI  | URI   | [URI](./../../metadados.md#uri) | true   | REQUER      | criado automaticamente pelo sistema | wp:URI  |
