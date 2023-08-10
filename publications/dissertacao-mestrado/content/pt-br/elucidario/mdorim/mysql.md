A seguir apresentamos a primeira parte do modelo, o **MySQL Schema**.

Como o Elucidário.art é um plugin para WordPress, utilizamos o banco de dados padrão desta plataforma: o MySQL, que dá suporte a diferentes tipos de dados, como numéricos, datas e horas, textos, tipos espaciais e JSON [@my-sql2023].

Optamos por criar novas tabelas para o Elucidário.art ao invés de usarmos as tabelas padrão do WordPress, assim isolamos o seu funcionamento no sistema e diminuímos as possibilidades de interferência com outros plugins e temas que possam ser instalados na mesma instância.

As tabelas do modelo foram definidas a partir das entidades, propriedades e relações do Linked Art. Levamos em conta as estruturas de seus metadados e como se dão as relações e repetições ao longo do modelo, desta forma optamos por criar uma única tabela para armazenar as entidades em uma estrutura polimórfica, em que cada linha da tabela pode ser uma entidade diferente. Esta decisão foi tomada para evitar uma arquitetura mais complexa, com uma tabela para cada entidade e mais uma tabela para cada relação possível entre as entidades, o que poderia acarretar em inúmeras classes e linhas de código extras, aumentando a dificuldade de manutenção, a possibilidade de erros, e possivelmente diminuindo a performance do sistema.

Dividimos as propriedades do Mdorim em dois tipos de acordo com suas características, as propriedades que definem uma relação entre entidades e as propriedades que definem um valor para uma entidade. As propriedades que definem uma relação entre entidades são armazenadas em uma tabela separada, em que cada linha representa uma relação entre duas entidades com uma propriedade específica, semelhante a uma tripla RDF: sujeito, predicado e objeto. Em que nas colunas sujeito e objeto armazenamos as IDs das entidades relacionadas, e em predicado, armazenamos o nome da propriedade do Linked Art a que esta relação pertence, como por exemplo: "classified_as", "representations", "took_place_at", entre outras. As propriedades que definem um valor para uma entidade são armazenadas na própria tabela da entidade na coluna correspondente ao nome da propriedade, por exemplo: "identified_by", "dimension", "formed_by", entre outras. Também criamos algumas propriedades exclusivas para o devido funcionamento do sistema. No quadro a seguir listamos as propriedades em cada um dos três tipos:

{{table:elucidario/mdorim/mysql/mdorim-properties.json}}

As propriedades internas são utilizadas para adicionar uma camada administrativa ao sistema, em que "_entity_id_" é utilizado para armazenar a ID da entidade; "_name_" é um texto em caixa baixa, sem acentos, sem caracteres especiais, e com espaços e pontuações substituídos por hífen, esta convenção também é conhecida pelo nome "_kebab case_", resultando em _strings_ como "tarsila-do-amaral", "elucidario-art" ou "casa-museu-ema-klabin", o campo "_name_" será utilizado pelo sistema para gerar a URI da entidade; "_guid_" ou _Globally Unique Identifier_, é um identificador global exclusivo que será utilizado para identificar a entidade no sistema, diferentemente do WordPress que utiliza uma URI para identificar as entidades em suas tabelas, utilizaremos um inteiro de 128 bits [@microsoft2023.2], por exemplo: "936DA01F-9ABD-4d9d-80C7-02AF85C822A8", esta decisão leva em consideração a real finalidade deste campo, de identificar globalmente exclusivamente uma entidade. A forma como o WordPress utiliza a _guid_ tem um problema no momento em que o utilizamos em ambientes diferentes, como produção ou desenvolvimento. Como o WordPress utiliza a URI para gerar a _guid_, na produção teríamos uma guid como por exemplo: "https://exemplo.com/elucidario?objeto=2", e no desenvolvimento "https://localhost:8080/elucidario?objeto=2" o que viola a definição de _guid_ [@microsoft2023.2] uma vez que o domínio da URI é diferente em cada ambiente, exigindo, portanto, sempre um processo extra de "_find and replace_" no banco de dados quando for realizar uma migração de ambiente ou até mesmo de servidor de hospedagem ou domínio, o que viola o uso da _guid_ que deve ser imutável. Em "_author_" armazenamos a ID do usuário autor da entidade; "_status_" armazena o status de publicação da entidade, segue o mesmo padrão do WordPress, "_publish_", "_future_", "_draft_", "_pending_", "_private_" e "_trash_"; "_password_" define uma senha para esta entidade, utilizado pela API para controle do acesso; "_created_" e "_modified_" armazenam as datas de criação e modificação da entidade respectivamente.

