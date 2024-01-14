<!-- Rest  -->

O modelo apresenta duas formas de interação com seus dados: leitura e escrita, que se referem ao tipo de requisição feita à REST-API do Elucidário.art. No contexto de leitura, as requisições HTTP são feitas utilizando o método `GET` e no contexto de escrita, as requisições são feitas utilizando os métodos `POST`, `PUT` ou `DELETE` (criação, edição e remoção respectivamente).

<!-- LEITURA -->

No contexto de leitura os dados podem ser retornados em dois formatos diferentes, o primeiro segue o formato do Mdorim, em que as entidades relacionadas são definidas por meio de IDs e uma propriedade `_links` contendo um `array` com a URI da entidades relacionadas e/ou uma propriedade `_embedded` que contém todos dados de uma entidade relacionada [@word-press9999]. O formato do WordPress é o padrão da REST-API do Mdorim, portanto não é necessário adicionar o cabeçalho `Accept` na requisição. O segundo segue o formato JSON-LD utilizando o perfil do Linked Art como modelo de interoperabilidade, isso significa que as relações com outras entidades estão definidas por meio de um objeto `Ref` que contém a URI, um rótulo e o tipo da entidade relacionada. A requisição feita ao _endpoint_ deve conter um cabeçalho `Accept` com o valor `application/ld+json;profile="https://linked.art/ns/v1/linked-art.json"` [@linked-art2021.27].

**{{count:figure;legend=Resposta a uma requisição contendo o metadado classified_as da entidade Object no contexto de leitura do WordPress utilizando somente a propriedade _links}}**

{{code:internal/body/elucidario/core/rest/json-schema-example-object-read-wp.json}}

**Fonte**: Elaborado pelo autor.

Neste contexto, o Elucidário.art retorna uma lista de ID das entidades `Concepts` registradas. Para cada ID é possível acessar a URI da entidade relacionada por meio da propriedade `_links`.

**{{count:figure;legend=Resposta a uma requisição contendo o metadado classified_as da entidade Object no contexto de leitura do content-type WordPress utilizando as propriedades \`_links\` e \`_embedded\`}}**

{{code:internal/body/elucidario/core/rest/json-schema-example-object-read-wp-embedded.json}}

**Fonte**: Elaborado pelo autor.

Quando um objeto da propriedade link for marcado como `embeddable: true`, o Elucidário.art retorna os dados da entidade relacionada na mesma resposta da requisição, na propriedade `_embedded`.

**{{count:figure;legend=Resposta a uma requisição contendo o metadado classified_as da entidade Object no contexto de leitura do content-type Linked Art}}**

{{code:internal/body/elucidario/core/rest/json-schema-example-object-read-la.json}}

**Fonte**: Elaborado pelo autor.

A resposta da requisição no formato Linked Art retorna um `array` do objeto `Ref` que contém, cada um dos elementos, a URI, a label e o tipo da entidade relacionada.

<!-- ESCRITA -->

Já no contexto de escrita a definição das relações são definidas pelas IDs das entidades:

**{{count:figure;legend=Requisição de escrita contendo o metadado classified_as da entidade Object no content-type WordPress}}**

{{code:internal/body/elucidario/core/rest/json-schema-example-object-write-wp.json}}

**Fonte**: Elaborado pelo autor.

Neste exemplo, a requisição de escrita para o metadado `classified_as` contem apenas um `array` de IDs numéricas que representam as ID de cada `Concept` sendo referenciado.

A URI para realizar uma requisição a API do modelo segue a mesma lógica do WordPress [@word-press9999.1], utilizamos a rota principal `/wp-json/` e adicionamos uma nova rota `/lcdr/v1/` para identificar a API do Elucidário.art, em que `lcdr` é uma abreviação e `v1` é a versão da API, ficando com a rota principal do modelo em: `{protocolo}://{dominio}/wp-json/lcdr/v1/`. O protocolo pode ser tanto `http` quanto `https`, embora seja recomendado o uso de `https` para garantir a criptografia das informações. O domínio é o endereço do site, por exemplo: `elucidario.art` ou `emaklabin.org.br`, e as rotas definem as entidades e as ações que podem ser realizadas, por exemplo, `/lcdr/v1/objects` para obter uma lista de `Objects` armazenados no sistema.

As rotas finais são definidas pelo idioma selecionado nas configurações do WordPress, por exemplo, a entidade `Concept` com o WordPress configurado em português teria a rota `lcdr/v1/conceitos` para requisições de listas de conceitos armazenados no sistema e `lcdr/v1/conceitos/{id}` para requisições de um conceito específico. A tabela a seguir apresenta as rotas definidas para cada entidade do modelo, juntamente com os métodos HTTP e uma breve descrição.

{{table:internal/body/elucidario/core/rest/endpoints.json}}

Todos as operações CRUD da REST-API passam por um processo de validação como definido no pacote `@elucidario/pkg-mdorim`, que é responsável por assegurar que os dados recebidos estão no formato correto e que não estamos recebendo códigos maliciosos que podem prejudicar o sistema.
