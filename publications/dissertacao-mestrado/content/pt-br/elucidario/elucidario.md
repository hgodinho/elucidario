# 9. Elucidario.art

Em linhas gerais o Elucidário.art é um _Collection Management System_. A abreviação CMS é majoritariamente conhecida com um outro significado: _Content Management System_, devido a popularidade de plataformas como WordPress, Joomla, Drupal, etc. O Elucidário.art é um CMS para coleções de arte, ou seja, é um sistema de gerenciamento de coleções de arte, ou um _Content Management System_ especializado. Portanto utilizaremos a abreviação CMS para nos referirmos ao Elucidário como um _Collection Management System_. Este termo também é utilizado por instituições como _Collections Trust_ e ICOM para referir-se a esta modalidade de software.

Em suma, o Elucidário.art consiste em um plugin para WordPress que define um conjunto de funcionalidades para gerenciamento de coleções de arte. O plugin utiliza o modelo de dados para aplicações Linked Art para definição das classes principais de conteúdo e se baseia nos procedimentos Spectrum para definição de seus fluxos de trabalho.

Para o entendimento das seções a seguir, é importante primeiro definirmos alguns conceitos:

**Administrador** é o usuário que gerencia o sistema. É o usuário que acessa o endereço '<https://exemplo.com/wp-admin>' ou qualquer outra URI de gerenciamento do sistema.

**_Application Programming Interface_ (API)** é um conjunto de rotinas e padrões de programação para acesso a um aplicativo, software ou plataforma baseada na Web de forma programática.

**_Back-end_** é a parte do sistema que não é visível para o usuário. É a parte do sistema que gerencia os dados e a lógica de negócio.

**Bloco Gutemberg** é uma funcionalidade do WordPress que facilita a reutilização de componentes de interface de usuário. Os blocos Gutemberg são utilizados para construir páginas e postagens no WordPress, e utilizam a biblioteca React [@meta-open-source2023] para construção das interfaces.

**Componente React** é um componente de interface de usuário desenvolvido utilizando a biblioteca React [@meta-open-source2023]. Os componentes são utilizados como blocos de construção no desenvolvimento de interfaces de usuário.

**_Front-end_ ou _User Interface_ (UI)** é a parte do sistema que é visível e possibilita a interação com o usuário.

**_Headless_** é utilizado para referir-se a sistemas que não possuem uma interface de usuário final. Um sistema _headless_ pode ser acessado apenas por um administrador, ou pode ser acessado por um usuário final através de uma aplicação separada.

**Pacotes** no contexto de desenvolvimento de software pacote é um termo utilizado para definir um conjunto de arquivos e diretórios que contém código-fonte, configurações, testes, etc. Um pacote pode ser um plugin, um tema, uma biblioteca, um módulo, etc. No nosso contexto, os pacotes são majoritariamente definidos como pacotes NPM, que são pacotes JavaScript que podem ser utilizados em diferentes ambientes, como no navegador, no Node.js, no React Native, etc, neste contexto, os pacotes seguem estruturas de pastas com um arquivo "package.json" que define as configurações do pacote.

**_Representational State Transfer_ API (REST-API)** é um conjunto de padrões de comunicação hipermídia entre sistemas que utiliza o protocolo HTTP para realizar requisições e respostas.

**Usuário final** é o usuário que interage com o sistema. É o usuário que acessa o endereço '<https://exemplo.com>'.

## 9.1. O Repositório

As principais linguagens de programação utilizadas no código-fonte do Elucidário.art são PHP 8.2 [@php2022], TypeScript [@microsoft2023], JavaScript [@mdn2022] e JSON [@ietf2017], e estão estruturadas em um repositório utilizando a arquitetura _monorepo_, ou seja, um repositório que contém múltiplos projetos [@narwhal-technologies-inc2022]. O repositório pode ser acessado no link <https://github.com/hgodinho/elucidario> e é organizado da seguinte forma:

```bash
elucidario
├── apps
├── packages
├── publications
├── references
```

O diretório "packages" contém os pacotes de código-fonte que podem ser reutilizados tanto por outros pacotes, como por aplicações. Todos os pacotes definidos nesta pasta seguem o padrão de nome "@elucidario/pkg-\<nome-pacote\>".

No diretório "apps", se encontram as aplicações, como um ambiente de desenvolvimento completo utilizando Docker para testes locais e o site da documentação disponível em <http://elucidario.art/doc>. Os pacotes nesta pasta seguem o padrão de nome "@elucidario/app-\<nome-pacote\>".

O diretório "publications" contém as publicações referentes ao Elucidário.art, como a dissertação de mestrado e outros artigos desenvolvidos ao longo da pesquisa. Os pacotes nesta pasta seguem o padrão de nome "@elucidario/pub-\<nome-pacote\>".

No diretório "references" contém referências utilizadas no desenvolvimento de todo o ecossistema do Elucidário.art.

Listamos a seguir os pacotes principais do diretório _packages_:

-   "@elucidario/pkg-core" - Pacote principal do Elucidário.art, integra os demais pacotes e define as funcionalidades principais do sistema, como banco de dados, rotas, páginas administrativas, configurações, etc;
-   "@elucidario/pkg-mdorim" - Pacote que define o modelo de dados utilizado no sistema;
-   "@elucidario/pkg-design-system" - Pacote que define o sistema de design utilizado no sistema;
-   "@elucidario/pkg-blocks" - Pacote que define os blocos Gutemberg utilizados no sistema;
