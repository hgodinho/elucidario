O modelo de dados é composto por um conjunto de metadados que definem as entidades e fluxos de trabalho utilizados pelo sistema. Os metadados são definidos utilizando o JSON-Schema [@droettboom2023], que permite a definição e validação de tipos de dados e suas propriedades.

Um esquema em JSON-Schema pode ser definido da seguinte forma:

**{{count:figures;legend=Exemplo de JSON-Schema descrevendo os metadados para validação da representação de uma pessoa}}**

{{code:elucidario/mdorim/json-schema-example.json}}

**Fonte**: Elaborado pelo autor.

Tudo que está posicionado à esquerda dos dois pontos (:), é uma propriedade do objeto, também chamada de chave (_key_); e, tudo que está posicionado à direita é o valor da propriedade. No exemplo acima, a chave `$schema` define a versão do JSON-Schema utilizado, em nosso modelo utilizamos a versão `draft-4` por ser a versão utilizada pelo WordPress. As propriedades `title` e `type` define o título e o tipo de dado definido no esquema, como no exemplo estamos definindo um tipo `Person`, o valor de `type` é `object`. Em `properties` definimos as propriedades, em que cada uma é definida por um outro tipo de dado: `name` é uma `string` e `age` é uma `integer`. A chave `required` define as que são obrigatórias, em que `name` é obrigatório e `age`, como não está definido, é opcional. `additionalProperties` define se o objeto pode ter propriedades adicionais que não foram definidas previamente no esquema, neste caso definimos como `false`, ou seja, não pode ter propriedades adicionais.

Uma pessoa pode ter sua representação validada utilizando este esquema da seguinte forma:

**{{count:figures;legend=Exemplo de JSON representando uma pessoa}}**

{{code:elucidario/mdorim/json-schema-example-person.json}}

**Fonte**: Elaborado pelo autor.

O JSON-Schema também apresenta propriedades que permitem a reutilização de definições. A chave `definitions` pode ser utilizada para descrever diversos metadados diferentes, enquanto a chave `$ref` permite a referência por meio de uma URI à um metadado definido previamente. No exemplo abaixo, definimos um esquema primário que contém as definições dos metadados utilizados no sistema, e em seguida definimos um tipo `Person` que utiliza a propriedade `$ref` para referenciar suas propriedades `name` e `age`:

**{{count:figures;legend=Exemplo de JSON-Schema contendo a propriedade "definitions"}}**

{{code:elucidario/mdorim/json-schema-example-definitions.json}}

**Fonte**: Elaborado pelo autor.

**{{count:figures;legend=Exemplo de JSON-Schema contendo a propriedade "$ref" se referenciando ao exemplo anterior}}**

{{code:elucidario/mdorim/json-schema-example-ref.json}}

**Fonte**: Elaborado pelo autor.

Perceba que agora em cada JSON também utilizamos a propriedade `$id` como uma URI que identifica o esquema definido. Dessa forma conseguimos realizar a referência entre os esquemas por meio de suas URIs o que garante uma maior consistência das estruturas dos dados e evita a duplicação de definições.

O modelo é dividido em seis partes:

1. **Usuários e níveis de permissão**: Definição dos usuários e seus níveis de permissão;
2. **Entidades**: Definição das entidades utilizadas no modelo (Linked Art);
3. **Procedimentos**: Definição dos fluxos de trabalho utilizados no modelo (Spectrum);
4. **Mapeamento**:  Entidade especial no modelo para descrever o mapeamento entre modelos de dados externos e o Linked Art;
5. **Histórico de edições**: Definição do histórico de edições das propriedades e relações das entidades;
6. **Opções**: Definição das configurações do sistema;

A seguir apresentamos uma visão geral do modelo com todas as entidades, procedimentos, opções, mapeamentos e usuários. A figura 8 foi gerada utilizando a ferramenta Mermaid [@sveidqvist2023].

{{mermaid:elucidario/mdorim/mermaid.md}}

A figura 8 demonstra o Mdorim como um todo, em cinza vemos as entidades principais do modelo que foram importadas do Linked Art; na cor vinho e com formato circular vemos os procedimentos que também tem sua rota no modelo; em preto vemos a entidade `Option` e suas possibilidades de uso; em vermelho os usuários e os níveis de permissão; em roxo a entidade `History` e, por fim, em marrom o mapeamentos e suas propriedades.

O modelo estende o sistema de criação de usuários do WordPress e apresenta quatro novos tipos de usuários além do Admin (`administrator`) e Público (`public`), são eles: Curadoria (`curator`), Museologia (`museologist`), Assistência (`assistant`) e Pesquisa (`researcher`), o modelo também introduz quatro novos grupos de capacidades de usuários, sendo eles: `entities`, `procedures`, `mapping` e `options`. Cada grupo de capacidade é composto por uma lista de capacidades para operações CRUD (_Create, Read, Update and Delete_) de cada entidade, procedimento, mapeamento e configuração do sistema, respectivamente. O quadro a seguir apresenta os tipos de usuário e os grupos de capacidades de cada um:

{{table:elucidario/mdorim/modelo/user-capacity.json}}

