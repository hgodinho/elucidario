import { processDocs } from "../../lib/build/processDocs.js";
import { processIndexFiles } from "../../lib/build/processIndexFiles.js";

const index = {
    images: ["imagem-1", "imagem-2"],
    figures: ["figura-1", "figura-2"],
    tables: ["tabela-1", "tabela-2"],
    charts: ["grafico-1", "grafico-2"],
};

describe("processIndexFiles", () => {
    it("should return the index files", async () => {
        const processed = await processIndexFiles({
            index,
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: "abnt",
            version: "1.0.0",
        });

        expect(processed).toMatchObject({
            images:
                "# LISTA DE IMAGENS\n" +
                "\n" +
                "|  |  |  |\n" +
                "| --- | --- | --- |\n" +
                "| 1 | imagem-1 |  |\n" +
                "| 2 | imagem-2 |  |",
            figures:
                "# LISTA DE FIGURAS\n" +
                "\n" +
                "|  |  |  |\n" +
                "| --- | --- | --- |\n" +
                "| 1 | figura-1 |  |\n" +
                "| 2 | figura-2 |  |",
            tables:
                "# LISTA DE TABELAS\n" +
                "\n" +
                "|  |  |  |\n" +
                "| --- | --- | --- |\n" +
                "| 1 | tabela-1 |  |\n" +
                "| 2 | tabela-2 |  |",
            charts:
                "# LISTA DE QUADROS\n" +
                "\n" +
                "|  |  |  |\n" +
                "| --- | --- | --- |\n" +
                "| 1 | grafico-1 |  |\n" +
                "| 2 | grafico-2 |  |",
            acronyms:
                "# LISTA DE SIGLAS E ABREVIATURAS\n" +
                "\n" +
                "|  |  |  |\n" +
                "| --- | --- | --- |\n" +
                "| 1 | ABNT - Associação Brasileira de Normas Técnicas; |  |\n" +
                "| 2 | APA - American Psychological Association. |  |",
        });
    });
});

describe("processDocs", () => {
    it("should return the docs", async () => {
        const processed = await processDocs({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: "abnt",
            version: "1.0.0",
            attachmentIndex: index,
        });

        // console.log(processed);

        expect(processed).toMatchObject({
            indexFiles: {
                images:
                    "# LISTA DE IMAGENS\n" +
                    "\n" +
                    "|  |  |  |\n" +
                    "| --- | --- | --- |\n" +
                    "| 1 | imagem-1 |  |\n" +
                    "| 2 | imagem-2 |  |",
                figures:
                    "# LISTA DE FIGURAS\n" +
                    "\n" +
                    "|  |  |  |\n" +
                    "| --- | --- | --- |\n" +
                    "| 1 | figura-1 |  |\n" +
                    "| 2 | figura-2 |  |\n" +
                    "| 3 | Mermaid |  |",
                tables:
                    "# LISTA DE TABELAS\n" +
                    "\n" +
                    "|  |  |  |\n" +
                    "| --- | --- | --- |\n" +
                    "| 1 | tabela-1 |  |\n" +
                    "| 2 | tabela-2 |  |",
                charts:
                    "# LISTA DE QUADROS\n" +
                    "\n" +
                    "|  |  |  |\n" +
                    "| --- | --- | --- |\n" +
                    "| 1 | grafico-1 |  |\n" +
                    "| 2 | grafico-2 |  |\n" +
                    "| 3 | Teste Tabela. |  |",
                acronyms:
                    "# LISTA DE SIGLAS E ABREVIATURAS\n" +
                    "\n" +
                    "|  |  |  |\n" +
                    "| --- | --- | --- |\n" +
                    "| 1 | ABNT - Associação Brasileira de Normas Técnicas; |  |\n" +
                    "| 2 | APA - American Psychological Association. |  |",
            },
            content: [
                {
                    name: "hello-world",
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\hello-world.md",
                    ext: "md",
                    content:
                        "# Hello World\r\n" +
                        "\r\n" +
                        "## Second level heading\r\n" +
                        "\r\n" +
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var.\r\n" +
                        "\r\n" +
                        "**Figura 3: Mermaid**\r\n" +
                        "\r\n" +
                        '```{.mermaid filename="mermaid" loc="C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\files\\generated\\1.0.0" width=720 background=transparent}\r\n' +
                        "   erDiagram\r\n" +
                        '        OBJETO ||--|{ CLASSIFICACAO : ""\r\n' +
                        "\r\n" +
                        "```\r\n" +
                        "\r\n" +
                        "**Fonte:** Elaborado pelo autor.\r\n" +
                        "\r\n" +
                        "### Third level heading\r\n" +
                        "\r\n" +
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var.\r\n" +
                        "\r\n" +
                        "#### Fourth level heading\r\n" +
                        "\r\n" +
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var.\r\n" +
                        "\r\n" +
                        "##### Fifth level heading\r\n" +
                        "\r\n" +
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var.\r\n" +
                        "\r\n" +
                        "###### Sixth level heading\r\n" +
                        "\r\n" +
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var.\r\n",
                },
                {
                    name: "second-level",
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\deep\\second-level.md",
                    ext: "md",
                    content: "## Second level\r\n",
                },
                {
                    name: "third-level",
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\deep\\nested\\third-level.md",
                    ext: "md",
                    content: "### Third level\r\n",
                },
                {
                    name: "file",
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\deep\\nested\\file\\file.md",
                    ext: "md",
                    content: "rock bottom.\r\n",
                },
                {
                    name: "first-level",
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\first-level.md",
                    ext: "md",
                    content:
                        "# First level\r\n" +
                        "\r\n" +
                        "**Quadro 3: Teste Tabela.**\r\n" +
                        "\r\n" +
                        "| Name       | ID  |\r\n" +
                        "| ---------- | --- |\r\n" +
                        "| John Doe   | 1   |\r\n" +
                        "| John Smith | 3   |\r\n" +
                        "\r\n" +
                        "**Fonte**: Elaborado pelo autor.\r\n",
                },
            ],
            assets: {
                static: [
                    {
                        name: "lorem-ipsum",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\files\\static\\lorem-ipsum.jpeg",
                        ext: "jpeg",
                        content: "",
                        size: 316922,
                        // atime: 2023-11-29T02:13:43.019Z,
                        // mtime: 2023-11-28T02:28:43.297Z,
                        // ctime: 2023-11-28T02:29:05.759Z,
                        // birthtime: 2023-11-28T02:28:59.471Z
                    },
                ],
            },
        });
    });
});
