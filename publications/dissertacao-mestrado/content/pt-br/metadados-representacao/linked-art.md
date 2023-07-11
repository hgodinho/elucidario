Linked Art é uma comunidade formada por representantes de instituições ao redor do mundo como The Canadian Heritage Information Network (CHIN), J. Paul Getty Trust, The Frick Collection, Europeana, Louvre, Rijksmuseum, The Victoria and Albert Museum, entre outras, com o objetivo de criar um modelo compartilhado baseado em _Linked Open Data_ para descrever Arte [@linked-art2021.1; @linked-art2021.2]. O projeto é coordenado por um quadro editorial em que Robert Sanderson (Yale University) e Emmanuelle Delmas-Glass (Yale Center for British Art) compartilham o posto de co-presidentes.

A comunidade Linked Art parte do conceito da usabilidade para a audiência correta, em que o maior público interessado em "dados" seriam os desenvolvedores que poderiam criar interfaces para o público final. Desdobrando esta ideia em cinco princípios de design, temos:

1. **Abstração para a audiência correta**: desenvolvedores não precisam do mesmo acesso aos dados como os ontologistas;
2. **Poucas barreiras de entrada**: deve ser fácil começar a trabalhar com dados e construir algo: _“If it takes a long time to understand the model, ontology, sparql query syntax and so forth, then developers will look for easier targets”_ [@sanderson2018];
3. **Compreensível pela introspecção**: os dados devem ser compreensíveis pela leitura humana, usar JSON-LD é utilizar a linguagem que o desenvolvedor já compreende;
4. **Documentação com exemplos funcionais**: você nunca poderá intuir todas as regras dos dados, documentação serve para mapear os padrões que o desenvolvedor pode encontrar; e
5. **Poucas exceções em vez de vários padrões consistentes**: cada exceção em uma API é outra regra que o desenvolvedor precisa apreender: _“every exception is jarring, and requires additional code to manage. While not everything is homogenous, a set of patterns that manage exceptions well is better than many custom fields.”_ [@sanderson2018].

O Linked Art está sob desenvolvimento ativo e a versão atual é a 0.8.0 e é considerada instável, passível de mudanças. A versão 1.0.0 estava prevista para o final de 2021, mas foi atrasada por conta da pandemia de COVID-19 [@linked-art2021.4].

O modelo Linked Art tem como foco principal a descrição de recursos do patrimônio cultural artístico e atividades de museus. Para isto, o modelo utiliza um perfil do CIDOC _Conceptual Reference Model_ (CIDOC-CRM) que combina a facilidade de uso do JSON-LD com a excelência do CRM, mas reduzindo sua complexidade para um conjunto de classes e propriedades que são mais comuns em 90% dos casos de usos de 90% das organizações [@linked-art2021.3]

_JavaScript Object Notation_ (JSON) é um formato aberto de arquivo para intercâmbio de informações [@w-3-c-json-ld-working-group2014]. Consiste em arquivos de fácil leitura por humanos e máquinas com a extensão .json. Mesmo que tenha se originado na sintaxe de objetos JavaScript, por isso seu nome, pode ser utilizado por diversos ambientes e linguagens de programação diferentes devido sua sintaxe simples [@mdn-web-docs2023].

Um arquivo JSON pode ser expressado da seguinte forma:

```json
{
    "title": "One and three chairs",
    "author": "Joseph Kosuth"
}
```

Mas o que este JSON representa para alguém que não conhece o contexto artístico? O que é _"title"_ e _"author"_ para uma máquina, e quais tipos de valores eles podem receber?

_JSON for Linked Data_ (JSON-LD) busca solucionar este problema adicionando uma camada de contexto ao JSON, ao fazer um link com a definição do vocabulário utilizado [@sporny2012]. Além disso é possível adicionar um identificador ao objeto, desta forma, o mesmo arquivo, porém agora com a definição do vocabulário e utilizando o contexto do Linked Art, pode ser expresso da seguinte forma:

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
                    "id": "http://vocab.getty.edu/aat/300417201",
                    "type": "Type",
                    "_label": "Title"
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

