# Linked Art

Linked Art é uma comunidade formada por representantes de instituições ao redor do mundo como The Canadian Heritage Information Network (CHIN), J. Paul Getty Trust, The Frick Collection, Europeana, Louvre, Rijksmuseum, The Victoria and Albert Museum, entre outras, com o objeto de criar um modelo compartilhado baseado em _Linked Open Data_ (LOD) para descrever Arte [@linked-art2021.1; @linked-art2021.2]. O projeto é coordenado por um quadro editorial em que Robert Sanderson (Yale University) e Emmanuelle Delmas-Glass (Yale Center for British Art) compartilham o posto de co-presidentes.

A comunidade Linked Art parte do conceito da usabilidade para a audiência correta, em que o maior público interessado em "dados" seriam os desenvolvedores que poderiam criar interfaces para o público final, desdobrando esta ideia em cinco princípios de design, temos:

1. **Abstração para a audiência correta**: desenvolvedores não precisam do mesmo acesso aos dados como os ontologistas;
2. **Poucas barreiras de entrada**: deve ser fácil começar a trabalhar com dados e construir algo: _“If it takes a long time to understand the model, ontology, sparql query syntax and so forth, then developers will look for easier targets”_ [@sanderson2018];
3. **Compreensível pela introspecção**: os dados devem ser compreensíveis pela leitura humana, usar JSON-LD é utilizar a linguagem que o desenvolvedor já compreende;
4. **Documentação com exemplos funcionais**: você nunca poderá intuir todas as regras dos dados, documentação serve para mapear os padrões que o desenvolvedor pode encontrar; e
5. **Poucas exceções em vez de vários padrões consistentes**: cada exceção em uma API é outra regra que o desenvolvedor precisa apreender: _“every exception is jarring, and requires additional code to manage. While not everything is homogenous, a set of patterns that manage exceptions well is better than many custom fields.”_ [@sanderson2018].

O modelo Linked Art tem como foco principal a descrição de recursos do patrimônio cultural artístico e atividades de museus. Para isto, o modelo utiliza um perfil do CIDOC _Conceptual Reference Model_ (CIDOC-CRM) que combina a facilidade de uso do JSON-LD com a excelência do CRM, mas reduzindo sua complexidade para um conjunto de classes e propriedades que são mais comuns em 90% dos casos de usos de 90% das organizações [@linked-art2021.3]

O Linked Art está sob desenvolvimento ativo e a versão atual é a 0.8.0 e é considerada instável, passível de mudanças. A versão 1.0.0 estava prevista para o final de 2021, mas foi atrasada por conta da pandemia de COVID-19 [@linked-art2021.4].

O modelo apresenta 11 classes, ou entidades, sendo elas [@linked-art2021.5]:

1. **Concept** - tipos, materiais, idiomas, entre outros que sejam registros completos, ao contrário de referências externas;
2. **Digital Object** - imagens, vídeos, áudios, documentos, ou outros recursos digitais;
3. **Event** - eventos e atividades não específicas que estão relacionadas, mas não são parte de outra entidade;
4. **Groups** - grupos de pessoas, organizações, ou outras entidades;
5. **People** - pessoas;
6. **Physical Object** - objetos físicos, incluindo obras de arte, artefatos, edifícios, partes de objetos, entre outros;
7. **Place** - locais;
8. **Provenance Activity** - atividades de proveniência;
9. **Sets** - conjuntos de entidades;
10. **Textual Work** - obras textuais que merecem descrição como entidades únicas, como conteúdo de livro ou artigos, entre outros; e
11. **Visual Work** - conteúdo imagético que merece descrição como entidades únicas, como a imagem exibida em uma pintura ou desenho, entre outros.

## JSON para conectar dados: JSON-LD

_JavaScript Object Notation_ (JSON) é um formato aberto de arquivo para intercâmbio de informações [@w-3-c-json-ld-working-group2014]. Consiste em arquivos de fácil leitura por humanos e máquinas com a extensão .json. Mesmo que tenha se originado na sintaxe de objetos JavaScript, por isso seu nome, pode ser utilizado por diversos ambientes e linguagens de programação diferentes devido sua sintaxe simples [@mdn-web-docs2023].

Um arquivo JSON pode ser expressado da seguinte forma:

**Exemplo 1**: JSON simples descrevendo uma obra de arte.

```json
{
    "title": "One and three chairs",
    "author": "Joseph Kosuth",
}
```

Mas o que este JSON representa para alguém não conhece o contexto artístico? O que é _"title"_ e _"author"_ para uma máquina, e quais valores eles podem receber?

