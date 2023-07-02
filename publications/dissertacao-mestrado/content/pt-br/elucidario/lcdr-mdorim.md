### 9.1.1 @elucidario/pkg-mdorim

O Modelo de Dados para Organização e Representação da Informação Museológica (MDORIM), é o modelo de dados criado para ser utilizado pelo aplicativo Elucidário.art, que utiliza como base principal o Linked Art com algumas modificações para o contexto de uso do WordPress.

Para definição do modelo utilizamos JSON-Schema, diagramas de entidade e relacionamento e tabelas para melhor compreensão de suas classes e propriedades.

JSON-Schema [@droettboom2023] é um vocabulário que permite a definição de dados estruturados em JSON, que pode ser utilizado para validação dos tipos de dados recebidos ou enviados por uma API e entre outros usos. Nele conseguimos definir tipos primitivos como _string_, _number_, _boolean_, _array_, _object_, _null_, além de tipos personalizados e mais complexos que podem ser definidos a partir de outros tipos, como por exemplo, um tipo "Person", definido a partir de um tipo _object_ que possui as propriedades descritivas de uma pessoa como "nome", "descricao", "endereco", etc.

Um esquema em JSON-Schema pode ser definido da seguinte forma:

{{code:mdorim/json-schema-example.json}}

`$schema` define a versão do JSON-Schema utilizado, em nosso modelo utilizamos a versão 4 por ser a versão utilizada pelo WordPress. `title` e `type` define o título e o tipo de dado definido no esquema, como no exemplo estamos definindo um tipo "Person", o valor de `type` é _object_. `properties` define as propriedades do tipo "Person", em que cada propriedade é definida por um outro tipo de dado: `name` é uma _string_ e `age` é uma _integer_. `required` define as propriedades obrigatórias para o tipo "Person", neste caso `name` é obrigatório e `age` é opcional. `additionalProperties` define se o tipo "Person" pode ter propriedades adicionais que não foram definidas no esquema, neste caso definimos como _false_, ou seja, o tipo "Person" não pode ter propriedades adicionais.

Uma pessoa poderia ser representada utilizando este schema da seguinte forma:

{{code:mdorim/json-schema-example-person.json}}

Além disso, o JSON-Schema apresenta outras propriedades que permitem a reutilização de definições. A propriedade `definitions` pode ser utilizada para descrever diversos tipos de dados diferentes, enquanto a propriedade `$ref` permite a referência à um tipo de dado definido previamente por meio de uma URI. No exemplo abaixo, definimos um arquivo central que contém as definições dos metadados utilizados no sistema, e em seguida definimos um tipo "Person" que utiliza a propriedade `$ref` para referenciar suas propriedades `name` e `age`:

{{code:mdorim/json-schema-example-definitions.json}}

{{code:mdorim/json-schema-example-ref.json}}

Perceba que agora em cada JSON definimos também uma propriedade `$id` que é uma URI que identifica o esquema definido. Dessa forma conseguimos realizar a referência entre os esquemas por meio de suas URIs o que garante uma maior consistência das estruturas dos dados e evita a duplicação de definições.

Como o JSON-Schema não foi criado para ser utilizado por usuários finais, mas sim por desenvolvedores e máquinas, o vocabulário não possui suporte para localização das strings "title" e "description", portanto no JSON-Schema essas propriedades devem ser escritas em inglês, fato que impôs um desafio ao seu uso para gerar a UI, uma vez que devemos dar suporte à outros idiomas como português e espanhol. Para resolver esse problema, criamos um arquivo JSON paralelo que mapeia cada propriedade do MDORIM à um objeto que permite a internacionalização (i18n) dos textos para a UI, como o nome da propriedade, descrição, mensagens de erro e sucesso, etc. Este objeto também contém uma propriedade `component` que permite a definição de um componente React específico para a renderização desta propriedade no MDORIM, essa função é útil no caso de algumas exceções em que não foi utilizado o mapeamento definido na seção 9.2.2 Design System (json-schema -> HTML), mas sim foi realizada a criação de um componente próprio para renderização e edição desta propriedade. Este objeto pode ser descrito em JSON-Schema da seguinte forma:

**Quadro X - JSON-UI: Esquema declarativo para mapeamento de modelos de dados definidos em JSON-Schema e Interfaces de Usuário**

{{code:../../../../../packages/mdorim/src/schemas/json-ui/schema.json}}

Fonte: Elaborado pelo autor.

