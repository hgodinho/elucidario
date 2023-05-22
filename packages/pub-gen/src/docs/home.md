---
id: pub-gen
slug: /
toc_min_heading_level: 2
toc_max_heading_level: 4
---

# `@elucidario/pkg-pub-gen`

> Gerador de publicações para o Elucidário.art.

Seu principal objetivo é manter as publicações relacionadas ao Elucidário padronizadas e organizadas no monorepo do `Elucidário.art`.

## Funcionalidades

### Presets

Possui um sistema de presets para definição de qual padrão de publicação deve ser usado. Atualmente existem dois presets:

- `abnt` - Padrão de publicação para o Brasil
- `apa` - Padrão de publicação para os Estados Unidos e outros países

Os presets são utilizados para formatar o arquivo `.docx` gerado seguindo as normas estipuladas em cada padrão. Os presets também definem o formato das referências na publicação.

### Internacionalização

As publicações geradas pelo pub-gen são internacionalizadas. O pub-gen cria uma pasta para cada idioma definido na publicação. Por padrão o pub-gen cria as pastas `pt-br` e `en-us` para os idiomas português e inglês respectivamente.

### Referências

O pub-gen possui um sistema de referências que permite adicionar referências em um arquivo `.json` e gerar automaticamente as referências no formato definido pelo preset da publicação. Utiliza o citeproc-js para gerar as referências.

### Padrões comuns

O pub-gen utiliza padrões comuns relacionados a publicações como