_JSON for Linked Data_ (JSON-LD) busca solucionar este problema adicionando uma camada de contexto ao JSON, ao fazer um link com a definição do vocabulário utilizado [@sporny2012]. Além disso é possível adicionar um identificador ao objeto, desta forma, o mesmo arquivo, porém agora com a definição do vocabulário e sua estrutura utilizando o contexto do Linked Art, pode ser expresso da seguinte forma:

**Exemplo 2**: JSON-LD descrevendo uma obra de arte.

```json
{
    "@context": "https://linked.art/ns/v1/linked-art.json",
    "id": "https://www.moma.org/collection/works/81435",
    "_label": "One and three chairs",
    "type": "HumanMadeObject",
    "identified_by": [
        {
            "type": "Identifier",
            "_label": "One and three chairs",
            "classified_as": [
                {
                    "id": "http://vocab.getty.edu/aat/300404670",
                    "type": "Type",
                    "_label": "Primary Name"
                }
            ],
            "content": "One and three chairs"
        }
    ],
    "produced_by": {
        "type": "Production",
        "carried_out_by": [
            {
                "type": "Person",
                "id": "https://www.moma.org/artists/3228",
                "_label": "Joseph Kosuth"
            }
        ]
    }
}
```

Parece mais complexo que o exemplo anterior, e de fato é, mas agora temos um arquivo JSON que pode ser lido por humanos e máquinas, e que pode ser utilizado para conectar dados, trazendo muito mais contexto para a informação, em que: _"@context"_ é o link para o vocabulário utilizado, no caso Linked Art; "_id_" é o identificador do objeto, o link para o registro no MoMA; "_\_label_" é um rótulo para leitura pelo desenvolvedor; "_type_" é o tipo de entidade; "_identified_by_" é a propriedade para identificar a obra, recebe um array de objetos que podem ser tanto "_Name_" quanto "_Identifier_", no caso é um "_Identifier_"com o valor "_One and three chairs_" classificado como "_Title_" e referenciado à definição de "_title_" no vocabulário AAT do Getty. Por fim,"_produced_by_" é a propriedade que recebe um objeto "_Production_" que tem como propriedade "_carried_out_by_" que recebe um array de objetos "_Person_" que tem como propriedade "_id_" o link para o registro do artista no MoMA e "_\_label_" o nome do artista.

O JSON-LD fornece uma maneira de os dados JSON serem interoperáveis na escala da Web [@json-ld-working-group2020]. E, tem como principal intenção “ser uma maneira de usar Linked Data em ambientes de programação baseados na Web, para construir serviços Web interoperáveis e para armazenar Linked Data em mecanismos de armazenamento baseados em JSON” [@json-ld-working-group2020], ou seja, é o formato ideal para serviços REST.

## JSON-Schema

_JSON-Schema_ é um vocabulário que permite a descrição e validação de documentos JSON [@droettboom2020]. O JSON-Schema é um documento JSON que descreve a estrutura de um JSON, ou seja, é um documento que descreve o que um JSON pode conter, quais são os tipos de dados, quais são os valores permitidos, quais são os valores obrigatórios, entre outras informações. O JSON-Schema também é comumente utilizado para descrever e validar dados de uma API REST.

**Exemplo 3**: Descrição de um objeto com uma propriedade _name_ do tipo _string_:

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
        }
    },
}
```

em que seria possível validar o seguinte JSON:

```json
{
    "name": "One and three chairs"
}
```

Uma das principais características de um documento JSON-Schema é a possibilidade de referenciar outros _schemas_, importar suas definições e reutilizá-las. Essa característica é muito importante para a descrição de dados, pois permite a reutilização de definições de _schemas_, evitando a repetição de código e facilitando a manutenção. A referência é feita através da propriedade "$ref", que recebe uma URI ou um "_path_" [^2] que aponta para o _schema_ que será referenciado.

Utilizando o exemplo 2 como base, podemos descrever o JSON utilizando o JSON-Schema e utilizando a propriedade "$ref" da seguinte forma:

**Exemplo 4**: JSON-Schema descrevendo os metadados do Exemplo 2

```json
// object.json
{
    "$schema": "http://json-schema.org/schema#",
    "title": "Human-Made Object Schema",
    "description": "_crm:E22\\_Human-Made\\_Object_\nA human-made object, part thereof, or a natural object with value imbued through interaction with human culture.\nSee: [API](https://linked.art/api/1.0/endpoint/object/) | [Model](https://linked.art/model/object/)",
    "type": "object",
    "properties": {
        "produced_by": {
            "title": "crm:P108i_was_produced_by",
            "description": "The `Production` activity which created this object",
            "$ref": "#/definitions/Production"
        }
    },
    "definitions": {
        "Production": {
            "title": "crm:E12_Production",
            "description": "The production/creation of the object",
            "type": "object",
            "properties": {
                "carried_out_by": {
                    "$ref": "core.json#/definitions/carried_out_byProp"
                }
            }
        }
    },
    "required": ["@context", "id", "type", "_label"],
    "additionalProperties": false
}

