# Introdução

Gostaria de agradecer a todos que estão aqui presentes, e a todos que me ajudaram a chegar até aqui, em especial a professora Vânia pela orientação e paciência, e aos integrantes da banca pela disponibilidade e atenção, professores Fábio e Zaira, muito obrigado mais uma vez por estarem aqui, agora na conclusão deste trabalho.

O Elucidário.art é um projeto que nasceu em 2018, no trabalho de conclusão de curso da Pós-graduação em Comunicação e Design Digital na ESPM, em que foi apresentado uma dissertação e um protótipo de alta-fidelidade de um site para abrigar e divulgar a Coleção Ema Klabin. Em 2019 o site passou a ser efetivamente desenvolvido, e o seu lançamento ocorreu em outubro deste mesmo ano. Em 2021, com o ingresso no mestrado profissional, o Elucidário.art volta a ser objeto de pesquisa e desenvolvimento, e é sobre isto que iremos falar hoje, ainda em 2021 tive a oportunidade de apresentar o Elucidário no VII Seminário RITe (Representações: Imaginário e Tecnologia). Em 2022, conseguimos levar o Elucidário.art para o XXII Enancib em Porto Alegre e no II ABM - Encontro Internacional de Arquivos Bibliotecas e Museus em Porto, Portugal. Já neste ano, apresentamos o Elucidário.art no CIDOC 2023 realizado na Cidade do México.

Nosso objetivo com o Elucidário.art é desenvolver um sistema de gerenciamento de coleções de arte, de código aberto, para gestão de documentação museológica com foco em museus mistos, que atenda a especificações internacionais de interoperabilidade da informação e possibilite a representação, visualização e recuperação destas informações.

Mas afinal, o que é o Elucidário.art?
O Elucidário é um CMS (Collection Management System)

O Elucidário consiste em um plugin para WordPress que define um conjunto de funcionalidades para gerenciamento de coleções de arte. O Elucidário.art é um software livre, disponível no repositório do GitHub, e pode ser utilizado por qualquer instituição que deseje gerenciar e publicar sua coleção de arte na web.

Quando falamos de um Collection Management System (CMS), estamos falando de um sistema complexo que envolve diversas áreas de conhecimento, estamos falando de informação, museu, coleção, gestão, representação, documentação, preservação, interoperabilidade, softwares, tecnologias, e muito mais. Portanto, para abordar um assunto complexo, precisamos desmembrar a metodologia em partes menores.

A primeira delas é a revisão bibliográfica, em que realizamos a análise de livros, artigos, teses, dissertações, legislações, normas, e outros documentos que nos ajudaram a entender o contexto em que estamos inseridos, nos temas de documentação museológica, interoperabilidade, representação, visualização e recuperação da informação e desenvolvimento de softwares.

As próximas partes são referentes ao desenvolvimento, utilizamos a metodologia chamada Extreme Programming, de Don Wells, que consiste em um conjunto de práticas que visam a melhoria contínua do processo de desenvolvimento de software, e que se baseia em práticas e principios como desenvolvimento orientado a testes, integração contínua, refatoração, entrega contínua, entre outros. Mas aqui nós temos um porém, em que esta metodologia foi originalmente pensada para EQUIPES de desenvolvimento, e conta com a programação em pares como uma de suas práticas, e como eu estou sozinho neste projeto, foi necessário a adaptação da metodologia para este contexto.

Para o design do Elucidário.art, utilizamos a metodologia Atomic Design de Brad Frost (2013), que consiste na criação de componentes de interface de forma hierárquica, e se baseia nos princípios da química, em que os átomos são os menores elementos, que se combinam para formar moléculas, e que por sua vez se combinam para formar organismos, e assim sucessivamente, até a criação de páginas completas. Esta metodologia é muito utilizada no desenvolvimento de interfaces para web, e é muito útil para a criação de sistemas complexos como o Elucidário.art.

