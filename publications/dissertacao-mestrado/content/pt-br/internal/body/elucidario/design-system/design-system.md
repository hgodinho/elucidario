### 7.2.2 @elucidario/pkg-design-system

**Escopo**

O _Design System_ ou Sistema de Design (SD) do Elucidário.art consiste em um conjunto de regras, definições, padrões de design e bibliotecas de componentes utilizados para construir a identidade visual e a interface de usuário (UI) do plugin. Nele definimos fontes, cores, padrões, espaçamentos, alinhamentos, layouts, etc. O SD é utilizado para construir a interface de administração do plugin, acessível para o usuário logado e com permissão para visualização e edição.

**Descrição**

Conjuntos de regras e definições delimitam o design em padrões consistentes para reutilização ao longo de toda a aplicação, aqui definimos a fonte, cores, espaçamentos, tamanhos, alinhamentos, componentes, layouts e páginas utilizados na construção da interface de usuário (UI). O SD é utilizado para construir a interface de administração do plugin, acessível para o usuário logado e com permissão para visualização e edição.

Uma regra principal utilizada em todo o design é a denominada _8pt Grid_ [@spec9999] que estipula múltiplos de 8 nas definições de tamanhos, espaçamentos, margens, preenchimentos dos elementos. Esta regra leva em conta a dimensão de telas mais utilizadas no mercado, que são múltiplas de 8, como 320px, 360px, 768px, 1024px, 1280px, 1440px, 1920px, etc.

Utilizamos o _Atomic Design_ [@frost2013], descrita no capítulo da metodologia e apresentamos a seguir os elementos definidos e desenvolvidos para o Elucidário.art:

**Átomos**: elementos básicos, como cores, fontes, espaçamentos, tamanhos, alinhamentos, etc;

A fonte utilizada para todos os textos, inclusive do logo, foi a Inter [@andersson2021] desenvolvida para uso em telas. A Inter é uma fonte open-source, disponível em diversos pesos e estilos, e com suporte a diversos idiomas. A fonte foi escolhida por ser de fácil leitura em telas, inclusive em tamanhos pequenos, e por ser uma fonte de código aberto, o que permite a sua utilização sem restrições. Utilizamos os pesos _regular_ e _bold_ para os textos, e _italic_ para os textos em itálico. A fonte é carregada via CDN (Content Delivery Network) para melhorar o desempenho da aplicação. Foram definidos 6 tamanhos baseados na regra dos múltiplos de 8: 16px para os parágrafos `<p>` e cabeçalhos `<h6>`; 24px para os cabeçalhos `<h5>`; 32px para os cabeçalhos `<h4>`; 40px para os cabeçalhos `<h3>`; 48px para os cabeçalhos `<h2>`; 56px para os cabeçalhos `<h1>`. Todos os cabeçalhos são em peso **_black_** e os parágrafos em _regular_.

A paleta de cores apresenta duas cores primárias no sistema e uma escala de cinza. O tema do aplicativo pode ser trocado de escuro para claro, o que significa que o sistema se adapta de acordo com a preferência do usuário ou do sistema operacional (Windows, OS, Android, etc).

**{{count:figuras;legend=Cartela de demonstração da tipografia e paleta do design-system.}}**

![**Fonte:** Elaborado pelo autor.](./cartela-tipografia.png)

**Moléculas**: elementos compostos por átomos, como botões, campos de formulário, etc;

Para a definição das principais moléculas da UI que compõem o formulário de metadados do modelo utilizamos o vocabulário JSON-Schema [@droettboom2020], como vimos no `@elucidario/pkg-mdorim`, que define um conjunto de palavras-chave para anotação de dados JSON podendo ser de sete tipos de dados primitivos diferentes:

1. `null` - valor nulo;
2. `string` - sequência de caracteres;
3. `number` - número;
4. `integer` - número inteiro;
5. `boolean` - valor booleano, true ou false, 1 ou 0;
6. `array` - lista de valores;
7. `object` - objeto JSON.

Foi definido um mapeamento entre estes tipos de dados e tags HTML com seus atributos. Para tipos mais complexos, como `array` desenvolvemos um componente React exclusivo que permite a adição, remoção e reordenação de itens (ver a seguir em _Organismos_). O quadro a seguir apresenta o mapeamento entre os tipos de dados JSON-Schema e as tags HTML:

{{tabela:internal/body/elucidario/design-system/json-schema-html.json}}

Podemos definir que os seguintes JSON-Schema e código HTML são equivalentes:

**{{count:figuras;legend=Exemplo de JSON-Schema e HTML equivalentes.}}**