Cada nova tabela adicionada seguiu um mesmo padrão de nomenclatura em que utilizamos a abreviação "lcdr" e o prefixo definido nas configurações do arquivo "wp-config.php", geralmente esta configuração segue o padrão "wp", mas pode ser customizada em cada instalação. Por exemplo, se o prefixo definido for "wp", a tabela de entidades será "wp_lcdr_entities" e a tabela de relações será "wp_lcdr_relationships".

As descrições da tabelas a seguir são estruturadas da seguinte forma:

-   **Coluna** - Nome da coluna;
-   **Tipo** - Tipo de dado da coluna, em que o tamanho do campo é definido entre parênteses, por exemplo, "varchar(255)", ou seja, uma _string_ de 255 caracteres;
-   **Extra** - Informações adicionais sobre a coluna, como se é uma coluna auto incrementada (auto_increment), ou se é uma coluna que não pode ser nula (not null), também pode ser uma coluna que tem um valor padrão (default);
-   **Chave** - Tipo de chave da coluna, se é uma chave primária (PRI), unitária (UNIQUE), ou um indice (INDEX);
-   **Descrição** - Descrição da coluna.

**Tabela "wp_lcdr_entities"**

É a tabela que armazena as entidades do sistema. Cada entidade foi criada a partir dos _endpoints_ do Linked Art, com exceção de _Person_ e _Group_ em que foram compiladas em uma única classe mais genérica: _Actor_.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-entities.json}}

O tipo da classe é armazenada na coluna "_type_" e pode ser uma das seguintes opções: _Concept_, _Digital_, _Event_, _Provenance_, _Actor_, _Object_, _Place_, _Set_, _Textual_ ou _Visual_. A coluna _label_ armazena, como no Linked Art, um rótulo legível por humanos com foco nos desenvolvedores, este campo pode ser utilizado como título geral da página, e pode ser gerado automaticamente baseado na coluna _identified_by_, ou definida manualmente pelo usuário.

Das colunas _identified_by_ a _removed_by_, com exceção de _format_ que discutiremos a seguir, são armazenadas em JSON e devem passar por devido processo de validação antes de serem inseridas no banco de dados. <!-- O processo de validação será feito utilizando JSON-Schema e discutiremos esse processo mais a frente neste documento. --> As colunas _format_, _defined_by_ e _content_ armazenam _strings_ e passam por processos de escape e higienização antes de serem armazenadas. O escape é o processo de remover dados não desejáveis, como por exemplo a tag `<script>` do HTML que pode conter scripts maliciosos com intenções de gerar danos ao usuário ou ao sistema [@word-press2023]. A higienização é o processo de remover outros tipos de dados que não são necessários ou que também podem gerar danos, como comandos SQL que podem remover ou alterar o banco de dados [@word-press2023.1].

