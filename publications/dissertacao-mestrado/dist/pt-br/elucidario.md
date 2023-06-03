# 5. Elucidario.art

Para o entendimento das seções a seguir, é importante primeiro definirmos alguns conceitos:

**_Back-end_** é a parte do sistema que não é visível para o usuário. É a parte do sistema que gerencia os dados e a lógica de negócio.

**_Front-end_ ou _User Interface_ (UI)** é a parte do sistema que é visível e possibilita a interação com o usuário.

**_Headless_** é utilizado para referir-se a sistemas que não possuem uma interface de usuário final. Um sistema _headless_ pode ser acessado apenas por um administrador, ou pode ser acessado por um usuário final através de uma aplicação separada.

**_Application Programming Interface_ (API)** é um conjunto de rotinas e padrões de programação para acesso a um aplicativo, software ou plataforma baseada na Web de forma programática.

**_Representational State Transfer_ API (REST-API)** é um conjunto de padrões de comunicação hipermídia entre sistemas que utiliza o protocolo HTTP para realizar requisições e respostas.

**Usuário final** é o usuário que interage com o sistema. É o usuário que acessa o endereço '<https://exemplo.com>'.

**Administrador** é o usuário que gerencia o sistema. É o usuário que acessa o endereço '<https://exemplo.com/wp-admin>' ou qualquer outra URI de gerenciamento do sistema.

**Bloco Gutemberg** é uma funcionalidade do WordPress que facilita a reutilização de componentes de interface de usuário. Os blocos Gutemberg são utilizados para construir páginas e postagens no WordPress.

Em linhas gerais o Elucidário.art é um _Collection Management System_. A abreviação CMS é majoritariamente conhecida com um outro significado: _Content Management System_, devido a popularidade de plataformas como WordPress, Joomla, Drupal, etc. O Elucidário.art é um CMS para coleções de arte, ou seja, é um sistema de gerenciamento de coleções de arte, ou um _Content Management System_ especializado. Portanto utilizaremos a abreviação CMS para nos referirmos ao Elucidário como um _Collection Management System_. Este termo também é utilizado por instituições como _Collections Trust_ e ICOM para referir-se a esta modalidade de software.

Em suma, o Elucidário.art consiste em um plugin para WordPress que define um conjunto de funcionalidades para gerenciamento de coleções de arte. O plugin utiliza o modelo de dados para aplicações Linked Art para definição das classes principais de conteúdo e se baseia nos procedimentos Spectrum para definição de seus fluxos de trabalho.

## 5.1. Repositório

As principais linguagens de programação utilizadas no código-fonte do Elucidário.art são PHP 8.2 (PHP, 2022), TypeScript (MICROSOFT, 2023), JavaScript (MDN, 2022) e JSON (BRAY; IETF, 2017), e estão estruturadas em um repositório utilizando a arquitetura _monorepo_, ou seja, um repositório que contém múltiplos projetos (NARWHAL TECHNOLOGIES INC., 2022). O repositório pode ser acessado no link <https://github.com/hgodinho/elucidario> e é organizado da seguinte forma:

```bash
elucidario
├── apps
├── packages
├── publications
├── references
```

O diretório "packages" contem os pacotes de código-fonte que podem ser reutilizados tanto por outros pacotes, como por aplicações. Todos os pacotes definidos nesta pasta seguem o padrão de nome "@elucidario/pkg-\<nome-pacote>".

No diretório "apps", se encontram as aplicações, como um ambiente de desenvolvimento completo utilizando Docker para testes locais e o site da documentação disponível em <http://elucidario.art/doc>. Os pacotes nesta pasta seguem o padrão de nome "@elucidario/app-\<nome-pacote>".

O diretório "publications" contém as publicações referentes ao Elucidário.art, como a dissertação de mestrado e outros artigos. Os pacotes nesta pasta seguem o padrão de nome "@elucidario/pub-\<nome-pacote>".

No diretório "references" contém referências utilizadas no desenvolvimento de todo o ecossistema do Elucidário.art.

Listamos a seguir os pacotes principais do diretório _packages_:

-   "@elucidario/pkg-core" - Pacote principal do Elucidário.art, integra os demais pacotes e define as funcionalidades principais do sistema, como banco de dados, rotas, páginas administrativas, configurações, etc;
-   "@elucidario/pkg-mdorim" - Pacote que define o modelo de dados utilizado no sistema;
-   "@elucidario/pkg-design-system" - Pacote que define o sistema de design utilizado no sistema;
-   "@elucidario/pkg-blocks" - Pacote que define os blocos Gutemberg utilizados no sistema;

### 5.1.1 @elucidario/pkg-core

Este pacote é o plugin que pode ser instalado em diversas instâncias do WordPress, como em um ambiente local, uma rede privada organizacional, em uma operadora de serviços _cloud_ ou em um serviço de hospedagem compartilhada de sites.

Nele definimos as principais funcionalidades do sistema como banco de dados, rotas, páginas administrativas, configurações, etc. Este pacote é o principal do Elucidário.art e integra os demais pacotes.

#### 5.1.1.1. Banco de dados

Como o "@elucidario/pkg-core" é um plugin para WordPres, utilizamos o banco de dados padrão desta plataforma, que é o MySQL. O WordPress oferece diferentes formas de customização em sua API, desde a criação de novos tipos de _post_ ou taxonomias que estendem as tabelas padrões do WP, a criação de novas tabelas com reaproveitamento de código como classes, funções e queries.

Como o modelo de dados utilizado pelo Elucidário.art é baseado no Linked Art, que define 11 classes para registro de informações sobre obras de arte, artistas, exposições, etc, optamos por criar uma tabela para cada classe, assim isolamos o Elucidário.art no WordPress e não interferimos em outros plugins ou temas que possam ser instalados na mesma instância, embora recomendamos uma instância exclusiva para o gerenciamento de coleções de arte. Como o Linked Art define propriedades específicas para determinar o relacionamento entre as classes, e estamos utilizando um banco de dados relacional, optamos por isolar estas propriedades em uma tabela específica para relacionamentos, como por exemplo as propriedades "classified_as", "member_of", "subject_of", "representation", entre outras que fazem referência a outras tabelas definidas no sistema.

Esta decisão leva em consideração o processo de normalização dos dados, que é uma técnica utilizada para evitar a redundância de dados e inconsistências no banco de dados. A normalização de dados é um processo que consiste em dividir as tabelas em partes menores e mais simples, evitando a repetição de dados e garantindo a integridade dos dados. O processo de normalização de dados é dividido em 5 etapas, chamadas de formas normais, e cada etapa define um conjunto de regras que devem ser seguidas para garantir a integridade dos dados. Como os recursos de criação de tabelas no WordPress são limitados, por exemplo, não é possível definir uma Chave Estrangeira ou Foreign Key (FK) (PETTY, 2014), e seguindo as três primeiras formas normais é suficiente para representar todo o sistema, listamos as 3 primeiras formas normais e suas regras (MICROSOFT, 2023):

1.  Primeira Forma Normal (1FN) - Cada coluna deve ter um único valor, não podendo conter múltiplos valores separados por vírgula, por exemplo;
2.  Segunda Forma Normal (2FN) - A tabela deve estar na 1FN e não deve conter dependências parciais, ou seja, cada coluna deve depender da chave primária da tabela;
3.  Terceira Forma Normal (3FN) - A tabela deve estar na 2FN e não deve conter dependências transitivas, ou seja, não deve haver dependência entre as colunas que não sejam a chave primária;

É preciso destacar que estas regras podem conter violações, quando previamente previstas pelo sistema, devidamente documentadas e trabalhadas no código. Como por exemplo as propriedades que definem array de JSONs nas tabelas, que violam a 1FN (SHADOW, 2017), mas são necessárias para representar o modelo de dados do Linked Art, e evitam a criação de novas tabelas para representar estas propriedades, o que poderia acarretar em má performance do sistema.

Criamos também 3 outras tabelas: uma para definir as relações entre as classes; uma para definir o histórico de edições de cada registro; e uma para definir as configurações do sistema. Desta forma, o Elucidário.art utiliza 14 tabelas no banco de dados do WordPress. Utilizaremos a abreviação "lcdr" na nomenclatura das tabelas e seguiremos o padrão do WP de utilizar o prefixo de tabela definido nas configurações do arquivo "wp-config.php", geralmente esta configuração segue o padrão "wp\_", mas pode ser customizada em cada instalação. As descrições a seguir são estruturadas da seguinte forma:

-   **Coluna** - Nome da coluna;
-   **Tipo** - Tipo de dado da coluna;
-   **Extra** - Informações adicionais sobre a coluna;
-   **Key** - Tipo de chave da coluna, se é uma chave primária (PRI) ou unitária (UNI);
-   **Descrição** - Descrição da coluna.

##### 5.1.1.1.1. Tabela "wp_lcdr"

É a tabela que armazena as configurações do sistema, segue a mesma estrutura da tabela "wp_options" do WordPress.

**Tabela X: Descrição a tabela MySQL _wp_lcdr_ do sistema**

| Coluna | Tipo        | Extra          | Key | Descrição                       |
| ------ | ----------- | -------------- | --- | ------------------------------- |
| id     | bigint(20)  | auto_increment | PRI | Identificador único do registro |
| name   | varchar(64) | -              | UNI | Nome da configuração            |
| value  | longtext    | -              | -   | Valor da configuração           |

**Fonte**: Elaborado pelo autor.

##### 5.1.1.1.2. Tabela "wp_lcdr_relationships"

##### 5.1.1.1.3. Tabela "wp_lcdr_concepts"

Armazena os dados descritos na classe "Concept" do Linked Art.

**Tabela X: Descrição da tabela MySQL _wp_lcdr_concepts_ do sistema**

| Coluna         | Tipo       | Extra          | Key | Descrição                                                                                       |
| -------------- | ---------- | -------------- | --- | ----------------------------------------------------------------------------------------------- |
| id             | bigint(20) | auto_increment | PRI | Identificador único do registro                                                                 |
| label          | text       | -              | -   | Nome do Concept, gerado automaticamente baseado na coluna identified_by                         |
| identified_by  | JSON       | -              | -   | Um array de JSON que representam as identificações do conceito                                  |
| referred_to_by | JSON       | -              | -   | Um array de JSON que representam as descrições do conceito                                      |
| equivalent     | JSON       | -              | -   | Um array de JSON em que cada um é uma referência a uma entidade externa equivalente ao conceito |
| created_at     | datetime   | -              | -   | Data de criação do registro                                                                     |
| updated_at     | datetime   | -              | -   | Data da última atualização do registro                                                          |

**Fonte**: Elaborado pelo autor. Baseado em Linked Art [@linked-art2021.6]

##### 5.1.1.1.4. Tabela "wp_lcdr_digital"

##### 5.1.1.1.5. Tabela "wp_lcdr_events"

##### 5.1.1.1.6. Tabela "wp_lcdr_agents"

##### 5.1.1.1.7. Tabela "wp_lcdr_objects"

##### 5.1.1.1.8. Tabela "wp_lcdr_places"

##### 5.1.1.1.9. Tabela "wp_lcdr_provenance"

##### 5.1.1.1.10. Tabela "wp_lcdr_sets"

##### 5.1.1.1.11. Tabela "wp_lcdr_textual"

##### 5.1.1.1.12. Tabela "wp_lcdr_visual"

## Modelo de Dados para Organização e Representação da Informação Museológica (MDORIM)

O MDORIM, modelo de dados utilizado pelo Elucidário.art, é inteiramente baseado no modelo de dados para aplicações Linked Art (LINKED ART, 2021), porém apresenta algumas modificações para o contexto de uso do WordPress e adiciona novas classes e propriedades como histórico de edições, usuários e capacidades de usuários.

Para a definição do modelo utilizaremos JSON-Schema, a apresentação também será realizada em Diagrama de Entidade e Relacionamento e tabelas para melhor compreensão de suas classes e propriedades.

Descrevemos o modelo a seguir.

### Classes

Para a definição das classes do MDORIM herdaremos os endpoints do Linked Art e suas propriedades, mas as definiremos de duas formas: para armazenamento e para distribuição. As classes para armazenamento são utilizadas para armazenar os dados no banco de dados e são adaptadas ao contexto de uso do WordPress, ou seja em Banco de Dados Relacional, em que diferentemente do Linked Art que referenciamos outra entidade por sua URI, no armazenamento referenciamos pela ID única que define a linha na tabela do banco de dados.
