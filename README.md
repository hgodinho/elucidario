<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hgodinho/elucidario/main/packages/design-system/assets/svg/type%3Dvertical%2C%20color%3Dpink%2C%20theme%3Ddark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/hgodinho/elucidario/main/packages/design-system/assets/svg/type%3Dvertical%2C%20color%3Dpink%2C%20theme%3Dlight.svg">
    <img src="https://raw.githubusercontent.com/hgodinho/elucidario/main/packages/design-system/assets/svg/type%3Dvertical%2C%20color%3Dpink%2C%20theme%3Ddark.svg" alt="Logo Elucidário.art" width="300">
</picture>

> Sistema de Gestão de Coleções para museus, galerias, acervos e coleções de arte.

___

Em linhas gerais o Elucidário.art é um _Collection Management System_. A abreviação CMS é majoritariamente conhecida com um outro significado: _Content Management System_, devido a popularidade de plataformas como WordPress, Joomla, Drupal, etc. O Elucidário.art é um CMS para coleções de arte, ou seja, é um sistema de gerenciamento de coleções de arte, ou um _Content Management System_ especializado. Portanto utilizaremos a abreviação CMS para nos referirmos ao Elucidário como um _Collection Management System_. Este termo também é utilizado por instituições como [_Collections Trust_](collectionstrust.org.uk/) e [ICOM](https://icom.museum/) para referir-se a esta modalidade de software.

Em suma, o Elucidário.art consiste em um plugin para WordPress que define um conjunto de funcionalidades para gerenciamento de coleções de arte. O plugin utiliza o modelo de dados para aplicações [Linked Art](https://linked.art) para definição das classes principais de conteúdo e se baseia nos procedimentos [Spectrum](https://collectionstrust.org.uk/spectrum/) para definição de seus fluxos de trabalho.

O repositório está estruturado em uma arquitetura de mono-repositório, em que os pacotes são distribuídos em subdiretórios na raíz do projeto. Cada pacote é uma funcionalidade, ou micro-serviço, que pode ser utilizado de forma independente. A estrutura de diretórios é a seguinte:

```bash
elucidario
├── packages
├── apps
├── publications
├── references
├── ...
```

O diretório `packages` contém os pacotes que podem ser reutilizados, tanto por outros pacotes, como por aplicações. Todos os pacotes definidos nesta pasta seguem o padrão de nome `@elucidario/pkg-<nome-pacote>`.

No diretório `apps`, se encontram as aplicações, como um ambiente de desenvolvimento completo utilizando Docker para testes locais e o site do Elucidário.art disponível em <http://elucidario.art/>. Os pacotes nesta pasta seguem o padrão de nome `@elucidario/app-<nome-pacote>`.

O diretório `publications` contém as publicações referentes ao Elucidário.art, como esta dissertação de mestrado e outros artigos desenvolvidos ao longo da pesquisa. Os pacotes nesta pasta seguem o padrão de nome `@elucidario/pub-<nome-pacote>`.

No diretório `references` contém referências utilizadas no desenvolvimento de todo o ecossistema do Elucidário.art e estão organizadas em um arquivo JSON para cada referência seguindo o formato [_Citation Style Language_ (CSL)](https://github.com/citation-style-language) (D’Arcus, 2010).

Todos os pacotes nos diretórios `apps` e `packages` foram construídos levando em conta os seguintes princípios de design, ou técnicas de programação:

- a11y (_accessibility_) - quando aplicável o pacote deve seguir as regras de acessibilidade apropriadas para o contexto;
- i10n (_localization_) - quando aplicável o pacote deve implementar o suporte a localização dos idiomas português, espanhol e inglês, seguindo esta ordem de prioridade;
- i18n (_internationalization_) - quando aplicável o pacote deve implementar o suporte a internacionalização, e o processo de localização deve ser devidamente documentado;

---

```markdown
███████╗██╗     ██╗   ██╗ ██████╗██╗██████╗  █████╗ ██████╗ ██╗ ██████╗
██╔════╝██║     ██║   ██║██╔════╝██║██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗
█████╗  ██║     ██║   ██║██║     ██║██║  ██║███████║██████╔╝██║██║   ██║
██╔══╝  ██║     ██║   ██║██║     ██║██║  ██║██╔══██║██╔══██╗██║██║   ██║
███████╗███████╗╚██████╔╝╚██████╗██║██████╔╝██║  ██║██║  ██║██║╚██████╔╝
╚══════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝
```