Em `definitions`, definimos um objeto `localizedString` que contém as propriedades `lang` e `content`, ambas obrigatórias. A propriedade `lang` deve seguir a RFC 5646[^1] e a propriedade `content` deve ser uma string no idioma definido em `lang`.

A propriedade `patternProperties` define o padrão de nome de cada propriedade do MDORIM para o mapeamento, no caso utilizamos o padrão Regex[^1] `^_?[a-z][a-z0-9_]*$`, em que:

-   `^_?` - a propriedade pode iniciar com o caractere "\_" opcionalmente;
-   `[a-z]` - a propriedade deve iniciar com uma letra minúscula;
-   `[a-z0-9_]*$` - a propriedade pode conter letras minúsculas, números e o caractere "\_";

Com este padrão conseguimos selecionar qualquer nome de propriedade do MDORIM, incluindo as propriedades que iniciam com "\_" utilizadas internamente pelo sistema. Cada propriedade deve conter um objeto que define as seguintes propriedades:

-   `label`: _array_ de objetos `localizedString` que definem o nome da propriedade em diferentes idiomas;
-   `description`: _array_ de objetos `localizedString` que definem a descrição da propriedade em diferentes idiomas;
-   `messages`: _array_ de objetos que possuem as propriedades `code`, `type` e `content`, em que `code` é o código da mensagem, `type` é o tipo da mensagem (_error_, _success_, _warning_, _info_) e `content` é um _array_ de objetos `localizedString` que definem a mensagem em diferentes idiomas;
-   `component`: _string_ que define o nome do componente React que será utilizado para renderização e edição do metadado, esta propriedade tem prioridade acima do tipo definido em "type" no JSON-Schema.

Utilizando este esquema, o metadado "identified_by" do Linked Art pode ser traduzido da seguinte forma:

{{code:../../../../../packages/mdorim/src/translations/identified_by.json}}

Os esquemas apresentados do MDORIM foram estruturados considerando dois usos distintos: armazenamento e distribuição. O primeiro é utilizado para armazenar os metadados no banco de dados e é adaptado ao contexto de uso do WordPress, ou seja em Banco de Dados Relacional, em que diferentemente do Linked Art que referenciamos outra entidade por sua URI, no armazenamento referenciamos pela ID única que define a linha na tabela do banco de dados, além de que o registro de relações entre entidades é feito em tabelas MySQL dedicadas para relacionamentos, e não na tabela onde definimos as principais características de uma entidade. O segundo é utilizado para distribuição dos dados, e é onde seguimos exatamente o Linked Art que define o formato da API para interoperabilidade, acrescentando outras classes e propriedades referentes ao funcionamento do sistema como um todo, como por exemplo, usuários, configurações, histórico de edições, entre outros. Essa separação é necessária para que possamos definir o modelo de dados de forma independente do contexto de uso, e assim garantir a interoperabilidade dos dados.

Apresentamos a seguir o modelo que consiste de XX entidades e YY propriedades, utilizando dois contextos de uso: distribuição na propriedade `definitions`, e armazenamento no objeto principal do JSON-Schema.

{{mermaid:mdorim/classes-mdorim.md}}

<!-- O Modelo de Dados para Organização e Representação da Informação Museológica (MDORIM), modelo de dados utilizado pelo Elucidário.art, utiliza como base principal o Linked Art, modelo de dados para aplicações criada por um grupo de trabalho de mesmo nome no CIDOC-ICOM.

É inteiramente baseado no modelo de dados para aplicações Linked Art , porém apresenta algumas modificações para o contexto de uso do WordPress e adiciona novas classes e propriedades como histórico de edições, usuários e capacidades de usuários, configurações, entre outras.

Para a definição do modelo utilizaremos JSON-Schema, a apresentação também será realizada em Diagrama de Entidade e Relacionamento e tabelas para melhor compreensão de suas classes e propriedades.

Descrevemos o modelo a seguir.

### Classes

Para a definição das classes do MDORIM herdaremos os endpoints do Linked Art e suas propriedades, mas as definiremos de duas formas: para armazenamento e para distribuição. As classes para armazenamento são utilizadas para armazenar os dados no banco de dados e são adaptadas ao contexto de uso do WordPress, ou seja em Banco de Dados Relacional, em que diferentemente do Linked Art que referenciamos outra entidade por sua URI, no armazenamento referenciamos pela ID única que define a linha na tabela do banco de dados. -->

---

[^1]: https://regex101.com/r/4Q0X2A/1
