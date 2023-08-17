Para armazenarmos essas entidades no banco de dados definimos

A seguir apresentamos a primeira parte do modelo, o **MySQL Schema**.

Como o Elucidário.art é um plugin para WordPress, utilizamos o banco de dados padrão desta plataforma: o MySQL, que dá suporte a diferentes tipos de dados, como numéricos, datas e horas, textos, tipos espaciais e JSON [@my-sql2023].

Optamos por criar novas tabelas para o Elucidário.art ao invés de usarmos as tabelas padrão do WordPress, assim isolamos o seu funcionamento no sistema e diminuímos as possibilidades de interferência com outros plugins e temas que possam ser instalados na mesma instância.

As tabelas foram definidas a partir das entidades, propriedades e relações do Linked Art. Levamos em conta as estruturas de seus metadados e como se dão as relações e repetições ao longo do modelo, desta forma optamos por criar uma única tabela para armazenar as entidades em uma estrutura polimórfica, em que cada linha da tabela pode ser uma entidade diferente. Esta decisão foi tomada para evitar uma arquitetura mais complexa, com uma tabela para cada entidade e mais uma tabela para cada relação possível entre as entidades, o que poderia acarretar em inúmeras classes e linhas de código extras, aumentando a dificuldade de manutenção, a possibilidade de erros, e possivelmente diminuindo a performance do sistema.

Dividimos as propriedades do Linked Art em dois tipos de acordo com suas características, os metadados que definem relações entre entidades e os metadados que definem um valor para uma entidade. As propriedades que definem uma relação entre entidades são armazenadas em uma tabela separada, em que cada linha representa uma relação entre duas entidades com uma propriedade específica, semelhante a uma tripla RDF: sujeito, predicado e objeto — em que nas colunas sujeito e objeto armazenamos as IDs das entidades relacionadas, e em predicado, armazenamos o nome da propriedade do Linked Art a que esta relação pertence, como por exemplo: `classified_as`, `representations`, `took_place_at`, entre outras. As propriedades que definem um valor para uma entidade são armazenadas na própria tabela da entidade na coluna correspondente ao nome da propriedade, por exemplo: `identified_by`, `dimension`, `formed_by`, entre outras. Também criamos alguns metadados exclusivos para o devido funcionamento do sistema. No quadro a seguir listamos todas as propriedades em cada um dos três tipos:

{{table:elucidario/mdorim/mysql/mdorim-properties.json}}

Os metadados internos são utilizados para adicionar uma camada administrativa ao sistema, em que `entity_id` é utilizado para registrar a ID numérica e auto-incrementada da entidade; `name` é um texto em caixa baixa, sem acentos, sem caracteres especiais, e com espaços e pontuações substituídos por hífen — esta convenção também é conhecida pelo nome "_kebab case_", resultando em `strings` como "tarsila-do-amaral", "elucidario-art" ou "casa-museu-ema-klabin"; o campo `name` será utilizado pelo sistema para gerar a URI da entidade; `guid`, ou _Globally Unique Identifier_, é um identificador global exclusivo que será utilizado para identificar a entidade no sistema, diferentemente do WordPress que utiliza uma URI para identificar as entidades em suas tabelas, utilizaremos um inteiro de 128 bits [@microsoft2023.2], por exemplo: "936DA01F-9ABD-4d9d-80C7-02AF85C822A8", esta decisão leva em consideração a real finalidade deste campo, de identificar globalmente exclusivamente uma entidade. A forma como o WordPress utiliza a `guid` tem um problema no momento em que o utilizamos em ambientes diferentes, como produção ou desenvolvimento. Como o WordPress utiliza a URI para gerar a `guid`, na produção teríamos uma guid como por exemplo: "<https://exemplo.com/elucidario?objeto=2>", e no desenvolvimento "<https://localhost:8080/elucidario?objeto=2>" o que viola a definição de `guid` [@microsoft2023.2] uma vez que o domínio da URI é diferente em cada ambiente, exigindo, portanto, sempre um processo extra de "_find and replace_" no banco de dados quando for realizar uma migração de ambiente ou até mesmo de servidor de hospedagem ou domínio, o que viola o uso da `guid` que deve ser imutável. Em `author` armazenamos a ID do usuário-autor da entidade; `status` armazena o status de publicação da entidade, segue o mesmo padrão do WordPress, "_publish_", "_future_", "_draft_", "_pending_", "_private_" e "_trash_"; O campo `password` define uma senha para esta entidade, utilizado pela API para controle do acesso; `created` e `modified` armazenam as datas de criação e modificação respectivamente.