- [Data Package](https://specs.frictionlessdata.io/data-package/) para descrever os metadados da publicação e os metadados dos arquivos gerados e utilizados pela publicação.
- [CSL json](https://raw.githubusercontent.com/citation-style-language/schema/v1.0/schemas/input/csl-data.json#/items) para descrever as referências.

### Pandoc

O pub-gen utiliza o [pandoc](https://pandoc.org/) para converter os arquivos `.md` em `.docx` ou outras extensões. O pandoc é uma ferramenta de conversão de documentos de código aberto e gratuita.

### Versionamento semântico

Para mais informações confira a página [Versionamento](/pub-gen/versionamento).

### Tabelas

<!-- Tabelas são definidas em  -->

---

## Configurando o pub-gen no monorepo

Na raiz do monorepo crie um arquivo `pub-gen-config.json` com o seguinte conteúdo:

```json
{
    "publications": "<caminho-para-a-pasta-de-publicacoes>",
    "references": "<caminho-para-a-pasta-de-referencias>"
}
```

O pub-gen utilizará as configurações desse arquivo para criar as publicações e referências. Você também pode utilizar o comando `pnpm pub-gen init` para criar o arquivo `pub-gen-config.json` automaticamente.

---

## Como usar

Na raiz do `elucidario` execute:

```bash
pnpm pub-gen <command> <options>
```

---

## Comandos

### `init`

```bash
pnpm pub-gen init <options>
```

Cria o arquivo `pub-gen-config.json` na raiz do monorepo.

#### options

- `-f, --force`: Força a criação do arquivo `pub-gen-config.json` mesmo que ele já exista.
- `-d, --default`: Cria o arquivo `pub-gen-config.json` com as configurações padrões.

---

### `create`

```bash
pnpm pub-gen create
```

Cria uma nova publicação. Utiliza o schema [pub-gen-schema.json](/pub-gen/schemas/pub-gen-schema) para criar e validar as respostas do prompt. O comando irá realizar uma série de perguntas na cli que serão utilizadas para gerar a publicação. O comando irá criar uma pasta com o nome e os arquivos necessários para a publicação na pasta `publications` definida no `pub-gen-config.json`.

---

### `reference`

```bash
pnpm pub-gen reference <command>
```

Comandos relacionados a referências:

#### `add`

```bash
pnpm pub-gen reference add <options>
```

Adiciona uma nova referência. Utiliza o schema [reference-schema.json](/pub-gen/schemas/reference-schema) para criar e validar as respostas do prompt. Este comando irá realizar uma série de perguntas na cli que será utilizada para criar uma nova referência. A referência será criada na pasta `references` definida no `pub-gen-config.json`. Para saber mais sobre como criar e editar referências veja a página [Referências](/pub-gen/referencia).

##### options

- `-p, --publication`: Nome da publicação que a referência será adicionada. Se não passada será adicionada somente na pasta `references` do monorepo.

#### `search`

```bash
pnpm pub-gen reference search <options>
```

Busca uma referência na pasta `references` definida no `pub-gen-config.json`.

##### options

- `-p, --publication`: Nome da publicação que a referência será pesquisada. Se não passada será pesquisada somente na pasta `references` do monorepo.
- `-t, --type`: Tipo de campo que será pesquisado. Se não passado será pesquisado em todos os campos.
- `-v, --value`: Valor que será pesquisado. Se não passado será retornado um erro.

#### `index`

```bash
pnpm pub-gen reference index
```

Usado internamente somente pelo pub-gen. Cria um arquivo na pasta root do pub-gen com o nome `indexsearch.js` que contém uma série de `search.addIndex()` para ser utilizado na busca.

---

### `add-author`

```bash
pnpm pub-gen add-author <options>
```

Adiciona um novo autor.

#### options

- `-p, --publication`: Nome da publicação em que o autor será adicionado. Se não passada o comando retorna um erro.

---

### `build`

```bash
pnpm pub-gen build <options>
```

Gera a publicação.

O comando irá gerar os arquivos `.md` na pasta `dist` da publicação. Os arquivo gerados serão utilizados na conversão pelo comando `convert`.

#### options

- `-p, --publication`: Nome da publicação que será gerada. Se não passada o comando retorna um erro.
- `-m, --md`: Gera somente os arquivos `.md` da publicação.

---

### `version`

```bash
pnpm pub-gen version <options>
```

Realiza uma série de perguntas na cli para gerar a versão da publicação. Para mais informações veja a página [Versionamento](/pub-gen/versionamento).

#### options

- `-p, --publication`: Nome da publicação que será versionada. Se não passada o comando retorna um erro.

---

### `convert`

```bash
pnpm pub-gen convert <options>
```

Converte os arquivos da publicação para o formato especificado.

#### options

- `-p, --publication`: Nome da publicação que será convertida. Se não passada o comando retorna um erro.
- `-o, --output`: Pasta de destino dos arquivos convertidos. Se não passada será gerada na pasta `dist` da publicação.
- `-e, --ext`: Extensão dos arquivos convertidos. Se não passada será gerado um arquivo `.docx` por padrão.
- `-t, --title`: Título do arquivo convertido. Se não passada será utilizado o título da publicação.

---

## Como contribuir

### Instalando o pub-gen

O pub-gen é um pacote do monorepo elucidario. Para instalar o pub-gen no monorepo execute:

```bash
pnpm i -w @elucidario/pkg-pub-gen
```

Para editar o pub-gen modifique os arquivos na pasta `packages/pub-gen`.

Os comandos a seguir são executados na raiz do pub-gen.

```bash
cd packages/pub-gen
```

### Build

Para gerar a build do pub-gen execute:

```bash
pnpm build
```

Neste comando serão gerados os arquivos `.md` da documentação na pasta `docs` e os arquivos `.json` na pasta `static`.

### Testes

Para executar os testes do pub-gen execute:

```bash
pnpm test
```

Cobertura de testes:

| File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------ | ------- | -------- | ------- | ------- | ----------------- |
| All files          | 96.05   | 70.76    | 100     | 95.94   |                   |
| createInput.js     | 87.5    | 83.33    | 100     | 87.5    | 28                |
| index.js           | 0       | 0        | 0       | 0       |                   |
| pubGenPrompt.js    | 88.23   | 50       | 100     | 88.23   | 71-74             |
| referencePrompt.js | 100     | 78.04    | 100     | 100     | 82-183,218-221    |

---

## todo

- [ ] revisar documentação
- [ ] Criar um preset para o padrão de publicação da APA
- [ ] Estabelecer um meio para que gere arquivos google-docs para diferentes presets.
- [ ] Possibilidade de permitir o uso de pastas ou arquivos com extensão `.md` para determinar seções do texto na pasta `content`.
