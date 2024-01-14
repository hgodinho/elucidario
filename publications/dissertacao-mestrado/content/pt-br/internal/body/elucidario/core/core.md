### 7.2.3 @elucidario/pkg-core

**Escopo**

O pacote `@elucidario/pkg-core` é o pacote principal do Elucidário.art e é responsável por definir as principais funcionalidades do sistema, como o banco de dados, as rotas, páginas administrativas, configurações, etc. Este pacote agrega e estabelece uma comunicação entre os demais pacotes do Elucidário.art, e é o plugin final que pode ser instalado em diversas instâncias do WordPress, como em um ambiente local (_localhost_), uma rede privada organizacional, em uma operadora de serviços _cloud_ ou em um serviço de hospedagem compartilhada de sites.

**Descrição**

O `@elucidario/pkg-core` integra os demais pacotes em um único para distribuição e instalação do Elucidário.art. Ele é dividido em quatro partes principais: _Object-Relational Mapping_ (ORM), _Representational State Transfer_ (REST), _Validator_ (Validação) e _User Interface_ (UI). O ORM é responsável por mapear os objetos do modelo de dados para o banco de dados, o Validator é utilizado para validar os dados utilizados ao longo de diversas funções no sistema, o REST é responsável por criar as rotas e endpoints da API e a UI é responsável por definir o design e criar as páginas administrativas do plugin.

**{{count:figure;legend=@elucidario/pkg-core: Estrutura do pacote principal do Elucidário.art.}}**

![**Fonte**: Elaborado pelo autor.]({{static}}/elucidario-pkg.png)