Cada nova tabela adicionada seguiu um mesmo padrão de nomenclatura em que utilizamos a abreviação "lcdr" e o prefixo definido nas configurações do arquivo "wp-config.php". Geralmente esta configuração segue o padrão "wp", mas pode ser customizada em cada instalação, por exemplo: se o prefixo definido for "wp", a tabela de entidades será "wp_lcdr_entities" e a tabela de relações será "wp_lcdr_relationships".

As descrições das tabelas a seguir são estruturadas da seguinte forma:

- **Coluna** - Nome da coluna;
- **Tipo** - Tipo de dado da coluna, em que o tamanho do campo é definido entre parênteses, por exemplo, "varchar(255)", ou seja, uma `string` de 255 caracteres;
- **Extra** - Informações adicionais sobre a coluna, como se é uma coluna auto incrementada (auto_increment), ou se é uma coluna que não pode ser nula (not null), também pode ser uma coluna que tem um valor padrão (default);
- **Chave** - Tipo de chave da coluna, se é uma chave primária (PRI), unitária (UNIQUE), ou um indice (KEY);
- **Descrição** - Descrição da coluna.

**Tabela "wp_lcdr_entities"**

É a tabela que armazena as entidades do sistema. Cada entidade foi criada a partir dos _endpoints_ do Linked Art.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-entities.json}}

O tipo da classe é armazenada na coluna `type` e pode ser uma das seguintes opções: `Concept`, `Digital`, `Event`, `Provenance`, `Actor`, `Object`, `Place`, `Set`, `Textual` ou `Visual`. A coluna `label` armazena, como no Linked Art, um rótulo legível por humanos com foco nos desenvolvedores, este campo pode ser utilizado como título geral da página final, por exemplo, e pode ser gerado automaticamente baseado na coluna `identified_by`, ou definida manualmente pelo usuário.

Das colunas `identified_by` a `removed_by`, com exceção de `format` que discutiremos a seguir, são armazenadas em JSON e devem passar por devido processo de validação e codificação em JSON antes de serem inseridas no banco de dados. As colunas `format`, `defined_by` e `content` armazenam `strings` e passam por processos de escape e higienização antes de serem armazenadas. O escape é o processo de remover dados não desejáveis, como por exemplo a tag `<script>` do HTML que pode conter scripts maliciosos com intenções de gerar danos ao usuário ou ao sistema [@word-press2023]. A higienização é o processo de remover outros tipos de dados que não são necessários ou que também podem gerar danos, como comandos SQL que podem remover ou alterar o banco de dados [@word-press2023.1].

A coluna `begin_of_existence` é uma união das propriedades `formed_by` da entidade `Groups` e `born` da entidade `People` do Linked Art, e a coluna `end_of_existence` é a união de `dissolved_by` e `died` de `Groups` e `People` respectivamente. O tipo de cada objeto inserido nessas colunas vai depender do tipo da entidade definido na coluna `type`, que é um dado obrigatório e define a estrutura da classe final da entidade e quais colunas e relações de fato esta entidade usa. Por exemplo, a entidade `Concept` utiliza somente as colunas `identified_by`, `referred_to_by`, `equivalent`, `attributed_by` e `created_by`. Da mesma forma, cada entidade pode possuir apenas um conjunto possíveis de relações entre outras entidades. Descrevemos no quadro a seguir as colunas e relações que cada entidade utiliza.

{{table:elucidario/mdorim/mysql/mdorim-entities.json}}

Perceba que a propriedade `referred_to_by` aparece tanto nas colunas, quanto nos predicados, isso se dá pois ela permite em seu registro tanto uma relação quanto um valor, por exemplo, uma entidade pode ser descrita por um objeto `Statement` ou por uma referência a uma entidade `Textual`, uma vez que ambas derivam da classe do CRM _E33_Linguistic_Object_ definidas como tipo [CITAÇÃO DO GITHUB ISSUES, AGUARDAR RESPOSTA MACA@ECA].