// core.json
{
    "$schema": "http://json-schema.org/schema#",
    "title": "Core Schema Definitions",
    "description": "Core definitions that are used to compose the Linked Art JSON-LD API",
    "type": "object",
    "definitions": {
        "carried_out_byProp": {
            "title": "crm:P14_carried_out_by",
            "description": "A reference to a Person or Group which carried out this activity",
            "type": "array",
            "items": {
                "$ref": "#/definitions/PersonRefOrGroupRef"
            }
        }
    }
}
```

**Fonte**: Versões resumidas do _object.json_ e _core.json_ do Linked Art [@sanderson2021]

No exemplo 4 temos a definição de dois arquivos _json_, _object.json_ e _core.json_. O arquivo _object.json_ descreve o objeto _Human-Made Object Schema_ e o arquivo _core.json_ descreve as definições que são utilizadas para compor esta e outras classes do sistema. O arquivo _object.json_ possui uma propriedade _produced_by_ que é do tipo _Production_, definida no arquivo _object.json_ em _definitions_. _produced_by_ é uma propriedade que pode conter um ou mais valores, por isso é do tipo _array_ e cada item do _array_ é uma referência para um objeto do tipo _PersonRefOrGroupRef_, que é definido no arquivo _core.json_ (omitido nesta versão resumida).

## API REST

_API[^3] REST_ é um conjunto de princípios de arquitetura para sistemas distribuídos [@fielding2000]. O termo _REST_ foi introduzido em 2000 por Roy Fielding em sua tese de doutorado [@fielding2000], e é a abreviação de _Representational State Transfer_, ou seja, transferência de estado representacional. O termo _REST_ é utilizado para descrever qualquer interface entre sistemas que utilize o protocolo HTTP para obter dados ou gerar operações sobre esses dados em todos os formatos possíveis, como XML e JSON, por exemplo [@fielding2000]. A arquitetura do REST consiste em adicionar camadas de restrições à aplicações:

> There are two common perspectives on the process of architectural design, whether it be for buildings or for software. The first is that a designer starts with nothing--a blank slate, whiteboard, or drawing board--and builds-up an architecture from familiar components until it satisfies the needs of the intended system. The second is that a designer starts with the system needs as a whole, without constraints, and then incrementally identifies and applies constraints to elements of the system in order to differentiate the design space and allow the forces that influence system behavior to flow naturally, in harmony with the system. Where the first emphasizes creativity and unbounded vision, the second emphasizes restraint and understanding of the system context. REST has been developed using the latter process. [@fielding2000]

As camadas de restrições são [@fielding2000]:

1. **Separação cliente-servidor**: ao separar a lógica dos dados da interface do usuário, melhoramos a portabilidade da interface de usuário em várias plataformas (computador, celular, tablet) e melhoramos a escalabilidade ao simplificar os componentes do servidor;
2. **Stateless**: a comunicação do cliente com o servidor tem que ser sem estado por natureza. Isso significa que cada requisição feita do cliente para o servidor deverá conter toda a informação necessária para a requisição ser compreendida;
3. **Cache**: como a comunicação é sem estado, isso pode acarretar em ineficiência da rede, dessa forma adicionamos o controle do cache para reutilização de informação requisitada anteriormente;
4. **Interface uniforme**: a característica principal que distingue a arquitetura REST de outra arquitetura de rede é a interface uniforme entre componentes. As implementações são dissociadas dos serviços que fornecem, o que incentiva a evolução independente; e
5. **Sistema em camadas**: ao compor a arquitetura em camadas hierárquicas, restringimos os componentes a não irem além de seus escopos.

{{status:caution; TODO; falar sobre api do linked art, principios de design e protocolos}}

---

[^2]: O termo "path" é utilizado para descrever o caminho de um arquivo em um sistema de arquivos. Por exemplo, o caminho do arquivo "index.html" na pasta "public" seria "public/index.html".

[^3]: O termo API ou _Application Programming Interface_ é amplamente utilizado para definir interfaces de programação, ou seja, qualquer software com uma função distinta. Existem outras interfaces amplamente utilizadas por desenvolvedores e usuários, como a CLI - _Command Line Interface_ e UI - _User Interface_.
