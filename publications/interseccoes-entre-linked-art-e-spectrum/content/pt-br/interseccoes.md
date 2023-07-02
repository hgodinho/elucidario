# Interseccoes entre Linked Art e Spectrum

Como vimos nas seções anteriores, o Spectrum define um conjunto de procedimentos e unidades especializadas de informação, como "Object name" ou "Conservation authorization date", o que por si só já traz bastante contexto à informação representada. O Spectrum também não determina o formato de registro das informações: se devemos utilizar tabelas em CSV, MYSQL, XML, RDF, ou qualquer outro formato para dados.

Em contrapartida, o Linked Art utiliza o formato JSON, mais especificamente o JSON-LD e define uma estrutura comum que é compartilhada por diversas propriedades e adiciona uma camada semântica com o uso de vocabulários controlados para definição dos conceitos descritos.

O Quadro a seguir evidencia as diferenças e os pontos de contato entre os dois modelos:

|         | Spectrum     | Linked Art     |
| ------- | ------------ | -------------- |
| Origem  | Reino Unido  | Estados Unidos |
| Formato | Não definido | JSON-LD        |

Para o mapeamento entre o Spectrum e o Linked Art, selecionamos apenas as unidades de informação do Spectrum, uma vez que os procedimentos são atividades que vão além do registro em si, mas suas informações ainda podem ser representados pelo Linked Art, como veremos mais adiante. Também selecionamos as Classes e propriedades do Linked Art, que necessitam da contextualização de um vocabulário controlado como pode ser visto na Figura 1.

**Figura 1** - Intersecções entre o Spectrum e o Linked Art.

![interseccoes](interseccoes.png)

**Fonte:** Elaborado pelos autores.

A imagem acima demonstra a importância do uso de vocabulários controlados para trazer mais contexto para os metadados no Linked Art, como por exemplo a propriedade _identified_by_ do Linked Art é a forma padrão de identificação de qualquer classe definida pelo modelo, como _Object_, _Concept_, _Digital_ _Object_, _Event_, entre outras. Ela aceita um array de objetos que podem ser ou _Identifiers_ ou _Names_ que possuem a propriedade _classified_as_, um array de objetos _Concept_ que representam os conceitos identificados pelo _content_ da propriedade:

**Exemplo x**: Identificação de um objeto, demonstra a propriedade _identified_by_ com um array de objetos _Identifier_ e _Name_ e suas propriedades _classified_as_.

```json
{
    "identified_by": [
        {
            "type": "Identifier",
            "_label": "Accession Number",
            "classified_as": [
                {
                    "id": "http://vocab.getty.edu/aat/300404621",
                    "_label": "Accession Number"
                }
            ],
            "content": "M-0821"
        },
        {
            "type": "Name",
            "_label": "Title",
            "classified_as": [
                {
                    "id": "http://vocab.getty.edu/aat/300404621",
                    "_label": "Title"
                }
            ],
            "content": "Rio de Janeiro"
        }
    ]
}
```

**Fonte**: Elaborado pelos autores. Baseado no Linked Art, descreve a obra Rio de Janeiro de Tarsila do Amaral.

Já o Spectrum define campos especializados para o tipo de identificação que estamos realizando, seja de um objeto [@collections-trust2017.4]:

-   _Object Name_;
-   _Object Number_;
-   _Title_;
-   _Other Number_.

Ou de uma pessoa [@collections-trust2017.5]:

-   Person's reference number;
-   Person's forename;
-   Person's surname;
-   Person's title;
-   entre outras.