**Tabela "wp_lcdr_relationships"**

É a tabela que armazena as relações entre as entidades do sistema.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-relationships.json}}

A coluna `rel_id` armazena a ID única da relação, campo utilizado para facilitar comandos SQL como edição e remoção; `subject` e `object` armazenam as IDs das entidades presentes na tabela _wp_lcdr_entities_; a coluna `predicate` armazena o tipo de relação possível entre as duas entidades, por exemplo, se a entidade "A" é uma parte da entidade "B", a coluna `predicate` armazenará o valor `part_of`; e, por fim, a coluna `rel_order` que armazena a ordem de exibição da relação na UI no caso de haver mais de uma relação entre entidades e predicados iguais. Por exemplo, se a entidade "A" é uma parte da entidade "B" e a entidade "C" também é uma parte da entidade "B", a coluna `rel_order` armazenará o valor "0" para a relação entre "A" e "B" e o valor "1" para a relação entre "C" e "B", usando indexação a partir do valor "0" como padrão em linguagens de programação.

Criamos também outras duas tabelas, uma para definir o histórico de edições de cada registro e uma para definir as configurações do sistema.

**Tabela "wp_lcdr_history"**

Armazena o histórico de edições das entidades.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-history.json}}

A coluna `history_id` armazena a ID do evento de edição, enquanto _type_ contextualiza que tipo de evento é este, podendo ser `Creation`, `Edition` ou `Exclusion`. Em `timestamp` registramos o carimbo de data e hora em que o evento ocorreu. As colunas `entity_id` e `user_id` armazenam a ID da Entidade que sofreu a edição e a ID do Usuário que realizou a edição, respectivamente. Em `property` armazenamos o nome da propriedade que foi editada, `related_event` registra a ID de outro evento de edição, caso este evento seja uma edição de uma edição, como por exemplo o ato de voltar a um ponto anterior. Em `previous` e `current` armazenamos o valor anterior e atual da propriedade editada.

**Tabela "wp_lcdr_options"**

É a tabela que armazena as configurações do sistema, segue uma estrutura semelhante à tabela "wp_options" do WordPress.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-options.json}}

Em `id` armazenamos a ID da opção, `name` e `value` registram o nome e o valor da opção, respectivamente. Nesta tabela armazenamos as opções que podem ser reutilizadas por todo o sistema, como _tokens_ de autenticação com APIs externas, por exemplo.

**Tabela "wp_lcdr_procedures"**

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-procedures.json}}

Tabela para armazenar as entidades `Procedure` que descrevem os procedimentos Spectrum, o `type` demonstra qual procedimento do Spectrum está sendo criado e, o sistema se encarrega de, por meio da interface de mapeamento, definir quais metadados e como devem ser preenchidos para cada procedimento e em cada entidade. Por exemplo, o procedimento para Entrada de Objetos define as informações de identificação, descrição e de entrada do objeto como obrigatórias, e as de Entrada de Empréstimos como opcionais, dependendo do tipo de entrada de objeto sendo descrita, o sistema se encarrega de buscar como os metadados devem ser preenchidos usando a interface de mapeamento e as tabelas descritas a seguir, e retorna quais metadados do Linked Art devem ser preenchidos e em qual esquema, o `Object` criado em seguida é armazenado na tabela "wp_lcdr_entity" e a relação entre `Object` e `Procedure` na tabela "wp_lcdr_procedure_entity". Em `description` registramos uma descrição do procedimento, e em `created` e `modified` registramos as datas de criação e modificação do procedimento, respectivamente. `author` registra a ID do usuário que criou o procedimento e em `status` os valores podem ser `draft`, `active`, `inactive`, `deleted`, `pending`, `scheduled`. Por fim a coluna `schedule` armazena um objeto `Schedule` opcional que define o agendamento de um procedimento, por exemplo, se o procedimento deve ser realizado em uma data específica, ou se deve ser repetido a cada semana, mês ou ano, por exemplo.

