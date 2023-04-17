---
title: Metadata
description: Metadata
---

# Metadata

:::warning Em desenvolvimento

-   [ ] Criar endpoint para criação de usuários
-   [ ] Sei la mil coisas

:::

## Descrição

Metadados do modelo

## Classes

### `_id`

> tipo `integer`

**_Descrição:_** Identificador único do conceito. É um `integer` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link                                                     |
| ----------- | -------------------------------------------------------- |
| crm         | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art  | <http://linked.art/ns/terms/identifier>                  |
| schema.org  | <http://schema.org/identifier>                           |

### `_type`

> tipo `string`

**_Descrição:_** Tipo do conceito. É um `string` gerado automaticamente baseado no tipo da classe

#### Mapeamento

| Vocabulário | Link                                             |
| ----------- | ------------------------------------------------ |
| crm         | <http://www.cidoc-crm.org/cidoc-crm/P2_has_type> |
| linked.art  | <\_type>                                         |
| schema.org  | <http://schema.org/type>                         |

### `_uri`

> tipo `string`

**_Descrição:_** Identificador único do conceito. É um `string` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link                                                     |
| ----------- | -------------------------------------------------------- |
| crm         | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art  | <http://linked.art/ns/terms/identifier>                  |
| schema.org  | <http://schema.org/identifier>                           |

### `identified_by`

> tipo `array` anyOf<[`Name`](#name) | [`Identifier`](#identifier)>

**_Descrição:_** Define o nome ou identificador de uma entidade. Pode ser `Name` ou `Identifier`.

#### Mapeamento

| Vocabulário | Link                                                     |
| ----------- | -------------------------------------------------------- |
| crm         | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art  | <http://www.w3.org/2000/01/rdf-schema#label>             |
| schema.org  | <http://schema.org/name>                                 |

### `Identifier`

> tipo `object` com propriedades

**_Descrição:_** Identificador de uma entidade.

| Nome          | Tipo                                       | Descrição                                             | Obrigatório |
| ------------- | ------------------------------------------ | ----------------------------------------------------- | ----------- |
| classified_as | $ref([`ConceptRef`](./concept#conceptref)) |                                                       | Não         |
| type          | string                                     | Tipo do identificador. Valor constante: `Identifier`. | Sim         |
| value         | string                                     | Valor do identificador.                               | Sim         |

#### Mapeamento

| Vocabulário | Link                                                     |
| ----------- | -------------------------------------------------------- |
| crm         | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art  | <http://linked.art/ns/terms/identifier>                  |
| schema.org  | <http://schema.org/identifier>                           |

### `slug`

> tipo `string`

**_Descrição:_** Nome do conceito. É um `string` gerado automaticamente.

#### Mapeamento

| Vocabulário | Link                                                     |
| ----------- | -------------------------------------------------------- |
| crm         | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |
| linked.art  | <http://www.w3.org/2000/01/rdf-schema#label>             |
| schema.org  | <http://schema.org/name>                                 |

[Voltar para o topo](#)

---
