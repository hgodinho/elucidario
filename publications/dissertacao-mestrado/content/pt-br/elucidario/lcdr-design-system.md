### 9.1.2 @elucidario/pkg-design-system

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

{{table:design-system/json-schema-html.json}}

<!-- Como o JSON-Schema não foi criado para ser utilizado por usuários finais, mas sim por desenvolvedores e máquinas, o vocabulário não possui suporte para localização das strings "title" e "description", portanto no JSON-Schema essas propriedades devem ser escritas em inglês, logo não podemos utilizá-las para gerar a UI, uma vez que devemos dar suporte à outros idiomas como português e espanhol. Para resolver esse problema, criamos um arquivo JSON paralelo que mapeia cada propriedade do MDORIM à um objeto que permite a internacionalização dos textos para a UI, como o nome da propriedade, descrição, mensagens de erro e sucesso, etc. Este objeto também contém uma propriedade "component" que permite a definição de um componente React específico para a renderização desta propriedade no MDORIM, essa função é útil no caso de algumas exceções em que não foi utilizado o mapeamento padrão (json-schema -> HTML), mas sim foi realizada a criação de um componente próprio para renderização e edição desta propriedade. Este objeto pode ser descrito em JSON-Schema da seguinte forma:

**Quadro X - JSON-UI: Esquema declarativo para mapeamento de modelos de dados definidos em JSON-Schema e Interfaces de Usuário**

{{code:../../../../../packages/mdorim/src/schemas/json-ui/schema.json}}

Fonte: Elaborado pelo autor.

No quadro acima a propriedade "patternProperties" define o padrão de nome de cada propriedade do MDORIM para o mapeamento, no caso utilizamos o padrão Regex[^1] **^[a-z][a-z0-9_]\*$**, em que:

-   "^[a-z]" - a propriedade deve iniciar com uma letra minúscula;
-   "[a-z0-9_]\*$" - a propriedade pode conter letras minúsculas, números e o caractere "\_";

A propriedade "component" é opcional, caso não seja definida, o componente será inferido pelo tipo de dado utilizado.

Dessa forma, o metadado "identified_by" do MDORIM pode ser descrito da seguinte forma:

{{code:../../../../../packages/mdorim/src/translations/identified_by.json}} -->

Criamos um componente chamado `Field`, construído a partir da tag `fieldset` do HTML, este componente agrega e padroniza todos os requisitos para o devido funcionamento de um componente de formulário React, e utiliza os mapeamentos descritos anteriormente para renderizar a UI. O componente `Field` resolve os seguintes requisitos:

-   nome do campo;
-   descrição;
-   validação de dados:
    -   feedback de validação;
-   a11y (acessibilidade):
    -   contraste de cores;
    -   navegação por teclado;
    -   WAI-ARIA;
-   i18n (internacionalização):
    -   tradução de textos;
    -   tradução de mensagens de erro;

Podemos representar a anatomia do componente `Field` da seguinte forma:

![Anatomia do componente `Field`](./anatomia-Field.png)

Para a validação de dados, além do feedback visual é necessário que o `Field` informe ao usuário a mensagem da validação, seja sucesso ou erro:

![Feedback de erro do componente `Field`](./anatomia-Field-error.png)

![Feedback de sucesso do componente `Field`](./anatomia-Field-success.png)

No caso de `object` o `Field` é capaz de aninhar outros `Field`s:

![Anatomia do componente `Field` com `object`](./anatomia-Field-object.png)

Assim como o `array` é capaz de adicionar, remover e reordenar `Field`s:

![Anatomia do componente `Field` com `array`](./anatomia-Field-array.png)