**Tabela "wp_lcdr_procedure_entity"**

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-procedure-entity.json}}

**Tabela "wp_lcdr_mapping"**

É a tabela que registra as informações de mapeamento do modelo de dados para outros modelos externos. Esta tabela é utilizada pela interface de mapeamento do sistema, e permite que o usuário adicione novos mapeamentos de acordo com sua necessidade. Os mapeamentos são majoritariamente utilizados nas funções de exportação e importação de dados do sistema. <!--, mas também podem ser utilizados para outras finalidades, como por exemplo, na UI em que o usuário tem acesso às informações de mapeamento para facilitar a criação de novos registros.-->

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-mapping.json}}

A coluna `mapping_id` é a ID do mapeamento; `name` registra, assim como em "wp_lcdr_entities", o nome do mapeamento em _kebab-case_; `title` registra o título do mapeamento; a descrição do mapeamento pode ser registrada em `description`; e, por fim, `created` e `modified` registram as datas de criação e modificação do mapeamento, respectivamente.

**Tabela "wp_lcdr_prop_map"**

Tabela para armazenar as propriedades mapeadas do modelo de dados para outros modelos externos.

{{table:elucidario/mdorim/mysql/tabela-wp-lcdr-prop-map.json}}

A coluna `map_id` registra a ID do mapeamento de uma propriedade; já `mapping_id` registra a ID do mapeamento (wp_lcdr_mapping) ao qual a propriedade pertence; `description` registra uma descrição opcional sobre o mapeamento; `prop_name` e `entity_type` registram o nome da propriedade mapeada e o tipo da entidade que utiliza determinada propriedade; `external_prop_name`, `external_prop_description`, `external_prop_uri` e `external_prop_type` registram o nome, a descrição, a URI e o tipo da propriedade mapeada, respectivamente; `editable` é um valor booleano que registra se o mapeamento pode ser editado ou não no contexto de edição de uma entidade, isso habilita o usuário a sobrescrever o valor do mapeamento no momento da edição de uma entidade; em `status` registramos o status do mapeamento, podendo ser _active_ ou _inactive_; e, por fim, em `map_value` registramos os valores padrão do mapeamento, que podem ser utilizados para preencher automaticamente o valor de uma propriedade no momento da criação de uma entidade, por exemplo, se estamos mapeando a propriedade `identified_by` do Linked Art para o metadado `title` do Dublin Core, podemos definir um valor padrão para `classified_as` do objeto `Identifier` com a uri `http://purl.org/dc/elements/1.1/title` do Dublin Core e `aat:300417209` (_full titles_) no AAT:

{{code:elucidario/mdorim/mysql/mdorim-prop-map.json}}

No Linked Art, a propriedade `identified_by` deve receber obrigatoriamente um valor para `content`, mas como no nosso mapeamento estamos criando valores pré-preenchidos, deixamos que o usuário preencha o restante das informações, e usamos os valores preenchidos previamente para popular a UI.

Podemos representar as tabelas definidas anteriormente em um diagrama de entidade e relacionamento, como mostrado na figura a seguir:

{{mermaid:elucidario/mdorim/mysql/mysql.md}}

A tabela "wp_users" é a tabela padrão do WordPress para armazenamento das informações sobre os usuários do sistema, esta tabela possui uma relação de um para vários com a tabela "wp_lcdr_entities", ou seja, um usuário pode ter várias entidades, mas uma entidade só pode ter um usuário, este tipo de relação também se aplica à tabela "wp_lcdr_history", em que um usuário pode ter várias edições, mas uma edição só pode ter um usuário. A tabela "wp_lcdr_relationships" pode ter uma relação de vários para vários com a tabela "wp_lcdr_entities", ou seja, uma entidade pode ter várias relações, e uma relação pode ter duas entidades. As tabela "wp_lcdr_mapping" e "wp_lcdr_prop_map" possum relação de vários para um, em que uma entidade `Mapping` pode conter diversos `PropMap`, enquanto o `ProMap` se relaciona com somente um `Mapping`. Já a tabela "wp_lcdr_options" não possui relação com nenhuma outra tabela e opera de forma independente.
