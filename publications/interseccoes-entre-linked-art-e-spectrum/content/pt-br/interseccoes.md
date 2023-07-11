# Interseccoes entre Linked Art e Spectrum

Como vimos nas seções anteriores, o Spectrum define um conjunto de procedimentos e unidades especializadas de informação, como "Object name" ou "Conservation authorization date", o que por si só já traz bastante contexto à informação representada. O Spectrum também não determina o formato de registro das informações: se devemos utilizar tabelas em CSV, MYSQL, XML, RDF, ou qualquer outro formato para dados.

Em contrapartida, o Linked Art utiliza o formato JSON, mais especificamente o JSON-LD e define uma estrutura comum que é compartilhada por diversas propriedades sendo uma delas a "classified_as", que permite a utilização de vocabulários controlados para a representação de conceitos.

O Quadro a seguir evidencia as diferenças e os pontos de contato entre os dois modelos:

{{table:interseccoes.json}}

Para o mapeamento entre o Spectrum e o Linked Art selecionamos apenas as unidades de informação do Spectrum, uma vez que os procedimentos são atividades que vão além do registro em si, mas suas informações ainda podem ser mapeadas para o Linked Art, pois também estão definidas nas unidades de informação no grupo "_procedural information_". Também selecionamos as Classes e propriedades do Linked Art, que necessitam da contextualização de um vocabulário controlado para conseguirmos o mesmo sentido do metadado mapeado no Spectrum, como pode ser visto na Figura 1.

**Figura 1** - Intersecções entre o Spectrum e o Linked Art.

![interseccoes](interseccoes-v2.png)

**Fonte:** Elaborado pelos autores.

A imagem acima demonstra a importância do uso de vocabulários controlados para trazer mais contexto para os metadados no Linked Art, como por exemplo a propriedade _identified_by_ do Linked Art é a forma padrão de identificação de qualquer classe definida pelo modelo, como _Object_, _Concept_, _DigitalObject_, _Event_, entre outras. Ela aceita um array de objetos que podem ser ou _Identifiers_ ou _Names_ que possuem a propriedade _classified_as_— um array de objetos _Concept_ que representam os conceitos identificados pelo _content_ da propriedade:

**Exemplo x**: Identificação de um objeto, demonstra a propriedade _identified_by_ com um array de objetos _Identifier_ e _Name_ e suas propriedades _classified_as_.

{{code:rj-tarsila-linked-art.json}}

**Fonte**: Elaborado pelos autores. Baseado no Linked Art, descreve a obra Rio de Janeiro de Tarsila do Amaral da Coleção Ema Klabin.

Já o Spectrum define campos especializados para o tipo de identificação que estamos realizando [@collections-trust2017.4]:

{{table:rj-tarsila-spectrum.json}}
