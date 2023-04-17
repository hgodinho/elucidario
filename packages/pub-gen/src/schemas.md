# Schemas

Schemas descrevem estruturas de dados comuns ao pub-gen. São usados para assegurar que os dados de entrada estejam em conformidade com as estruturas esperadas.

## `pub-gen-schema.json`

É o schema principal de uma publicação criada pelo pub-gen. Descreve a estrutura de dados do documento sendo gerado, estende o [data-package.json](https://specs.frictionlessdata.io/data-package/), logo possui todas suas propriedades e adiciona algumas específicas do pub-gen.

{{json-schema:schema/pub-gen-schema.json}}

## `table-schema.json`

É o schema de uma tabela de dados. Descreve a estrutura de dados de uma tabela, estende o [table-schema.json](https://specs.frictionlessdata.io/table-schema/), logo possui todas suas propriedades e adiciona algumas específicas do pub-gen.

{{json-schema:schema/table-schema.json}}