E, por fim, os testes. Que são uma parte muito importante do desenvolvimento de software, e que muitas vezes é negligenciada. Os testes são importantes para garantir que o software está funcionando corretamente, e que as novas funcionalidades não quebraram as funcionalidades já existentes. Para os testes, utilizamos a metodologia de desenvolvimento orientado a testes, ou TDD, que consiste em escrever os testes antes de escrever o código, e que se baseia em ciclos de desenvolvimento de testes, e refatoração do código.

# Desenvolvimento

Para o desenvolvimento do Elucidário.art, utilizamos uma arquitetura de repositórios de código chamada de Monorepo, que consiste em um único repositório que contém diversos projetos, pacotes, bibliotecas, e outros códigos que se relacionam entre si. Essa arquitetura estimula a reutilização de código, e facilita a manutenção e o desenvolvimento de novas funcionalidades, bem como a evolução e distribuição independente de cada um dos projetos.

Os principais pacotes que forma o Elucidário são: core, design-system e mdorim. Vamos falar um pouco sobre cada um deles.

## Mdorim

O Mdorim, ou Modelo de Dados para Organização e Representação da Informação Museológica, consiste no modelo de dados que utilizamos para representar as informações utilizadas pelo aplicativo. O Mdorim utiliza o Linked Art para definição de suas classes principais, e se baseia nos procedimentos Spectrum para definição de seus fluxos de trabalho. Ele foi desenvolvido com json-schema, typescript e php.

Em cinza vemos as entidades principais do modelo que foram importadas do Linked Art; na cor vinho e com formato circular vemos os procedimentos que também tem sua rota no modelo; em preto vemos a entidade `Option` e suas possibilidades de uso; em vermelho os tipos de usuários; em roxo a entidade `History` e, por fim, em marrom o mapeamentos e suas propriedades.

DEMONSTRAR O MDORIM
mdorim/static/schemas/mdorim/*.json

DEMONSTRAR TESTES
jest + php
+ execução dos testes

## Design System

O Design System é um conjunto de componentes de interface que podem ser utilizados para a criação de interfaces de forma consistente. O Design System do Elucidário.art foi desenvolvido com React, Typescript e Tailwind, e é utilizado no painel administrativo.

DEMONSTRAR O DESIGN SYSTEM
design-system/lib/*.(tsx|ts)

DEMONSTRAR STORYBOOK

## Core

O Core é o pacote principal do Elucidário.art, e é responsável por definir as funcionalidades principais do sistema, e é responsável pela integrar os demais pacotes. O Core é desenvolvido com PHP e Typescript, sendo o responsável por definir as rotas e os endpoints da REST-API, e as principais funcionalidades do sistema.

DEMONSTRAR CORE
core/src/

DEMONSTRAR TESTES

DEMONSTRAR REST
core/tests/http

Routes: 

- https://locahost:8888/wp-json/lcdr/v1/
Mostra todas as rotas registradas, utilizada para descobrir as rotas que o Elucidário.art registra.

- https://locahost:8888/wp-json/lcdr/v1/concepts
- https://locahost:8888/wp-json/lcdr/v1/concepts/1
Mostra todos os conceitos registrados no Elucidário.art, e um conceito específico.

## Conclusão

o Elucidário.art é um CMS desenvolvido para a gestão e publicação da informação museológica mantida por instituições culturais. O sistema foi desenvolvido com o objetivo de ser uma ferramenta de código aberto, que possa ser utilizada por qualquer instituição cultural de pequeno a médio porte, e foi desenvolvido utilizando tecnologias web modernas, como o React, REST-API, JSON-LD, entre outras. Projetamos o plugin para ser extensível, permitindo que novas funcionalidades sejam adicionadas de forma simples e rápida. O Elucidário.art pode ser instalado em qualquer instância do WordPress, seja ela local ou em um servidor web.

Para que o Elucidário.art possa ser distribuído e usado por outras instituições, ainda devem ser realizados novos ciclos de desenvolvimento, testes e validações, processos previstos na metodologia _Extreme Programming_ utilizada no desenvolvimento, os quais serão realizados em breve.