**json-schema:**

```json
{
    "title": {
        "type": "string",
        "title": "Título",
        "description": "Descrição"
    }
}
```

**html:**

```html
<input type="text" id="title" name="title" placeholder="Título" />
<span>Descrição</span>
```

**Fonte:** Elaborado pelo autor.

**Organismos**: elementos compostos por moléculas, como cabeçalhos, rodapés, etc;

Um dos principais componentes para a construção do formulário de metadados é o `Field`, construído a partir da tag `fieldset` do HTML. Este componente agrega e padroniza todos os requisitos para o devido funcionamento de um componente de formulário React, e utiliza os mapeamentos descritos anteriormente para renderizar a UI. O componente `Field` resolve os seguintes requisitos:

- nome do campo;
- descrição;
- validação de dados:
- feedback de validação;
- a11y (acessibilidade):
- contraste de cores;
- navegação por teclado;
- WAI-ARIA;
- i18n (internacionalização):
- tradução de textos;
- tradução de mensagens de erro;

Podemos representar a anatomia do componente `Field` da seguinte forma:

**{{count:figuras;legend=Anatomia do componente "Field".}}**

![**Fonte:** Elaborado pelo autor.](./anatomia-Field.png)

Para a validação de dados, além do feedback visual é necessário que o `Field` informe ao usuário a mensagem da validação, seja sucesso ou erro:

**{{count:figuras;legend=Feedback de erro do componente "Field".}}**

![**Fonte:** Elaborado pelo autor.](./anatomia-Field-error.png)

**{{count:figuras;legend=Feedback de sucesso do componente "Field".}}**

![**Fonte:** Elaborado pelo autor.](./anatomia-Field-success.png)

Quando recebemos um `object` no componente `Field` ele é capaz de aninhar outros _Fields_:

{{count:figuras;legend=Exemplo de JSON-Schema representando um object.}}

```json
{
    "Name": {
        "title": "crm:E33_E41_Linguistic_Appellation",
        "description": "A name of an entity\nSee: [API](https://linked.art/api/1.0/shared/name/) | [Model](https://linked.art/model/base/#names)",
        "type": "object",
        "properties": {
            ...
        },
    },
}
```

**Fonte:** Extraído de Linked Art [@linked-art2021.1].

**{{count:figuras;legend=Anatomia do componente "Field" com "object".}}**

![**Fonte:** Elaborado pelo autor.](./anatomia-Field-object.png)

Assim como o `array` é capaz de adicionar, remover e reordenar _Fields_:

**{{count:figuras;legend=Exemplo de JSON-Schema representando um array.}}**

```json
{
   "referred_to_by": {
        "title": "crm:P67i_is_referred_to_by",
        "description": "An embedded statement about this entity, or a reference to a text that refers to the entity",
        "type": "array",
        "items": {
            "title": "crm:E33_Linguistic_Object",
            "description": "An embedded, relatively short piece of textual content\nSee: [API](https://linked.art/api/1.0/shared/statement/) | [Model](https://linked.art/model/base/#statements-about-a-resource)",
            "type": "object",
            "properties": {
                ...
            }
        }
    },
}
```

**Fonte:** Extraído de Linked Art [@linked-art2021.1].

**{{count:figuras;legend=Anatomia do componente "Field" com "array".}}**

![**Fonte:** Elaborado pelo autor.](./anatomia-Field-array.png)

**Templates**: elementos compostos por organismos, como layouts, páginas, etc;

Foram definidos algumas estruturas de templates para serem reutilizadas, a principal dela é a `Grid` que define uma grade responsiva que se adapta aos diferentes tamanhos de telas, no celular renderiza o conteúdo em somente uma coluna, já no tablet utiliza 4 colunas e no desktop 8. A partir da `Grid` definimos os outros templates, como o `Form` que define um formulário de metadados, o `Page` que define uma página, etc. Também foram definidos outras estruturas que utilizam a grid, como o `Carrousel` e o `Gallery` que definem um carrossel e uma galeria de imagens, respectivamente; o `Accordion` e `Tabs` que definem um acordeão e abas, respectivamente; e o `Modal` que define um modal de diálogo para exibição de informações adicionais.

**Páginas**: elementos compostos por templates, como as páginas finais do aplicativo.

Como a intenção deste pacote é o desenvolvimento de um sistema de design, ou seja, um conjunto de regras, padrões e componentes para construção de interfaces de usuários, não é atribuição deste a construção de páginas, mas sim do escopo do `@elucidario/pkg-core`—que será apresentado na sessão seguinte.