Parece mais complexo que o exemplo anterior, e de fato é, mas agora temos um arquivo JSON que pode ser lido por humanos e máquinas, e que pode ser utilizado para conectar dados, trazendo muito mais contexto para a informação, em que: _"@context"_ é a URI do vocabulário utilizado, no caso Linked Art; "_id_" é o identificador do objeto, a URI para o registro no MoMA; "_\_label_" é um rótulo para leitura pelo desenvolvedor; "_type_" é o tipo de entidade; "_identified_by_" é a propriedade para identificar a obra, recebe um array de objetos que podem ser tanto "_Name_" quanto "_Identifier_", no caso é um "_Identifier_"com o valor "_One and three chairs_" classificado como "_Title_" e referenciado à definição de "_title_" no vocabulário AAT do Getty. Por fim,"_produced_by_" é a propriedade que recebe um objeto "_Production_" que tem como propriedade "_carried_out_by_" que recebe um array de objetos "_Person_" com a propriedade "_id_" e a URI para o registro do artista no MoMA e "_\_label_" com o nome do artista.

O JSON-LD fornece uma maneira de os dados JSON serem interoperáveis na escala da Web [@json-ld-working-group2020]. E, tem como principal intenção “ser uma maneira de usar Linked Data em ambientes de programação baseados na Web, para construir serviços Web interoperáveis e para armazenar Linked Data em mecanismos de armazenamento baseados em JSON” [@json-ld-working-group2020], ou seja, é o formato ideal para serviços REST.

REST é uma arquitetura para distribuição de sistemas hipermídia [@fielding2000], que consiste em adicionar camadas de restrições à aplicações:

> There are two common perspectives on the process of architectural design, whether it be for buildings or for software. The first is that a designer starts with nothing--a blank slate, whiteboard, or drawing board--and builds-up an architecture from familiar components until it satisfies the needs of the intended system. The second is that a designer starts with the system needs as a whole, without constraints, and then incrementally identifies and applies constraints to elements of the system in order to differentiate the design space and allow the forces that influence system behavior to flow naturally, in harmony with the system. Where the first emphasizes creativity and unbounded vision, the second emphasizes restraint and understanding of the system context. REST has been developed using the latter process. [@fielding2000]

As camadas de restrições são [@fielding2000]:

> 1. Separação Cliente-servidor: ao separar a lógica dos dados da interface do usuário, melhoramos a portabilidade da interface de usuário em várias plataformas (computador, celular, tablet) e melhoramos a escalabilidade ao simplificar os componentes do servidor;
> 2. Stateless: a comunicação do cliente com o servidor tem que ser sem estado por natureza. Isso significa que cada requisição feita do cliente para o servidor deverá conter toda a informação necessária para a requisição ser compreendida;
> 3. Cache: como a comunicação é sem estado, isso pode acarretar em ineficiência da rede, dessa forma adicionamos o controle do cache para reutilização de informação requisitada anteriormente;
> 4. Interface uniforme: a característica principal que distingue a arquitetura REST de outra arquitetura de rede é a interface uniforme entre componentes. As implementações são dissociadas dos serviços que fornecem, o que incentiva a evolução independente; e
> 5. Sistema em camadas: ao compor a arquitetura em camadas hierárquicas, restringimos os componentes a não irem além de seus escopos.

<!-- O Linked Art também apresenta os schemas definidos no formato JSON-Schema, utilizado para descrever e validar estruturas de dados JSON [@droettboom2020]. Com o JSON-Schema é possível descrever diferentes tipos de dados, como números, strings, objetos, arrays, booleanos e nulos. Além disso, é possível definir restrições para os dados, como o tamanho máximo de uma string, o intervalo de valores de um número, ou o número de itens em um array, entre outras [@droettboom2020].

Um objeto com uma propriedade "name" do tipo string pode ser representado em JSON-Schema da seguinte forma:

```json
{
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        }
    }
}
``` -->