As capacidades no modelo são definidas concatenando o tipo de capacidade com o grupo a que pertence, por exemplo: `create_entities` para criar uma entidade, `see_procedures` para ler um procedimento, `edit_mapping` para editar um mapeamento e `delete_option` para deletar uma configuração do sistema.

O usuário `admin` tem acesso total ao sistema e tem todas as capacidades de administrador do WordPress, como adicionar e remover plugins—inclusive o Elucidário.art, portanto somente este usuário tem este nível de acesso—, modificar configurações de domínio, estrutura de links e entre outras. Os tipos `curator` e `museologist` são usuários com acesso total ao modelo, mas somente a capacidade de criar, deletar e listar usuários é herdada do WordPress. Já `assistant` pode ver, criar, editar a própria, editar o de outro usuário, editar publicado e deletar o próprio, enquanto o `researcher` pode somente ver, criar, editar o próprio e editar o de outros. O último tipo de usuário é o `public` e tem somente acesso de leitura aos dados, portanto os usuários que tem algum tipo de permissão superior a `public` precisam estar autenticados e ter a devida autorização para realizar qualquer ação além de ler os dados que tem acesso. Como utilizamos as Entidades do Linked Art em nosso modelo e o Linked Art apresenta somente o método HTTP `GET` para leitura [@linked-art2021.27], o Elucidário.art adiciona os outros métodos para obtermos uma interação completa com o modelo.

As nomenclaturas do modelo, como nome de entidades, objetos e propriedades foram mantidas em inglês para manter a consistência entre o idioma usado nas linguagens de programação e a API do modelo.

O modelo apresenta duas formas de interação com seus dados: leitura e escrita, que se referem ao tipo de requisição feita à API do modelo. No contexto de leitura, as requisições HTTP são feitas utilizando o método `GET` e no contexto de escrita, as requisições são feitas utilizando os métodos `POST`, `PUT` ou `DELETE` (criação, edição e remoção respectivamente).

<!-- LEITURA -->

No contexto de leitura os dados podem ser retornados em dois formatos diferentes, o primeiro segue o formato do Mdorim, em que as entidades relacionadas são definidas por meio de IDs e uma propriedade `_links` contendo um `array` com a URI da entidades relacionadas e/ou uma propriedade `_embedded` que contém todos dados de uma entidade relacionada [@word-press9999]. O formato do WordPress é o padrão da REST-API do Mdorim, portanto não é necessário adicionar o cabeçalho `Accept` na requisição. O segundo segue o formato JSON-LD utilizando o perfil do Linked Art como modelo de interoperabilidade, isso significa que as relações com outras entidades estão definidas por meio de um objeto `Ref` que contém a URI, um rótulo e o tipo da entidade relacionada. A requisição feita ao _endpoint_ deve conter um cabeçalho `Accept` com o valor `application/ld+json;profile="https://linked.art/ns/v1/linked-art.json"` [@linked-art2021.27].

**{{count:figures;legend=Resposta a uma requisição contendo o metadado classified_as da entidade Object no contexto de leitura do WordPress utilizando somente a propriedade _links}}**

{{code:elucidario/mdorim/modelo/json-schema-example-object-read-wp.json}}

**Fonte**: Elaborado pelo autor.

Neste contexto, o Elucidário.art retorna uma lista de ID das entidades `Concepts` registradas. Para cada ID é possível acessar a URI da entidade relacionada por meio da propriedade `_links`.

