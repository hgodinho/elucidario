# 2. Procedimentos metodológicos

Esta é uma pesquisa aplicada mista e exploratória, que utiliza revisão bibliográfica e estudo de caso.

Como o objetivo da pesquisa é desenvolver o aplicativo Elucidário.art, utilizamos diferentes métodos para obtenção dos resultados:

**Revisão bibliográfica**

Utilizamos livros, artigos, teses, dissertações, legislações, manuais, normas e padrões, nos temas de documentação museológica; interoperabilidade da informação; representação, visualização e recuperação da informação e desenvolvimento de aplicativos, para delimitar o tema da pesquisa e embasar o desenvolvimento do aplicativo Elucidário.art. Buscamos em sites de organizações internacionais como International Council of Museums (ICOM), Collections Trusts, Canada Heritage Information Network (CHIN), entre outras e nacionais como Instituto Brasileiro de Museus (IBRAM), Sistema Estadual de Museus (SISEM-SP), Fundação Catarinense de Cultura (FCC), entre outras. Também buscamos em anais de conferências como International Committee for Documentaion (CIDOC) e Encontro Nacional de Pesquisa em Ciência da Informação (ENANCIB).

Realizamos uma análise detalhada de padrões de metadados para objetos de arte como o Esquema de Metadados para Descrição de Obras de Arte em Museus Brasileiros [@silva2020], Object ID [@conselho-internacional-de-museus-icom1999], Linked Art [@linked-art2021.1] e Grupos de Informações do Spectrum 5.1 [@collections-trust2017.1], para identificar os elementos de metadados que foram utilizados no aplicativo Elucidário.art. Utilizamos também como base os procedimentos do Spectrum [@collections-trust2022.1] para definir os fluxos de trabalho do aplicativo.

**Desenvolvimento do aplicativo Elucidário.art**

O desenvolvimento de um software é uma tarefa extremamente complexa. É necessário dar conta de diferentes níveis de abstração, desde a concepção do produto até a sua implementação. A grande maioria das metodologias de desenvolvimento são pensadas para equipes com diferentes papéis e responsabilidades dentro do sistema, como desenvolvedores, analistas de negócio, gerentes de projeto, etc. Nas metodologias ágeis, em que na verdade não existem processos ou metodologias Ágeis e sim equipes Ágeis, o que é descrito como Ágil seria o ambiente para uma equipe aprender a ser Ágil [@wells2009]. O que torna essas metodologias inviáveis para um desenvolvedor que trabalha sozinho.

Por exemplo, a metodologia Ágil Scrum (1990), que estipula uma reunião no início de cada "Sprint" (ciclo de desenvolvimento que pode durar de uma a quatro semanas) para definição da História de Usuário (Caso de Uso) que será trabalhada durante o ciclo, e também prevê reuniões diárias para acompanhamento do projeto [@schwaber2020].

Uma outra metodologia Ágil bastante utilizada é a Extreme Programming (XP) (1996) [@wells1999], que tem como objetivo satisfazer o cliente e entregar software de valor a ele o mais rápido possível. Para isso, a XP utiliza práticas como: programação em pares, desenvolvimento orientado a testes, integração contínua, refatoração, entrega contínua, e diversas outras regras e condutas de desenvolvimento [@extreme-programming-roadpmap2006]. O problema da XP para um desenvolvedor que trabalha sozinho é que ela prevê que o desenvolvimento seja feito em pares, o que não é possível, mas as outras etapas e práticas podem ser utilizadas. Na verdade, na Wiki da XP possui inclusive uma página para demonstrar casos de uso da XP para desenvolvedores que trabalham sozinhos [@wiki-extreme-programming2014]. Portanto utilizamos a metodologia ágil XP e suas práticas recomendadas para o desenvolvimento do aplicativo Elucidário.art:

- _User Stories_ ou Caso de Uso, que são descrições de uma parte do sistema que o usuário interage para resolver determinado problema, cada _User Stories_ é dividido em diferentes _Engineering Tasks_;
- _Engineering Task_ ou Tarefa de Engenharia, que é uma tarefa que deve ser realizada para que o sistema funcione corretamente;
- _Iteration Plan_ ou Plano de Iteração, que é um plano de curto prazo que descreve o que será feito durante a iteração, lista todas as _User Stories_ que serão implementadas;
- _Release Plan_ ou Plano de Entrega, que é um plano de médio prazo que descreve quando as funcionalidades serão entregues e lista os _Iteration Plans_ que serão implementados;
- _Refactor Mercilessly_ ou Refatore sem piedade, que é a prática de refatorar o código sempre que possível, para que ele fique mais simples e fácil de entender, esta prática tem como intuito evitar a criação de código duplicado, ou _Once and Only Once_, outra prática do XP;
- _Relentless Testing_ ou Teste implacavelmente, que é a prática de escrever testes automatizados para todas as funcionalidades do sistema, para que seja possível realizar testes de regressão, ou seja, testar se as funcionalidades que já funcionavam continuam funcionando após a implementação de novas funcionalidades, uma forma de garantir isto é: "the feature doesn't actually exist until there are tests that prove it works" [@wiki-extreme-programming2009];
- _Continuous Integration_ ou Integração Contínua, que é a prática de integrar o código ao repositório de código principal o mais rápido possível, para que seja possível realizar testes de integração e testes de regressão automatizados;

**Design do aplicativo Elucidário.art**

Além da XP, que é uma metodologia que foi aplicada no desenvolvimento de todos os pacotes do Elucidário.art, também utilizamos a metodologia criada por Brad Frost em 2013 chamada _Atomic Design_ [@frost2013], que consiste em dividir a Interface de Usuário (UI) em componentes menores e mais simples, chamados de átomos, que são combinados para formar moléculas, organismos, templates e páginas. A figura a seguir representa a metodologia _Atomic Design_:

**{{count:figure;legend=Metodologia Atomic Design.}}**

![**Fonte:** Metodologia _Atomic Design_ (FROST, 2013).]({{static}}/atomic-design-process.png)

Os átomos consistem nas menores unidades de design, como cores, fontes, ícones, botões, campos de formulário, etc. As moléculas são combinações de átomos, como um campo de formulário com um botão. Os organismos são combinações de moléculas, como um formulário de login. Os templates são combinações de organismos, como um template de página de edição. E as páginas são combinações de templates, como a página de configurações do plugin. Descrevemos no capítulo 7 como utilizamos a metodologia _Atomic Design_ para desenvolver o pacote `@elucidario/pkg-design-system` e como utilizamos o pacote para desenvolver a UI do plugin.

<!-- Nesta pesquisa estabelecemos as seguintes etapas de desenvolvimento:

-  _Plano de entrega_: um conjunto de funcionalidades que serão implementadas em um determinado período de tempo desenhadas baseadas nas _User Stories_;
-  _Plano de iteração_: um conjunto de tarefas que serão realizadas em um determinado período de tempo desenhadas baseadas nas _User Stories_;
-  _Caso de uso_: utilizaremos os procedimentos Spectrum para delimitar os Casos de Usos, como entrada de objetos, saída e entrada para empréstimos, controle de localização e entre outros, que serão implementados no aplicativo;
-  _Tarefa de engenharia_: tarefas que serão realizadas para implementar as _User Stories_, como por exemplo, a criação de um banco de dados, a criação de uma interface de usuário, a criação das páginas administrativas, a criação do modelo de dados, etc; -->

**Testes do aplicativo Elucidário.art**

Os testes do aplicativo podem ser divididos em diferentes tipos:

-  **Testes unitários, integração e regressão**: testes que verificam se uma unidade de código funciona corretamente, por exemplo, se uma função retorna o valor esperado e se funcionam corretamente quando integradas e se continuam funcionando após a implementação de novas funcionalidades.

    Como o aplicativo foi desenvolvido em diferentes linguagens de programação e utiliza frameworks, bibliotecas e ferramentas como WordPress, React, Radix-UI, entre outras, os testes foram realizados utilizando as ferramentas para teste de cada linguagem, framework ou biblioteca. Por exemplo, os testes unitários do PHP foram realizados utilizando Pest já os testes unitários do TypeScript/Javascript foram realizados utilizando Jest.

-  **Testes de sistema**: testes que verificam se o sistema funciona corretamente, por exemplo, se o sistema consegue realizar as tarefas que foram definidas nas _User Stories_:

    Os testes de sistema foram realizados utilizando o Storybook [@storybook2023] que é uma ferramenta que permite criar uma documentação interativa dos componentes do sistema, e o Cypress [@cypress2017], que é uma ferramenta que permite realizar testes de sistema em diferentes navegadores, como Chrome, Firefox, Edge, Safari, Electron, entre outros. Além dos ambientes de desenvolvimento, teste e _staging_ criados para testes manuais do aplicativo em suas diferentes etapas de desenvolvimento.
