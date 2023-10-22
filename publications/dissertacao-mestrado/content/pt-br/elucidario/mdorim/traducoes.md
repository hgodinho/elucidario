O Mdorim também é utilizado pelo plugin para gerar a UI administrativa para edição das entidades no WordPress, portanto utilizaremos os esquemas definidos em JSON-Schema para gerar automaticamente os componentes da UI. Como o JSON-Schema não foi criado para ser utilizado por usuários finais, mas sim por desenvolvedores e máquinas, não possui suporte para localização (i10n) dos valores definidos nas propriedades `title` e `description`, portanto esses valores foram definidos em inglês. Fato que impôs um desafio ao seu uso na UI, uma vez que devemos dar suporte à outros idiomas como português e espanhol. Para resolver esse problema, criamos arquivos JSON paralelos que mapeiam cada propriedade do Linked Art à um objeto JSON que permite a internacionalização (i18n) dos textos para a UI:

**{{count:charts;legend=JSON-UI: Esquema declarativo para mapeamento de modelos de dados definidos em JSON-Schema e Interfaces de Usuário.}}**

{{code:../../../../packages/mdorim/src/schemas/json-ui/schema.json}}

Fonte: Elaborado pelo autor.

Em `definitions`, definimos um objeto `localizedString` que contém as propriedades `lang` e `content`, ambas obrigatórias. A propriedade `lang` deve seguir a RFC 5646
[^1] e a propriedade `content` deve ser uma string no idioma definido em `lang`.

A propriedade `patternProperties` define o padrão de nome de cada propriedade do Linked Art para o mapeamento, no caso utilizamos o padrão Regex `^_?[a-z][a-z0-9_]*$`, em que:

- `^_?` - a propriedade pode iniciar opcionalmente com o caractere "\_";
- `[a-z]` - a propriedade deve iniciar com uma letra minúscula;
- `[a-z0-9_]*$` - a propriedade pode conter letras minúsculas, números e o caractere "\_";

Com este padrão conseguimos selecionar qualquer nome de propriedade do Linked Art, e cada chave deve conter um objeto que define as seguintes propriedades:

- `label`: array de objetos `localizedString` que definem o nome da propriedade em diferentes idiomas;
- `description`: array de objetos `localizedString` que definem a descrição da propriedade em diferentes idiomas;
- `messages`: array de objetos que possuem as propriedades `code`, `type` e `content`, em que `code` é o código da mensagem, `type` é o tipo da mensagem (_error_, _success_, _warning_, _info_) e `content` é um array de objetos `localizedString` que definem a mensagem em diferentes idiomas;
- `component`: _string_ que define o nome do componente React que será utilizado para renderização e edição do metadado, esta propriedade tem prioridade acima do tipo definido em "type" no JSON-Schema.

Utilizando este esquema, o metadado `identified_by` do Linked Art pode ser traduzido da seguinte forma:

{{code:../../../../packages/mdorim/src/translations/identified_by.json}}

Esta interface de tradução é utilizada somente no código, em que novos arquivos JSON são adicionados para cada idioma que se deseja dar suporte. Cada novo idioma deve conter uma suite de testes adicionais para validação do formato.

[^1]: <https://datatracker.ietf.org/doc/html/rfc5646>
