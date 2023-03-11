# (MDORIM) Modelo de Dados para Organização e Representação da Informação Museológica

Baseado em [Linked-Art](https://linked.art/)

Precisa separar em dois tipos:

1. Para registro na DB
    > O registro na DB é feito através de referências pela ID de outras entidades ou taxonomias.
2. Para retorno na API
    > O retorno da API traz consigo todas as referências resolvidas em objetos completos (entidades ou taxonomias).

Menu

1. [Tabelas](./docs/tabelas.md)
2. [Entidades](./docs/api/entities.md)
3. [Taxonomias](./docs/api/taxonomies.md)
4. [Metadados](./docs/metadados.md)
5. [Glossário](./docs/glossario.md)

---

## A fazer

### Definições

- [ ] Tabelas
- [ ] Entidades
  - [ ] User
  - [x] Concept
  - [x] Agent
  - [ ] Object
  - [ ] Set
  - [ ] Event
  - [ ] VisualObject
  - [ ] TextualObject
  - [ ] DigitalObject
  - [ ] Places
- [ ] Taxonomias - ver se vamos precisar de fato usar as taxonomias do wp, uma vez que iremos definir nossas próprias tabelas para armazenar as entidades, podemos criar tabelas para armazenar as relações entre as entidades do MDORIM, ao invés de usar o padrão wp
- [ ] Metadados
- [ ] Fluxo SPECTRUM
  - [ ] 9 procedimentos principais
    - [ ] ObjectEntry
    - [ ] AquisitionAcessioning
    - [ ] MovementControl
    - [ ] Inventory
    - [ ] Cataloguing
    - [ ] ObjectExit
    - [ ] LoansIn
    - [ ] LoansOut
    - [ ] DocumentationPlanning
  - [ ] outros procedimentos?
    - [ ] conditional checking and technical assessment
    - [ ] collections care and conservation
    - [ ] insurance and indemnity
    - [ ] damage and losss
    - [ ] deacessioning and disposal
    - [ ] rights management
    - [ ] reproduction
    - [ ] collections review
    - [ ] audit

### Revisão

- [ ] Início
- [ ] Tabelas
- [ ] Entidades
- [ ] Fluxo SPECTRUM
- [ ] Glossário
