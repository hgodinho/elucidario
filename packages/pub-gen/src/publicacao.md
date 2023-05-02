---
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Publicação

## Criar uma nova publicação

```bash
pnpm pub-gen create
```

Responda as perguntas do prompt e o pub-gen irá criar uma pasta com o nome e os arquivos necessários para a publicação na pasta `publications` definida no `pub-gen-config.json`.

A pasta gerada seguirá a seguinte estrutura:

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
    │   ├── index.json
    ├── README.md
    ├── package.json
    |── pub-gen.json
    └── .gitignore
```

```bash
cd publications/<nome-da-publicacao>
```

Edite os arquivos na pasta `content` para adicionar o conteúdo da publicação. O arquivo `pub-gen.json` contém as configurações que descreve a publicação.

As referências criadas pelo comando `pnpm pub-gen add-ref -p <nome-da-publicacao>` são armazenadas na pasta `references` do monorepo e podem ser reutilizadas em outras publicações. Será criado um `index.json` na pasta `publications\<nome-da-publicacao>\references\` para acesso rápido à referência pela publicação. As referências são definidas em formato json-schema e seus schemas podem ser consultados no [reference-schema.json](/pub-gen/schemas/reference-schema).
