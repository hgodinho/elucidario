### 4.1.1.3 Linked Art (2019)

Linked Art é uma comunidade formada por representantes de instituições ao redor do mundo como The Canadian Heritage Information Network (CHIN), J. Paul Getty Trust, The Frick Collection, Europeana, Louvre, Rijksmuseum, The Victoria and Albert Museum, entre outras, com o objeto de criar um modelo compartilhado baseado em _Linked Open Data_ para descrever Arte [@linked-art2021.1; @linked-art2021.2]. O projeto é coordenado por um quadro editorial em que Robert Sanderson (Yale University) e Emmanuelle Delmas-Glass (Yale Center for British Art) compartilham o posto de co-presidentes.

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

#### JSON para conectar dados: JSON-LD

_JavaScript Object Notation_ (JSON) é um formato aberto de arquivo para intercâmbio de informações [@w-3-c-json-ld-working-group2014]. Consiste em arquivos de fácil leitura por humanos e máquinas com a extensão .json. Mesmo que tenha se originado na sintaxe de objetos JavaScript, por isso seu nome, pode ser utilizado por diversos ambientes e linguagens de programação diferentes devido sua sintaxe simples [@mdn-web-docs2023].

Um arquivo JSON pode ser expressado da seguinte forma:

```json
{
    "title": "One and three chairs",
    "author": "Joseph Kosuth",
}
```

Mas o que este JSON representa para alguém não conhece o contexto artístico? O que é _"title"_ e _"author"_ para uma máquina, e quais valores eles podem receber?

_JSON for Linked Data_ (JSON-LD) busca solucionar este problema adicionando uma camada de contexto ao JSON, ao fazer um link com a definição do vocabulário utilizado [@sporny2012]. Além disso é possível adicionar um identificador ao objeto, desta forma, o mesmo arquivo, porém agora com a definição do vocabulário e sua estrutura utilizando o contexto do Linked Art, pode ser expresso da seguinte forma:

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

Parece mais complexo que o exemplo anterior, e de fato é, mas agora temos um arquivo JSON que pode ser lido por humanos e máquinas, e que pode ser utilizado para conectar dados, trazendo muito mais contexto para a informação, em que: _"@context"_ é a URI do vocabulário utilizado, no caso Linked Art; "_id_" é o identificador do objeto, a URI para o registro no MoMA; "_\_label_" é um rótulo para leitura pelo desenvolvedor; "_type_" é o tipo de entidade; "_identified_by_" é a propriedade para identificar a obra, recebe um array de objetos que podem ser tanto "_Name_" quanto "_Identifier_", no caso é um "_Identifier_"com o valor "_One and three chairs_" classificado como "_Title_" e referenciado à definição de "_title_" no vocabulário AAT do Getty. Por fim,"_produced_by_" é a propriedade que recebe um objeto "_Production_" que tem como propriedade "_carried_out_by_" que recebe um array de objetos "_Person_" que tem como propriedade "_id_" a URI para o registro do artista no MoMA e "_\_label_" o nome do artista.

O JSON-LD fornece uma maneira de os dados JSON serem interoperáveis na escala da Web [@json-ld-working-group2020]. E, tem como principal intenção “ser uma maneira de usar Linked Data em ambientes de programação baseados na Web, para construir serviços Web interoperáveis e para armazenar Linked Data em mecanismos de armazenamento baseados em JSON” [@json-ld-working-group2020], ou seja, é o formato ideal para serviços REST.
