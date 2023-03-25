---
title: "Metadata"
description: Definições de metadados utilizados no MDORIM.
---

# Metadados

Definições de metadados utilizados no MDORIM.

## Definições

### ID

> Tipo de dado: integer 

Identificador único do conceito. É um `integer` gesrado automaticamente.


#### Mapeamento

| Vocabulário | Link |
| ----- | --------- |
| schema.org | <http://schema.org/identifier> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

### URI

> Tipo de dado: string 

Identificador único do conceito. É um `string` gerado automaticamente.


#### Mapeamento

| Vocabulário | Link |
| ----- | --------- |
| schema.org | <http://schema.org/identifier> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

### type

> Tipo de dado: string 

Tipo do conceito. É um `string` gerado automaticamente baseado no tipo da classe


#### Mapeamento

| Vocabulário | Link |
| ----- | --------- |
| schema.org | <http://schema.org/type> |
| linked.art | <_type> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P2_has_type> |

### slug

> Tipo de dado: string 

Nome do conceito. É um `string` gerado automaticamente.


#### Mapeamento

| Vocabulário | Link |
| ----- | --------- |
| schema.org | <http://schema.org/name> |
| linked.art | <http://www.w3.org/2000/01/rdf-schema#label> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |

### identified_by

> Tipo de dado: array 

Define o nome ou identificador de uma entidade. Pode ser `Name` ou `Identifier`.



### Identifier

> Tipo de dado: object 

Identificador de uma entidade.


#### Mapeamento

| Vocabulário | Link |
| ----- | --------- |
| schema.org | <http://schema.org/identifier> |
| linked.art | <http://linked.art/ns/terms/identifier> |
| crm | <http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by> |