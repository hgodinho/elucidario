A seguir falaremos sobre a segunda parte do Mdorim, **o Modelo.**

O modelo de dados é composto por um conjunto de metadados que definem as entidades e fluxos de trabalho utilizados pelo sistema. Os metadados são definidos utilizando o JSON-Schema, um esquema que permite a definição e validação de tipos de dados e suas propriedades.

Um esquema em JSON-Schema pode ser definido da seguinte forma:

{{code:elucidario/mdorim/json-schema-example.json}}

Tudo que está posicionado à esquerda dos dois pontos ":" é uma propriedade do objeto, também chamada de chave (_key_); e, tudo que está posicionado à direita é o valor da propriedade. No exemplo acima, a chave `$schema` define a versão do JSON-Schema utilizado, em nosso modelo utilizamos a versão 4 por ser a versão utilizada pelo WordPress. `title` e `type` define o título e o tipo de dado definido no esquema, como no exemplo estamos definindo um tipo "_Person_", o valor de `type` é _object_. `properties` define as propriedades do tipo "_Person_", em que cada propriedade é definida por um outro tipo de dado: `name` é uma _string_ e `age` é uma _integer_. `required` define as propriedades obrigatórias para o tipo "_Person_", em que `name` é obrigatório e `age`, como não está definido, é opcional. `additionalProperties` define se o tipo "_Person_" pode ter propriedades adicionais que não foram definidas previamente no esquema, neste caso definimos como _false_, ou seja, o tipo "_Person_" não pode ter propriedades adicionais.

Uma pessoa pode ser representada e validada utilizando este esquema da seguinte forma:

{{code:elucidario/mdorim/json-schema-example-person.json}}

O JSON-Schema também apresenta propriedades que permitem a reutilização de definições. A chave `definitions` pode ser utilizada para descrever diversos metadados diferentes, enquanto a chave `$ref` permite a referência por meio de uma URI à um metadado definido previamente. No exemplo abaixo, definimos um esquema primário que contém as definições dos metadados utilizados no sistema, e em seguida definimos um tipo "_Person_" que utiliza a propriedade `$ref` para referenciar suas propriedades `name` e `age`:

{{code:elucidario/mdorim/json-schema-example-definitions.json}}

{{code:elucidario/mdorim/json-schema-example-ref.json}}

Perceba que agora em cada JSON também utilizamos a propriedade `$id` como uma URI que identifica o esquema definido. Dessa forma conseguimos realizar a referência entre os esquemas por meio de suas URIs o que garante uma maior consistência das estruturas dos dados e evita a duplicação de definições.

Como vimos anteriormente, o Mdorim se baseia no Linked Art, portanto utilizamos suas entidades e propriedades como base para a definição do modelo para uso no aplicativo Elucidário.art. As nomenclaturas do modelo, como nome de entidades, objetos e propriedades foram definidas em inglês para manter a consistência entre o idioma das linguagens de programação e a API do modelo. O modelo é dividido em quatro partes e dois contextos:

Partes:

1. **Entidades**: Definição das entidades utilizadas no modelo (Linked Art);
2. **Procedimentos**: Definição dos fluxos de trabalho utilizados no modelo (Spectrum);
3. **Histórico de edições**: Definição do histórico de edições das propriedades e relações das entidades;
4. **Configurações**: Definição das configurações do sistema;

Contextos:

1. **Leitura**: No contexto de leitura os dados podem ser retornados em dois endpoints diferentes, um similar ao formato do WordPress, em que as entidades relacionadas são definidas por meio de uma ID e uma propriedade _links_ que contém a URI da entidade relacionada ou uma propriedade _embed_ que contém os dados da entidade relacionada, dependendo do tipo de requisição realizada a REST. E, outro endpoint no formato JSON-LD utilizando o Linked Art como modelo de interoperabilidade, isso significa que as relações com outras entidades estão definidas por meio de um objeto _Ref_ que contém a URI, a label e o tipo da entidade relacionada;
2. **Escrita**: definição do esquema de escrita dos dados das entidades em que as relações são definidas pelas IDs das entidades.

As entidades definidas são: _Concept_, _Digital_, _Event_, _Provenance_, _Actor_, _Object_, _Place_, _Set_, _Textual_ ou _Visual_.

Já os procedimentos possíveis entre as entidades segue o padrão Spectrum, em que cada procedimento é definido por uma séries de etapas para documentar determinado acontecimento a um objeto museológico. Os procedimentos definidos no Mdorim seguem oito dos nove procedimentos principais do Spectrum: Entrada de objetos, Saída de objetos, Entrada de empréstimos, Saída de empréstimos, Aquisição e adesão, Inventário, Catalogação e Controle de movimentação. O nono procedimento, Planejamento da documentação, não é utilizado pelo sistema por se tratar de uma ação que engloba todas as etapas de documentação dos objetos museológicos.

O histórico de edições do modelo consiste em uma entidade chamada "History" que intercepta as ações de criação edição de entidades e registra informações que permitem a auditoria e recuperação de informações adicionadas anteriormente. As informações registradas são: data e hora da edição, usuário que realizou a edição, tipo de ação realizada (criação, edição ou exclusão), entidade que foi editada, propriedade que foi editada e valor anterior da propriedade.

{{mermaid:elucidario/mdorim/mermaid.md}}
