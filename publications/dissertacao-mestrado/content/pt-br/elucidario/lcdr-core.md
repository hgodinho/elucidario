### 9.1.1 @elucidario/pkg-core

Este pacote é o plugin final. Ele pode ser instalado em diversas instâncias do WordPress, como em um ambiente local, uma rede privada organizacional, em uma operadora de serviços _cloud_ ou em um serviço de hospedagem compartilhada de sites.

Nele definimos as principais funcionalidades do sistema como banco de dados, rotas, páginas administrativas, configurações, etc. Este pacote é o principal do Elucidário.art e integra os demais pacotes.

Como o "@elucidario/pkg-core" é um plugin para WordPres, utilizamos o banco de dados padrão desta plataforma: o MySQL. O WordPress oferece diferentes formas de customização em sua API, desde a criação de novos tipos de _post_ ou taxonomias que estendem as tabelas padrões do WP, a criação de novas tabelas com reaproveitamento de código como classes, funções e _queries_.

Como o modelo de dados utilizado pelo Elucidário.art é baseado no Linked Art, que define 11 classes para representação de informações sobre obras de arte, artistas, exposições, etc, optamos por criar uma tabela para cada classe, assim isolamos o Elucidário.art no WordPress e não interferimos em outros plugins ou temas que possam ser instalados na mesma instância, embora recomendamos uma instância exclusiva para o gerenciamento de coleções de arte. Como o Linked Art define propriedades específicas para determinar o relacionamento entre as classes e, estamos utilizando um banco de dados relacional, optamos por isolar estas propriedades em uma tabela específica para relacionamentos, como por exemplo as propriedades "classified_as", "member_of", "subject_of", "representation", entre outras que fazem referência a outras tabelas definidas no sistema.

Esta decisão leva em consideração o processo de normalização dos dados, que é uma técnica utilizada para evitar a redundância de dados e inconsistências no banco de dados. A normalização de dados é um processo que consiste em dividir as tabelas em partes menores e mais simples, evitando a repetição de dados e garantindo a integridade dos dados. O processo de normalização é dividido em 5 etapas, chamadas de formas normais, e cada etapa define um conjunto de regras que devem ser seguidas para garantir a integridade dos dados. Como os recursos de criação de tabelas no WordPress são limitados, por exemplo, não é possível definir uma Chave Estrangeira ou _Foreign Key_ (FK) [@petty2014], e seguindo as três primeiras formas normais é suficiente para representar todo o sistema, listamos as 3 primeiras formas normais e suas regras [@microsoft2023.1]:

1. Primeira Forma Normal (1FN) - Cada coluna deve ter um único valor, não podendo conter múltiplos valores separados por vírgula, por exemplo;
2. Segunda Forma Normal (2FN) - A tabela deve estar na 1FN e não deve conter dependências parciais, ou seja, cada coluna deve depender da chave primária da tabela;
3. Terceira Forma Normal (3FN) - A tabela deve estar na 2FN e não deve conter dependências transitivas, ou seja, não deve haver dependência entre as colunas que não sejam a chave primária;

É preciso destacar que estas regras podem conter violações, quando previamente previstas pelo sistema, devidamente documentadas e trabalhadas no código. Como por exemplo as propriedades que definem array de JSONs nas tabelas, que violam a 1FN [@shadow2017], mas são necessárias para representar o modelo de dados do Linked Art "identified_by", em que temos uma matriz de identificações possíveis para uma classe, embora os elementos de cada matriz possam ser repetidos entre entidades distintas, como no caso do sobrenome "Silva" em duas entidade "Pessoa" diferentes, quando utilizada no contexto de uma entidade, serve exclusivamente para identifica-lá. O MySQL permite o armazenamento de JSON, portanto é seguro utilizarmos matrizes de objetos JSON para representar estas propriedades que evitam a criação de novas tabelas, o que poderia acarretar em má performance do sistema.

Criamos também 3 outras tabelas: uma para definir as relações entre as classes; uma para definir o histórico de edições de cada registro; e uma para definir as configurações do sistema. Desta forma, o Elucidário.art utiliza 14 tabelas no banco de dados do WordPress. Utilizaremos a abreviação "lcdr" na nomenclatura das tabelas e seguiremos o padrão do WP de utilizar o prefixo de tabela definido nas configurações do arquivo "wp-config.php", geralmente esta configuração segue o padrão "wp\_", mas pode ser customizada em cada instalação. As descrições a seguir são estruturadas da seguinte forma:

-   **Coluna** - Nome da coluna;
-   **Tipo** - Tipo de dado da coluna;
-   **Extra** - Informações adicionais sobre a coluna;
-   **Key** - Tipo de chave da coluna, se é uma chave primária (PRI) ou unitária (UNI);
-   **Descrição** - Descrição da coluna.

1.  Tabela "wp_lcdr"

    É a tabela que armazena as configurações do sistema, segue a mesma estrutura da tabela "wp_options" do WordPress.

    {{table:mysql/tabela-wp-lcdr.json}}

2.  Tabela "wp_lcdr_relationships"

3.  Tabela "wp_lcdr_concepts"

    Armazena os dados descritos na classe "Concept" do Linked Art.

    {{table:mysql/tabela-wp-lcdr-concepts.json}}

4.  Tabela "wp_lcdr_digital"

5.  Tabela "wp_lcdr_events"

6.  Tabela "wp_lcdr_agents"

7.  Tabela "wp_lcdr_objects"

8.  Tabela "wp_lcdr_places"

9.  Tabela "wp_lcdr_provenance"

10. Tabela "wp_lcdr_sets"

11. Tabela "wp_lcdr_textual"

12. Tabela "wp_lcdr_visual"