**{{count:figures;legend=Resposta a uma requisição contendo o metadado classified_as da entidade Object no contexto de leitura do content-type WordPress utilizando as propriedades \`_links\` e \`_embedded\`}}**

{{code:elucidario/mdorim/modelo/json-schema-example-object-read-wp-embedded.json}}

**Fonte**: Elaborado pelo autor.

Quando um objeto da propriedade link for marcado como `embeddable: true`, o Elucidário.art retorna os dados da entidade relacionada na mesma resposta da requisição, na propriedade `_embedded`.

**{{count:figures;legend=Resposta a uma requisição contendo o metadado classified_as da entidade Object no contexto de leitura do content-type Linked Art}}**

{{code:elucidario/mdorim/modelo/json-schema-example-object-read-la.json}}

**Fonte**: Elaborado pelo autor.

A resposta da requisição no formato Linked Art retorna um `array` do objeto `Ref` que contém, cada um dos elementos, a URI, a label e o tipo da entidade relacionada.

<!-- ESCRITA -->

Já no contexto de escrita a definição das relações são definidas pelas IDs das entidades:

**{{count:figures;legend=Requisição de escrita contendo o metadado classified_as da entidade Object no content-type WordPress}}**

{{code:elucidario/mdorim/modelo/json-schema-example-object-write-wp.json}}

**Fonte**: Elaborado pelo autor.

Neste exemplo, a requisição de escrita para o metadado `classified_as` contem apenas um `array` de IDs numéricas que representam as ID de cada `Concept` sendo referenciado.

A URI para realizar uma requisição a API do modelo segue a mesma lógica do WordPress [@word-press9999.1], utilizamos a rota principal `/wp-json/` e adicionamos uma nova rota `/lcdr/v1/` para identificar a API do Elucidário.art, em que `lcdr` é uma abreviação e `v1` é a versão da API, ficando com a rota principal do modelo em: `{protocolo}://{dominio}/wp-json/lcdr/v1/`. O protocolo pode ser tanto `http` quanto `https`, embora seja recomendado o uso de `https` para garantir a criptografia das informações. O domínio é o endereço do site, por exemplo: `elucidario.art` ou `emaklabin.org.br`, e as rotas definem as entidades e as ações que podem ser realizadas, por exemplo, `/lcdr/v1/objects` para obter uma lista de `Objects` armazenados no sistema.

As rotas finais são definidas pelo idioma selecionado nas configurações do WordPress, por exemplo, a entidade `Concept` com o WordPress configurado em português teria a rota `lcdr/v1/conceitos` para requisições de listas de conceitos armazenados no sistema e `lcdr/v1/conceitos/{id}` para requisições de um conceito específico. A tabela a seguir apresenta as rotas definidas para cada entidade do modelo, juntamente com os métodos HTTP e uma breve descrição.

{{table:elucidario/mdorim/modelo/model-endpoint.json}}

As entidades principais do modelo seguem as mesmas do Linked Art (Ver capítulo 6), portanto possuem todas suas propriedades e mais as descritas a seguir. São elas: `Concept`, `Digital`, `Event`, `Provenance`, `Group`, `Person`, `Object`, `Place`, `Set`, `Textual` e `Visual`.

{{table:elucidario/mdorim/modelo/model-entity.json}}

Também introduzimos uma entidade chamada `Option`, que representa uma opção do sistema. Esta entidade possui uma ID, um nome, um valor e um esquema em JSON-Schema para validação. As opções são utilizadas para definir as configurações do sistema, como por exemplo, o idioma padrão, o número de itens por página, etc. Cada opção tem seu esquema definido no código-fonte e vai variar de acordo com o tipo de dado que ela representa.

{{table:elucidario/mdorim/modelo/model-option.json}}

Já os procedimentos possíveis entre as entidades são baseados no padrão Spectrum, em que cada procedimento é definido por uma série de etapas para documentar determinado evento a um objeto.  Os procedimentos de Planejamento da documentação e Catalogação foram omitidos nesta versão do modelo, pois acreditamos que correspondem ao Elucidário.art como um todo e que sua representação pode se tornar bastante complexa. Uma opção futura para estes procedimentos seria explorar visualizações de dados em que poderíamos representar o fluxo de trabalho de cada procedimento, por exemplo, utilizando um diagrama de Gantt.

{{table:elucidario/mdorim/modelo/model-procedure.json}}

O histórico de edições do modelo consiste em uma entidade chamada `History` que intercepta as ações de criação, edição e remoção de entidades e registra informações que permitem a auditoria e recuperação de informações adicionadas anteriormente no caso de edições erradas. Uma entidade sempre conterá um objeto `History` descrevendo seu histórico de edições.

Diferentemente das outras entidades, `History` somente expõe o método `GET` para leitura, não sendo possível criar, editar ou remover um `History`, ou seja, o usuário nunca manipulará diretamente esta entidade, mas sim como consequência de uma ação realizada no sistema de forma programática.

O `History` é composto por uma série de objetos `HistoryEvent` que representam cada uma das ações realizadas na entidade. Cada `HistoryEvent` contém a data e hora da ação, o tipo de ação, o usuário que realizou a ação, o ID da entidade e o conteúdo da propriedade antes e depois da ação. O conteúdo é armazenado em formato JSON e é utilizado para recuperar o estado anterior da entidade.

{{table:elucidario/mdorim/modelo/model-history.json}}

{{table:elucidario/mdorim/modelo/model-history-event.json}}

A interface de mapeamento também é baseada em JSON-Schema, com o intuito de oferecer ao usuário uma maneira de criar seus próprios mapeamentos dentro do Elucidário.art. A interface é utilizada para as funções de importação e exportação de dado, e também oferecem mais contexto à UI dando uma referência ao usuário de possíveis mapeamentos pertencentes ao campo que está preenchendo.

{{table:elucidario/mdorim/modelo/model-mapping.json}}

{{table:elucidario/mdorim/modelo/model-prop-map.json}}

A propriedade `map_value` do objeto `PropMap` registra um valor padrão que pode ser utilizado para preencher automaticamente os campos de informação no momento da criação de uma entidade, por exemplo, se estamos tentando representar o metadado `title` do Dublin Core utilizando a propriedade `identified_by` do Linked Art, podemos definir um valor padrão para `classified_as` no objeto `Identifier` com a URI `http://purl.org/dc/elements/1.1/title` do Dublin Core e `aat:300417209` (_full titles_) no AAT:

{{code:elucidario/mdorim/mysql/mdorim-prop-map.json}}

No Linked Art, a propriedade `identified_by` deve receber obrigatoriamente um valor para `content`, mas como no nosso mapeamento estamos criando valores pré-preenchidos, deixamos que o usuário preencha o restante das informações e usamos os valores preenchidos previamente para popular a UI.
