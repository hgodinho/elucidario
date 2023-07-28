Como o "@elucidario/pkg-core" é um plugin para WordPress, utilizamos o banco de dados padrão desta plataforma: o MySQL. O WordPress oferece diferentes formas de customização em sua API, desde a criação de novos tipos de _post_ ou taxonomias que estendem as tabelas padrões do WP, a criação de novas tabelas com reaproveitamento de código como classes, funções e _queries_. A partir daqui nos referenciaremos a este pacote somente como "_core_" em itálico.

O _core_ utiliza o _mdorim_ para definição do modelo de dados utilizado no sistema, e portanto, optamos por criar uma tabela para cada classe do modelo. Dessa forma isolamos o Elucidário.art no WordPress e não interferimos em outros plugins ou temas que possam ser instalados na mesma instância, embora recomendamos uma instância exclusiva para o gerenciamento de coleções de arte. Como o Linked Art define propriedades específicas para determinar o relacionamento entre as classes e, estamos utilizando um banco de dados relacional, optamos por isolar estas propriedades em tabelas específicas para relacionamentos entre as entidades, por exemplo a relação entre _Concept_ e _Object_, ou _Digital_ e _Visual_, entre outras.

Esta decisão leva em consideração o processo de normalização dos dados, que é uma técnica utilizada para evitar a redundância de dados e inconsistências no banco de dados. A normalização de dados é um processo que consiste em dividir as tabelas em partes menores e mais simples, evitando a repetição de dados e garantindo a integridade dos dados. O processo de normalização é dividido em 5 etapas, chamadas de formas normais, e cada etapa define um conjunto de regras que devem ser seguidas para garantir a integridade dos dados. Como os recursos de criação de tabelas no WordPress são limitados, por exemplo, não é possível definir uma Chave Estrangeira ou _Foreign Key_ (FK) [@petty2014], e seguindo as três primeiras formas normais é suficiente para representar todo o sistema, listamos as 3 primeiras formas normais e suas regras [@microsoft2023.1]:

1. Primeira Forma Normal (1FN) - Cada coluna deve ter um único valor, não podendo conter múltiplos valores separados por vírgula, por exemplo;
2. Segunda Forma Normal (2FN) - A tabela deve estar na 1FN e não deve conter dependências parciais, ou seja, cada coluna deve depender da chave primária da tabela;
3. Terceira Forma Normal (3FN) - A tabela deve estar na 2FN e não deve conter dependências transitivas, ou seja, não deve haver dependência entre as colunas que não sejam a chave primária;

É preciso destacar que estas regras podem conter violações, quando previamente previstas pelo sistema, devidamente documentadas e trabalhadas no código. Como por exemplo as propriedades que definem array de JSONs nas tabelas, que violam a 1FN [@shadow2017], mas são necessárias para representar o modelo de dados do Linked Art "identified_by", em que temos uma matriz de identificações possíveis para uma classe, embora os elementos de cada matriz possam ser repetidos entre entidades distintas, como no caso do sobrenome "Silva" em duas entidade "Pessoa" diferentes, quando utilizada no contexto de uma entidade, serve exclusivamente para identifica-lá, não sendo possível sua reutilização. O MySQL permite o armazenamento de JSON, portanto é seguro utilizarmos matrizes de objetos JSON para representar estas propriedades que evitam a criação de novas tabelas, o que poderia acarretar em má performance do sistema. Uma regra geral é achar o equilíbrio entre a normalização dos dados e outras questões, como performance, segurança, complexidade, etc.

Criamos também 3 outras tabelas: uma para definir as relações entre as classes; uma para definir o histórico de edições de cada registro; e uma para definir as configurações do sistema. Desta forma, o Elucidário.art utiliza 14 tabelas no banco de dados do WordPress. Utilizaremos a abreviação "lcdr" na nomenclatura das tabelas e seguiremos o padrão do WP de utilizar o prefixo de tabela definido nas configurações do arquivo "wp-config.php", geralmente esta configuração segue o padrão "wp\_", mas pode ser customizada em cada instalação. As descrições a seguir são estruturadas da seguinte forma:

-   **Coluna** - Nome da coluna;
-   **Tipo** - Tipo de dado da coluna;
-   **Extra** - Informações adicionais sobre a coluna;
-   **Chave** - Tipo de chave da coluna, se é uma chave primária (PRI) ou unitária (UNI);
-   **Descrição** - Descrição da coluna.

1.  Tabela "wp_lcdr_options"

    É a tabela que armazena as configurações do sistema, segue a mesma estrutura da tabela "wp_options" do WordPress.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-options.json}}

2.  Tabela "wp_lcdr_history"

    Armazena o histórico de edições das outras entidades.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-history.json}}

    {{mermaid:elucidario/mdorim/mysql/history.md}}

3.  Tabela "wp_lcdr_concepts"

    Armazena os dados descritos na classe "Concept" do Linked Art.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-concepts.json}}

    {{mermaid:elucidario/mdorim/mysql/concept.md}}

4.  Tabela "wp_lcdr_digitals"

    Armazena os dados descritos na classe "Digital" do Linked Art.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-digitals.json}}

    {{mermaid:elucidario/mdorim/mysql/digital.md}}

5.  Tabela "wp_lcdr_events"

    Armazena os dados descritos na classe "Event" do Linked Art.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-events.json}}

    {{mermaid:elucidario/mdorim/mysql/event.md}}

6.  Tabela "wp_lcdr_agents"

    Armazena os dados descritos na classe "Agent" do Linked Art.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-agents.json}}

    {{mermaid:elucidario/mdorim/mysql/agent.md}}

7.  Tabela "wp_lcdr_objects"

    Armazena os dados descritos na classe "Object" do Linked Art.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-objects.json}}

    {{mermaid:elucidario/mdorim/mysql/object.md}}

8.  Tabela "wp_lcdr_places"

    Armazena os dados descritos na classe "Place" do Linked Art.

    {{table:elucidario/mdorim/mysql/tabela-wp-lcdr-places.json}}

    {{mermaid:elucidario/mdorim/mysql/place.md}}

9.  Tabela "wp_lcdr_provenance"

10. Tabela "wp_lcdr_sets"

11. Tabela "wp_lcdr_textual"

12. Tabela "wp_lcdr_visual"

As tabelas a seguir são utilizadas para definir as relações entre as classes do Linked Art, e seguem a mesma estrutura:

12. Tabela "wp_lcdr_concept_visual"

    {{mermaid:elucidario/mdorim/mysql/relation.md;entity_a=concept;entity_b=visual;relation_a=classified_as|classified_as;relation_b=banana}}

13. Tabela "wp_lcdr_concept_concept"

    {{mermaid:elucidario/mdorim/mysql/self-relation.md;entity=concept;relation=classified_as|subject_of}}

14. Tabela "wp_lcdr_digital_digital"

    {{mermaid:elucidario/mdorim/mysql/self-relation.md;entity=digital;relation=referred_to_by}}

15. Tabela "wp_lcdr_event_event"

    {{mermaid:elucidario/mdorim/mysql/self-relation.md;entity=event;relation=part_of}}

16. Tabela "wp_lcdr_agent_agent"

    {{mermaid:elucidario/mdorim/mysql/self-relation.md;entity=agent}}

17. Tabela "wp_lcdr_object_object"

    {{mermaid:elucidario/mdorim/mysql/self-relation.md;entity=object}}
