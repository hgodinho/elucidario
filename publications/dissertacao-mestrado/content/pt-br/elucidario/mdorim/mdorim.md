### 9.1.1 @elucidario/pkg-mdorim

**Escopo**

O Modelo de Dados para Organização e Representação da Informação Museológica (Mdorim) foi desenvolvido para ser utilizado pelo plugin Elucidário.art, e utiliza como base principal o Linked Art e os procedimentos Spectrum para definição das entidades e fluxos de trabalhos utilizados no sistema, além de apresentar uma estrutura de dados para armazenamento dos metadados no banco de dados MySQL, e um mapeamento entre Linked Art e Spectrum.

**Descrição**

O Mdorim é dividido em quatro partes principais:

1. MySQL Schema: Esquema de banco de dados MySQL para armazenamento dos dados;
2. Modelo: Modelo de dados para representação das entidades e fluxos de trabalho baseados nos contextos de uso do sistema;
3. Traduções: Traduções dos metadados do modelo para português, espanhol e inglês;
4. Mapeamento: Mapeamento do modelo para outros modelos de dados.

Com exceção da primeira, o MsSQL Schema, que utiliza o próprio formato do MySQL para representação de sua estruturas, as demais partes do Mdorim utilizam o formato JSON-Schema para sua representação O JSON-Schema [@droettboom2023] é um vocabulário que permite a definição e validação de dados estruturados em JSON. Com ele conseguimos definir tipos primitivos como _string_, _number_, _boolean_, _array_, _object_, _null_, além de tipos personalizados e mais complexos que podem ser definidos a partir de outros tipos, como por exemplo, um tipo "Person", definido a partir de um _object_ que possui as propriedades descritivas de uma pessoa como "nome", "idade", "endereço", etc.

Um esquema em JSON-Schema pode ser definido da seguinte forma:

{{code:elucidario/mdorim/json-schema-example.json}}

Tudo que está posicionado à esquerda dos dois pontos ":" é uma propriedade do objeto, também chamada de chave (_key_); e, tudo que está posicionado à direita é o valor da propriedade. No exemplo acima, a chave `$schema` define a versão do JSON-Schema utilizado, em nosso modelo utilizamos a versão 4 por ser a versão utilizada pelo WordPress. `title` e `type` define o título e o tipo de dado definido no esquema, como no exemplo estamos definindo um tipo "_Person_", o valor de `type` é _object_. `properties` define as propriedades do tipo "_Person_", em que cada propriedade é definida por um outro tipo de dado: `name` é uma _string_ e `age` é uma _integer_. `required` define as propriedades obrigatórias para o tipo "_Person_", em que `name` é obrigatório e `age`, como não está definido, é opcional. `additionalProperties` define se o tipo "_Person_" pode ter propriedades adicionais que não foram definidas previamente no esquema, neste caso definimos como _false_, ou seja, o tipo "_Person_" não pode ter propriedades adicionais.

Uma pessoa pode ser representada utilizando este esquema da seguinte forma:

{{code:elucidario/mdorim/json-schema-example-person.json}}

Em seu vocabulário, o JSON-Schema também apresenta chaves que permitem a reutilização de definições. A chave `definitions` pode ser utilizada para descrever diversos metadados diferentes, enquanto a chave `$ref` permite a referência por meio de uma URI à um metadado definido previamente. No exemplo abaixo, definimos um esquema primário que contém as definições dos metadados utilizados no sistema, e em seguida definimos um tipo "_Person_" que utiliza a propriedade `$ref` para referenciar suas propriedades `name` e `age`:

{{code:elucidario/mdorim/json-schema-example-definitions.json}}

{{code:elucidario/mdorim/json-schema-example-ref.json}}

Perceba que agora em cada JSON também utilizamos a chave `$id` como uma URI que identifica o esquema definido. Dessa forma conseguimos realizar a referência entre os esquemas por meio de suas URIs o que garante uma maior consistência das estruturas dos dados e evita a duplicação de definições.
