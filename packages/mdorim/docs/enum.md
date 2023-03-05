# Enum

[Início](../README.md) | [Glossário](./glossario.md) | [< Taxonomias](./api/taxonomies.md)

---

- [Enum](#enum)
  - [`AgentType`](#agenttype)

---

## `AgentType`

> tipo `enum` usado em [`Agente`](./api/entities/agent.md)

**Descrição:** description

| name         | label        | map: linked-art                                          | map: foaf                                                         | map: crm                                                           | map: aat                                                                                                 |
| ------------ | ------------ | -------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| agent        | Agente       |                                                          | [foaf:Agent](http://xmlns.com/foaf/0.1/#term_Agent)               | [E39 Actor](http://cidoc-crm.org/cidoc-crm/7.1.1/E39_Actor)        | [Agents](https://www.getty.edu/vow/AATFullDisplay?find=person&logic=AND&note=&subjectid=300379422)       |
| person       | Pessoa       | [Person](https://linked.art/api/1.0/schema_docs/person/) | [foaf:Person](http://xmlns.com/foaf/0.1/#term_Person)             | [E21 Person](https://cidoc-crm.org/html/cidoc_crm_v7.1.1.html#E21) | [People](https://www.getty.edu/vow/AATFullDisplay?find=person&logic=AND&note=&subjectid=300024978)       |
| group        | Grupo        | [Group](https://linked.art/api/1.0/schema_docs/group/)   | [foaf:Group](http://xmlns.com/foaf/0.1/#term_Group)               | [E74 Group](http://cidoc-crm.org/cidoc-crm/7.1.1/E74_Group)        | [Agents](https://www.getty.edu/vow/AATFullDisplay?find=person&logic=AND&note=&subjectid=300379422)       |
| organization | Organization | [Group](https://linked.art/api/1.0/schema_docs/group/)   | [foaf:Organization](http://xmlns.com/foaf/0.1/#term_Organization) | [E39 Actor](http://cidoc-crm.org/cidoc-crm/7.1.1/E39_Actor)        | [Organization](https://www.getty.edu/vow/AATFullDisplay?find=person&logic=AND&note=&subjectid=300234770) |

---