A API do Linked Art é dividida em duas partes: _Shared Constructs_, ou Estruturas Compartilhadas (EC), e _Entity Endpoints_, Endpoints de Entidades (EE). Como as propriedades definidas no Linked Art se repetem pelas EC e EE, separamos as propriedades em dois quadros distintos para facilitar a visualização. No primeiro, apresentamos as propriedades que são obrigatórias nas EE e, com exceção de "@context" e "id", também são obrigatórias em todas as EC. No segundo, apresentamos as propriedades que podem ou não serem utilizadas em mais de uma EC ou EE. Após os quadros, apresentamos as EC e EE:

{{table:linked-art/common-properties.json}}

{{table:linked-art/properties.json}}

_Shared Constructs_ são estruturas de dados definidas no Linked Art que são utilizadas por mais de um endpoint. São elas [@linked-art2021.7]:

-   _Dimensions_ - dimensões de um recurso físico ou digital, com uma unidade e um tipo de dimensão;
    Suas propriedades são:

    {{table:linked-art/dimensions.json}}

    {{table:linked-art/measurement.json}}

-   _Identifiers_ - identificadores de um recurso, como um número de catálogo ou um número de inventário;
    Suas propriedades são:

    {{table:linked-art/identifiers.json}}

    {{table:linked-art/identifiers-assignments.json}}

-   _Monetary Amounts_ - similares a _Dimensions_, mas para valores monetários, no caso a propriedade _Type_ é definida como _MonetaryAmount_, e não possui a propriedade _assigned_by_;

-   _Names_ - definir

-   _Statements_ - definir
-   _TimeSpans_ - definir
-   _Types/Concepts_ - definir
-   _Relationships_ - definir
-   _Entity References_ - definir
-   _Assignments_ - definir

Os EE são [@linked-art2021.5]:

1.  **Concept** - tipos, materiais, técnicas, idiomas, entre outros que sejam registros completos, ao contrário de referências externas;

    Os _Concepts_ possuem as seguintes propriedades:

    {{table:linked-art/concept.json}}

    {{table:linked-art/concept-creation.json}}

2.  **Digital Object** - imagens, vídeos, áudios, documentos, webpages, ou outros recursos digitais;

    Os _Digital Objects_ possuem as seguintes propriedades:

    {{table:linked-art/digital.json}}

    {{table:linked-art/digital-creation.json}}

    {{table:linked-art/digital-service.json}}

3.  **Event** - eventos e atividades não específicas que estão relacionadas, mas não são parte de outra entidade;

    Os _Events_ possuem as seguintes propriedades:

    {{table:linked-art/event.json}}

4.  **Groups** - grupos de pessoas, organizações, ou outras entidades;

    Os _Groups_ possuem as seguintes propriedades:

    {{table:linked-art/group.json}}

5.  **People** - pessoas;

    _People_ possuem as seguintes propriedades:

    {{table:linked-art/people.json}}

6.  **Physical Object** - objetos físicos, incluindo obras de arte, artefatos, edifícios, partes de objetos, entre outros;

    _Physical Objects_ possuem as seguintes propriedades:

    {{table:linked-art/object.json}}

7.  **Place** - locais;

    _Places_ possuem as seguintes propriedades:

    {{table:linked-art/place.json}}

8.  **Provenance Activity** - atividades de proveniência;

    _Provenance Activities_ possuem as seguintes propriedades:

    {{table:linked-art/provenance.json}}

9.  **Sets** - conjuntos de entidades;

    _Sets_ possuem as seguintes propriedades:

    {{table:linked-art/set.json}}

10. **Textual Work** - obras textuais que merecem descrição como entidades únicas, como conteúdo de livro ou artigos, entre outros:

    _Textual Works_ possuem as seguintes propriedades:

    {{table:linked-art/textual.json}}

11. **Visual Work** - conteúdo imagético que merece descrição como entidades únicas, como a imagem exibida em uma pintura ou desenho, entre outros.

    _Visual Works_ possuem as seguintes propriedades:

    {{table:linked-art/visual.json}}

###### Intersecções entre Linked-art e Spectrum

Como vimos no
