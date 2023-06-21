### 9.1.3 @elucidario/pkg-design-system

O _Design System_ ou Sistema de Design (SD) do Elucidário.art consiste em um conjunto de regras, definições e bibliotecas de componentes e padrões de design utilizados para construir as interfaces de usuário do plugin.

Os conjuntos de regras e definições delimitam o design em padrões consistentes para reutilização ao longo de toda a aplicação, nele definimos fontes, cores, espaçamentos, tamanhos, alinhamentos, etc. Já as bibliotecas de componentes são conjuntos de componentes React que podem ser utilizados para construir as interfaces de usuário do plugin. Os componentes são construídos utilizando o padrão de design definido no SD, assim como as regras e definições.

Como vimos no "@elucidario/pkg-mdorim", os metadados do modelo são descritos em JSON-Schema que estipula sete tipos de dados primitivos:

1. "string" - sequência de caracteres;
2. "null" - valor nulo;
3. "number" - número;
4. "integer" - número inteiro;
5. "boolean" - valor booleano, true ou false, 1 ou 0;
6. "array" - lista de valores;
7. "object" - objeto JSON.

Para a definição do SD utilizaremos o mesmo formato definido no MDORIM com algumas camadas extras para melhorar a experiência de desenvolvimento. Sendo uma delas o mapeamento entre os tipos de dados primitivos e tags HTML com seus atributos. Para componentes mais complexos, como "array" desenvolvemos um componente React exclusivo que permite a adição, remoção e reordenação de itens. O quadro a seguir descreve o mapeamento realizado, em que "schema type" é o tipo de dado definido no JSON-Schema; "schema format" representa o formato de dado de uma string no JSON-Schema; "schema extra" representa qualquer outra propriedade do vocabulário JSON-Schema; "html tag" é a tag html relacionada no mapeamento, pode vir acompanhada de um sinal ">" representando uma hierarquia entre tags html ou componentes React; "input type" é o tipo de input HTML utilizado; "attributes" são os atributos da tag html; "descrição" é uma breve descrição do mapeamento realizado.

{{table:design-system-mapping.json}}

Além disso, criamos um componente de nível superior chamado `Field`, construído a partir da tag `fieldset` do HTML, este componente agrega e padroniza todos os requisitos para o devido funcionamento de um componente de formulário React:

-   label;
-   descrição;
-   validação de dados:
    -   feedback de validação;
-   a11y (acessibilidade):
    -   contraste de cores;
    -   navegação por teclado;
    -   WAIAria;
-   i18n (internacionalização):
    -   tradução de textos;
    -   tradução de mensagens de erro;

Dessa forma podemos representar a anatomia do componente `Field` da seguinte forma:

![Anatomia do componente `Field`](./anatomia-Field.png)

Para a validação de dados, além do feedback visual é necessário que o `Field` informe ao usuário a mensagem da validação, seja sucesso ou erro:

![Feedback de erro do componente `Field`](./anatomia-Field-error.png)

![Feedback de sucesso do componente `Field`](./anatomia-Field-success.png)

No caso de `object` o `Field` é capaz de aninhar outros `Field`s:

![Anatomia do componente `Field` com `object`](./anatomia-Field-object.png)

Assim como o `array` é capaz de adicionar, remover e reordenar itens:

![Anatomia do componente `Field` com `array`](./anatomia-Field-array.png)