A coluna _begin_of_existence_ é uma união das propriedades _formed_by_ da entidade _Groups_ e _born_ da entidade _People_ do Linked Art, e a coluna _end_of_existence_ é a união de _dissolved_by_ e _died_ de _Groups_ e _People_ respectivamente. O tipo de cada objeto inserido nessas colunas vai depender do tipo da entidade definido na coluna _type_, que é um dado obrigatório e define a estrutura da classe final da entidade e quais colunas e relações de fato esta entidade usa. Por exemplo, a entidade _Concept_ utiliza somente as colunas _identified_by_, _referred_to_by_, _equivalent_, _attributed_by_ e _created_by_. Da mesma forma, cada entidade pode possuir apenas um conjunto possíveis de relações entre outras entidades. Descrevemos no quadro a seguir as colunas e relações que cada entidade utiliza.

{{table:elucidario/mdorim/mysql/mdorim-entities.json}}

**Tabela "wp_lcdr_relationships"**

É a tabela que armazena as relações entre as entidades do sistema.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-relationships.json}}

A coluna _rel_id_ armazena a ID única da relação, campo utilizado para facilitar comandos SQL como edição e remoção; _subject_ e _object_ armazenam as IDs das entidades presentes na tabela _wp_lcdr_entities_; a coluna _predicate_ armazena o tipo de relação possível entre as duas entidades, por exemplo, se a entidade "A" é uma parte da entidade "B", a coluna _predicate_ armazenará o valor _part_of_; e, por fim, a coluna _rel_order_ que armazena a ordem de exibição da relação na UI no caso de haver mais de uma relação entre entidades e predicados iguais. Por exemplo, se a entidade "A" é uma parte da entidade "B" e a entidade "C" também é uma parte da entidade "B", a coluna _rel_order_ armazenará o valor "0" para a relação entre "A" e "B" e o valor "1" para a relação entre "C" e "B", usando indexação a partir do valor "0" como padrão em linguagens de programação.

Criamos também outras duas tabelas, uma para definir o histórico de edições de cada registro e uma para definir as configurações do sistema.

**Tabela "wp_lcdr_history"**

Armazena o histórico de edições das entidades.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-history.json}}

A coluna _history_id_ armazena a ID do evento de edição, enquanto _type_ contextualiza que tipo de evento é este, podendo ser _Creation_, _Edition_ ou _Exclusion_. Em _timestamp_ registramos o carimbo de data e hora em que o evento ocorreu. As colunas _entity_id_ e _user_id_ armazenam a ID da Entidade que sofreu a edição e a ID do Usuário que realizou a edição, respectivamente. Em _property_ armazenamos o nome da propriedade que foi editada, _related_event_ registra a ID de outro evento de edição, caso este evento seja uma edição de uma edição, como por exemplo o ato de voltar a um ponto anterior. Em _previous_ armazenamos o valor anterior da propriedade editada.

**Tabela "wp_lcdr_options"**

É a tabela que armazena as configurações do sistema, segue uma estrutura semelhante à tabela "wp_options" do WordPress.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-options.json}}

Em _id_ armazenamos a ID da opção, _name_ e _value_ registram o nome e o valor da opção, respectivamente. Nesta tabela armazenamos as opções que podem ser reutilizadas por todo o sistema, como _tokens_ de autenticação com APIs externas, por exemplo.

Podemos representar as tabelas definidas anteriormente em um diagrama de entidade e relacionamento, como mostrado na figura a seguir:

{{mermaid:elucidario/mdorim/mysql/mysql.md}}

A tabela "wp_users" é a tabela padrão do WordPress para armazenamento das informações sobre os usuários do sistema, esta tabela possui uma relação de um para vários com a tabela "wp_lcdr_entities", ou seja, um usuário pode ter várias entidades, mas uma entidade só pode ter um usuário, este tipo de relação também se aplica à tabela "wp_lcdr_history", em que um usuário pode ter várias edições, mas uma edição só pode ter um usuário. A tabela "wp_lcdr_relationships" pode ter uma relação de vários para vários com a tabela "wp_lcdr_entities", ou seja, uma entidade pode ter várias relações, e uma relação pode ter duas entidades. Já a tabela "wp_lcdr_options" não possui relação com nenhuma outra tabela e opera de forma independente.
