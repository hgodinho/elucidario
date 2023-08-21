**Testes**

Os testes do Mdorim foram definidos utilizando as bibliotecas Jest [@nakazawa2011] e jest-json-schema [@american-express2022], pra realização dos testes unitários. O Jest é uma ferramenta para criar e rodar testes automatizados em JavaScript, que permite a extensão de suas funcionalidades através de plugins. Uma dessas funcionalidades é a criação de _matchers_, que são funções que permitem a validação de valores, como por exemplo, a validação de uma `string`:

{{count:figures;legend=Exemplo de teste utilizando o Jest}}

```javascript
// js
expect('banana').toBe('banana');
```

**Fonte**: elaborado pelo autor.

Em que `expect` é uma função que espera um valor qualquer como parâmetro, nela definimos o valor que esperamos receber, e em seguida utilizamos o _matcher_ `toBe` para validar se o valor recebido é igual ao valor esperado.

O jest-json-schema é um plugin para o Jest criado para realizar a validação de arquivos JSON com formato JSON-Schema, esta biblioteca adiciona um novo _matcher_ ao Jest, o `toMatchSchema`, que permite a validação de um objeto JSON com um JSON-Schema.

Dessa forma podemos utilizar os próprios métodos de importação do JavaScript para importar os arquivos JSON-Schema e realizar a validação dos objetos JSON com o JSON-Schema correspondente, como no exemplo abaixo:

{{count:figures;legend=Exemplo de teste utilizando o jest-json-schema}}

```javascript
// js
import { matchersWithOptions } from "jest-json-schema";

import mdorim from "../lib/mjs/index";

expect.extend(
    matchersWithOptions({
        schemas: [mdorim.schemas.mapping],
    }),
);

expect(mdorim.mapping.mapping_test).toMatchSchema(
    mdorim.schemas.mapping,
);
```

**Fonte**: elaborado pelo autor.

Em um primeiro momento extendemos a função `expect` e adicionamos um novo _matcher_ fornecido pela biblioteca jest-json-schema, em seguida importamos o arquivo JSON-Schema que queremos utilizar para validar o objeto JSON, e por fim utilizamos o _matcher_ `toMatchSchema` para validar o objeto JSON com o JSON-Schema correspondente.

Cada `expect` deve retornar `true` para que o teste seja considerado válido, caso contrário o teste é considerado inválido, neste caso o Jest retorna uma mensagem de erro indicando o motivo do teste ter falhado e o erro faz com que a Integração Contínua seja interrompida. Portanto é necessário que todos os testes sejam válidos para que a Integração Contínua seja concluída com sucesso.
