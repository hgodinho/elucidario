# `@elucidario/pub-gen`

Gerador de publicações para o Elucidário.art.

Seu principal objetivo é manter as publicações relacionadas ao Elucidário padronizadas e organizadas no mono-repo do `Elucidário.art`.

O pub-gen usa o [`md-to-gdoc`](../md-to-gdoc/README.md) para converter a publicação para um arquivo google-docs para facilitar a edição e revisão da publicação por pessoas que não tem conhecimento de git e markdown. Os benefícios de converter para google docs são inúmeros, além da revisão podemos converter com muita facilidade para pdf e formatos de publicação como epub, mobi, etc, além do velho e bom docx.

## Como usar

Na raiz do `elucidario` execute:

```bash
pnpm pub-gen
```

Responda as perguntas do prompt e o pub-gen irá criar uma pasta com o nome e os arquivos necessários para a publicação na pasta `publications`.

```bash
cd publications/<nome-da-publicacao>
```

## Estrutura da pasta gerada

```bash
publications
└── <nome-da-publicacao>
    ├── content
    │   ├── pt-br
    │   │   ├── introducao.md
    │   │   ├── resumo.md
    │   |   └── ...
    │   └── en-us
    │       ├── introducao.md
    │       ├── resumo.md
    │       └── ...
    ├── references
    │   ├── abnt
    │   │   ├── livro.json
    │   │   └── ...
    │   └── apa
    │       ├── book.json
    │       └── ...
    ├── README.md
    ├── package.json
    |── pub-gen.json
    └── .gitignore
```

## Como editar

Edite os arquivos na pasta `content` e `references` para adicionar o conteúdo da publicação. O arquivo `pub-gen.json` contém as configurações que descreve a publicação.

### Sinconizando com o google-docs

Para sincronizar com o google-docs é necessário criar um novo app no google cloud console e gerar um arquivo `credentials.json` com as credenciais do app. Para mais informações sobre como criar um app e gerar as credenciais acesse [este link](https://developers.google.com/drive/api/v3/quickstart/nodejs).

É necessário adicionar as Apis do Google Drive e do Google Docs no app criado.

O arquivo `credentials.json` deve ser colocado na raiz da pasta `<nome-da-publicacao>`. Certifique-se de que o arquivo não está sendo versionado pelo git.

Depois execute o comando `pnpm authenticate` para autenticar o app com o google ou `pnpm create-doc` autenticar e criar um novo doc.

O arquivo `token.json` será gerado com as credenciais do usuário. Esse arquivo não deve ser versionado pelo git.

### Comandos

### `pnpm authenticate`

Autentica o app com o google e gera um arquivo `token.json` com as credenciais do usuário.

### `pnpm create-doc`

Autentica o app com o google, gera um arquivo `token.json` com as credenciais do usuário e cria um novo documento no google-docs.

### `pnpm sync`

Sincroniza o conteúdo da pasta `content` e `references` com o google-docs.

## Funcionalidades

### Referencias

As referências são definidas em formato json-schema e seus schemas podem ser consultados na pasta `schemas` do package `md-to-gdoc`.

### Presets

Possui um sistema de presets para definição de qual padrão de publicação deve ser usado. Atualmente existem dois presets:

- `abnt` - Padrão de publicação para o Brasil
- `apa` - Padrão de publicação para os Estados Unidos e outros países

Os presets configuram o google-docs para usar o padrão de referências correto além de configurar a página com o formato adequado para cada preset. Define configurações como margens, tamanhos de fonte, espaçamento entre linhas, etc.

## todo

- [ ] Criar um preset para o padrão de publicação da APA
- [ ] Estabelecer um meio para que gere arquivos google-docs para diferentes presets.
- [ ] Possibilidade de  permitir o uso de pastas ou arquivos com extensão `.md` para determinar seções do texto na pasta `content`.
