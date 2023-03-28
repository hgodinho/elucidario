# Concept

## Descrição

:::caution Status da página

- [x] em definição

:::

Utilizado para descrever conceitos como tipos, materiais, linguagens, medidas, entre outros tipos de conceitos. Funciona como um vocabulário controlado. É amplamente baseado no endpoint Concept do Linked Art.

Os Conceitos podem ser definidos como termos únicos ou como agrupamentos ou coleções de termos que compartilham algo em comum, em estruturas de tesauros esses agrupamentos são os termos definidos entre sinais de maior e menor, por exemplo: [`<nomes e conceitos relacionados>`](https://www.getty.edu/vow/AATFullDisplay?find=name&logic=AND&note=&subjectid=300404653) no Getty AAT.

Por padrão o MDORIM vem com [alguns conceitos pré-definidos](../concepts) baseados inteiramente em ontologias como FOAF e vocabulários do Getty. Os conceitos pré-definidos seguem o mesmo modelo do Concept e são criados automaticamente na instalação do Elucidário.art. Esses conceitos são utilizados para facilitar a integração do modelo com a interface de usuário, servindo também como exemplo de como definir novos conceitos no app.

## Classes

### `ConceptRef`

:::info

tipo [`Ref`](../metadata#ref) usado em `many`

:::

**Descrição:** Utilizado como conceito embutido em outras entidades.

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Concept`

:::info

tipo `object` extende [`EntityGenericBase`](generic#entitygenericbase) usado em `All`

:::

**Descrição:** Objeto completo de um conceito, retornado quando chamado explicitamente. Este objeto extende a `GenericBase`, portanto possui todas suas propriedades e mais as descritas a seguir.

| name           | label                 | type                                         | public | requirement | extra         | map: linked art | map: crm                                                                             |
| -------------- | --------------------- | -------------------------------------------- | ------ | ----------- | ------------- | --------------- | ------------------------------------------------------------------------------------ |
| _type          | Tipo                  | [_type](../metadata#_type)                   | true   | REQUER      | const:Concept | Concept         | [crm:E55 Type](http://cidoc-crm.org/cidoc-crm/7.1.2/E55_Type)                        |
| equivalent     | Equivalente           | [Equivalent](../metadata#equivalent)         | true   | OPCIONAL    |               | equivalent      | [crm:P2 has type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                  |
| representation | Representação         | [Representation](../metadata#representation) | true   | OPCIONAL    |               | representation  | [crm:p138i_has_representation](http://cidoc-crm.org/cidoc-crm/7.1.2/P138_represents) |
| member_of      | Coleções              | [MemberOf](../metadata#memberof)             | true   | OPCIONAL    |               | member_of       | [crm:P46i_forms_part_of](http://cidoc-crm.org/cidoc-crm/7.1.2/P46i_forms_part_of)    |
| subject_of     | Referenciado por      | [SubjectOf](../metadata#subjectof)           | true   | OPCIONAL    |               | subject_of      | [crm:P2_has_type](http://cidoc-crm.org/cidoc-crm/7.1.2/P2_has_type)                  |
| attributed_by  | Atribuído por         | [AttributedBy](../metadata#attributedby)     | true   | OPCIONAL    |               | attributed_by   | [crm:P14_carried_out_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P14_carried_out_by)    |
| broader        | Conceitos mais amplos | [Broader](../metadata#broader)               | true   | OPCIONAL    |               | broader         | [crm:P129_is_about](http://cidoc-crm.org/cidoc-crm/7.1.2/P129_is_about)              |
| created_by     | Criação               | [Criation](#criation)                        | true   | OPCIONAL    |               | created_by      | [crm:P14_carried_out_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P14_carried_out_by)    |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `ConceptCollection`

:::info

tipo `object` usado em `All`

:::

**Descrição:** Extende o [`Concept`](#concept), portanto possui todas suas propriedades e mais as descritas a seguir.

| name    | label   | type                         | public | requirement  | extra                                                                       | map: linked art | map: crm                                                                            |
| ------- | ------- | ---------------------------- | ------ | ------------ | --------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------- |
| _type   | Tipo    | [_type](../metadata#_type)   | true   | REQUER       | const:ConceptCollection                                                     | Concept         | [crm:E55 Type](http://cidoc-crm.org/cidoc-crm/7.1.2/E55_Type)                       |
| _label  | Label   | [_label](../metadata#_label) | true   | REQUER       | criado automaticamente baseado no campo identified_by e colocado entre `<>` | _label          | [crm:P1_is_identified_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P1_is_identified_by) |
| members | Membros | [ConceptRef[]](#conceptref)  | true   | RECOMENDÁVEL |                                                                             | members         | [crm:P46i_forms_part_of](http://cidoc-crm.org/cidoc-crm/7.1.2/P46i_forms_part_of)   |

:::caution Status

- [x] definido
- [x] revisado
- [ ] testado
- [ ] exemplo

:::

---

### `Criation`

:::info

tipo `object` extende [`GeneriBase`](generic#genericbase) usado em [`Concept`](#concept)

:::

**Descrição:** Objeto que descreve a criação do conceito, e não da criação do conceito na base de dados. Isso significa que esta classe serve descrever quando e como o conceito foi criado. Extende a `GenericBase`, portanto possui todas suas propriedades e mais as descritas a seguir.

| name          | label              | type                             | public | requirement | extra | map: linked-art | map: crm                                                                           |
| ------------- | ------------------ | -------------------------------- | ------ | ----------- | ----- | --------------- | ---------------------------------------------------------------------------------- |
| timespan      | Intervalo de tempo | [Timespan](../metadata#timespan) | true   | OPCIONAL    |       | timespan        | [crm:P4 has time-span](http://cidoc-crm.org/cidoc-crm/7.1.2/P4_has_time-span)      |
| influenced_by | Influenciado por   | InfluencedBy                     | true   | OPCIONAL    |       | influenced_by   | [crm:P14_carried_out_by](http://cidoc-crm.org/cidoc-crm/7.1.2/P14_carried_out_by)? |

:::caution Status

- [ ] definido
- [ ] revisado
- [ ] testado
- [ ] exemplo

:::

---
