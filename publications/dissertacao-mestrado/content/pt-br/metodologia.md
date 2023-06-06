# 4. Procedimentos metodológicos

Como o objetivo da pesquisa é o desenvolvimento do aplicativo Elucidário.art e a realização de seus testes, iremos utilizar diferentes métodos para obtenção dos resultados:

-   Revisão bibliográfica

    Para a revisão bibliográfica utilizaremos livros, artigos, teses, dissertações, legislações, manuais, normas e padrões, nos temas de documentação museológica; interoperabilidade da informação; representação, visualização e recuperação da informação e desenvolvimento de aplicativos, para delimitar o tema da pesquisa e embasar o desenvolvimento do aplicativo Elucidário.art.

    Buscaremos referências nas áreas de Ciência da Informação - Organização do Conhecimento, Museologia - Documentação e Catalogação, Ciência da Computação - Banco de Dados, Sistemas de Informação e Desenvolvimento de Aplicativos, para delimitar os conceitos da pesquisa.

    Realizaremos uma análise detalhada de padrões de metadados para objetos de arte como o Esquema de Metadados para Descrição de Obras de Arte em Museus Brasileiros [@silva2020], Object ID [@conselho-internacional-de-museus-icom1999] e Linked Art [[@linked-art2021.1], para identificar os elementos de metadados que serão utilizados no aplicativo Elucidário.art. Utilizaremos também como base os procedimentos do Spectrum [@collections-trust2022.1] para definir os fluxos de trabalho do aplicativo.

-   Desenvolvimento do aplicativo Elucidário.art

    O desenvolvimento de um software é uma tarefa extremamente complexa, é necessário dar conta de diferentes níveis de abstração, desde a concepção do produto até a sua implementação. A grande maioria das metodologias de desenvolvimento são pensadas para equipes com diferentes papéis e responsabilidades dentro do sistema, como desenvolvedores, analistas de negócio, gerentes de projeto, etc. Nas metodologias ágeis, em que na verdade não existem processos ou metodologias Ágeis e sim equipes Ágeis, o que é descrito como Ágil seria o ambiente para uma equipe aprender a ser Ágil [@wells2009]. O que torna essas metodologias inviáveis para um desenvolvedor que trabalha sozinho.

    Por exemplo, a metodologia Ágil Scrum (1990), que estipula uma reunião no início de cada "Sprint" (ciclo de desenvolvimento que pode durar de 1 a 4 semanas) para definição da História de Usuário (Caso de Uso) que será trabalhada durante o ciclo, e também prevê reuniões diárias para acompanhamento do projeto [@schwaber2020].

    Uma outra metodologia Ágil bastante utilizada é a Extreme Programming (XP) (1996) [@wells1999], que tem como objetivo satisfazer o cliente e entregar software de valor a ele o mais rápido possível. Para isso, a XP utiliza práticas como: programação em pares, desenvolvimento orientado a testes, integração contínua, refatoração, entrega contínua, e diversas outras regras e condutas de desenvolvimento [@extreme-programming-roadpmap2006]. O problema da XP para um desenvolvedor que trabalha sozinho é que ela prevê que o desenvolvimento seja feito em pares, o que não é possível, mas as outras etapas e práticas podem ser utilizadas. Na verdade, na Wiki da XP possui inclusive uma página para demonstrar casos de uso da XP para desenvolvedores que trabalham sozinhos [@wiki-extreme-programming2014], as práticas que podem ser utilizadas são:

    -   _Engineering Task_ ou Tarefa de Engenharia, que é uma tarefa que deve ser realizada para que o sistema funcione corretamente;
    -   _User Stories_ ou Caso de Uso, que são descrições de uma parte do sistema que o usuário interage para resolver determinado problema, cada _User Stories_ é dividido em diferentes _Engineering Tasks_;
    -   _Iteration Plan_ ou Plano de Iteração, que é um plano de curto prazo que descreve o que será feito durante a iteração, lista todas as _User Stories_ que serão implementadas;
    -   _Release Plan_ ou Plano de Entrega, que é um plano de médio prazo que descreve quando as funcionalidades serão entregues e lista os _Iteration Plans_ que serão implementados;

    Também podemos utilizar as práticas recomendadas do XP:

    -   _Refactor Mercilessly_ ou Refatore sem piedade, que é a prática de refatorar o código sempre que possível, para que ele fique mais simples e fácil de entender, esta prática tem como intuito evitar a criação de código duplicado, ou _Once and Only Once_, outra prática do XP;
    -   _Relentless Testing_ ou Teste implacavelmente, que é a prática de escrever testes automatizados para todas as funcionalidades do sistema, para que seja possível realizar testes de regressão, ou seja, testar se as funcionalidades que já funcionavam continuam funcionando após a implementação de novas funcionalidades, uma forma de garantir isto é: "the feature doesn't actually exist until there are tests that prove it works" [@wiki-extreme-programming2009];
    -   _Continuous Integration_ ou Integração Contínua, que é a prática de integrar o código ao repositório de código principal o mais rápido possível, para que seja possível realizar testes de integração e testes de regressão automatizados;

    Nesta pesquisa buscaremos estabelecer as seguintes etapas de desenvolvimento:

    -   _Release plan_: um conjunto de funcionalidades que serão implementadas em um determinado período de tempo desenhadas baseadas nas _User Stories_;
    -   _Iteration plan_: um conjunto de tarefas que serão realizadas em um determinado período de tempo desenhadas baseadas nas _User Stories_;
    -   _Users Stories_: utilizaremos os procedimentos Spectrum para delimitar os Casos de Usos, como entrada de objetos, saída e entrada para empréstimos, controle de localização e entre outros, que serão implementados no aplicativo;
    -   _Engineering Tasks_: tarefas de engenharia que serão realizadas para implementar as _User Stories_, como por exemplo, a criação de um banco de dados, a criação de uma interface de usuário, a criação das páginas administrativas, a criação do modelo de dados, etc;

-   Testes do aplicativo Elucidário.art

    Os testes do aplicativo podem ser divididos em diferentes tipos:

    -   **Testes unitários**: testes que verificam se uma unidade de código funciona corretamente, por exemplo, se uma função retorna o valor esperado;
    -   **Testes de integração**: testes que verificam se as diferentes unidades de código funcionam corretamente quando integradas, por exemplo, se uma função que utiliza outra função funciona corretamente;
    -   **Testes de sistema**: testes que verificam se o sistema funciona corretamente, por exemplo, se o sistema consegue realizar as tarefas que foram definidas nas _User Stories_;
        -   **Testes de aceitação**: testes que verificam se o sistema funciona corretamente para o usuário, por exemplo, se o sistema consegue realizar as tarefas que foram definidas nas _User Stories_ para o usuário;
        -   **Testes de regressão**: testes que verificam se as funcionalidades que já funcionavam continuam funcionando após a implementação de novas funcionalidades, por exemplo, se uma funcionalidade que já funcionava continua funcionando após a implementação de uma nova funcionalidade;
        -   **Testes de usabilidade**: testes que verificam se o sistema é fácil de usar, por exemplo, se o usuário consegue realizar as tarefas que foram definidas nas _User Stories_ de forma fácil;

-   Testes unitários e Testes de integração

    Como o aplicativo é desenvolvido em diferentes linguagens de programação, PHP, TypeScript, Json, e utiliza frameworks, bibliotecas e ferramentas como WordPress, React, React-hook-form, Radix-UI, AJV Schema, entre outras, este testes serão realizados utilizando as ferramentas para teste de cada linguagem, framework, biblioteca e ferramenta. Por exemplo, os testes unitários do PHP serão realizados utilizando PHPUnit, os testes unitários do TypeScript serão realizados utilizando Jest, os testes unitários do Json serão realizados utilizando AJV Schema, e assim por diante.

-   Testes de sistema

    Os testes de sistema serão realizados utilizando o Cypress, que é uma ferramenta de teste de sistema que permite realizar testes de aceitação, testes de regressão e testes de usabilidade. O Cypress permite realizar testes de sistema em diferentes navegadores, como Chrome, Firefox, Edge, Safari, Electron, entre outros, e também permite realizar testes de sistema em diferentes dispositivos, como computadores, tablets e celulares.
