**Testes**

Os teste do design system seguem um padrão diferente dos demais pacotes, utilizamos uma biblioteca javascript chamada Storybook [@storybook2023] que nos permite criar um ambiente de desenvolvimento para construção de componentes de interface, em que podemos visualizar o componente em diferentes estados e interações, sem a necessidade de executar a aplicação como um todo.

Para cada componente criado no design-system, foi criado um `Story`, que é um arquivo javascript que contém a implementação do componente em diferentes estados e interações para ser executado em um ambiente Storybook. Esses arquivos estão localizados na pasta `stories` do design-system. Para executar o Storybook, basta executar o comando `pnpm storybook` na raiz do projeto.
