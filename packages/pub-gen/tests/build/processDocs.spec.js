import { processDocs } from "../../lib/build/processDocs.js";
import { processIndexFiles } from "../../lib/build/processIndexFiles.js";
import { packageJson } from "../../lib/utils.js";

const index = {
    images: ["imagem-1", "imagem-2"],
    figures: ["figura-1", "figura-2"],
    tables: ["tabela-1", "tabela-2"],
    charts: ["grafico-1", "grafico-2"],
};

describe("processIndexFiles", () => {
    it("should return the index files", async () => {
        const processed = await processIndexFiles({
            assets: index,
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
    const pkg = packageJson("publicacao-teste");

    it("should return the docs", async () => {
        const processed = await processDocs({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            version: "1.0.0",
            assets: index,
            pkg,
        });

        expect(processed).toMatchObject({
            content: [
                {
                    original: {
                        name: "first-level",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\content\\pt-BR\\really\\first-level.md",
                        ext: "md",
                        size: 46,
                    },
                    processed: {
                        data: {},
                        messages: [],
                        history: [],
                        cwd: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\pub-gen",
                        value:
                            "# First level\n" +
                            "\n" +
                            "**Quadro 3: Teste Tabela.**\\\n" +
                            "\\\n" +
                            "| Name       | ID |\n" +
                            "| :--------- | -- |\n" +
                            "| John Doe   | 1  |\n" +
                            "| John Smith | 3  |\\\n" +
                            "\\\n" +
                            "**Fonte**: Elaborado pelo autor.\\\n" +
                            "\\\n",
                    },
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\first-level.md",
                },
                {
                    original: {
                        name: "second-level",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\content\\pt-BR\\really\\deep\\second-level.md",
                        ext: "md",
                        size: 17,
                    },
                    processed: {
                        data: {},
                        messages: [],
                        history: [],
                        cwd: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\pub-gen",
                        value: "## Second level\n",
                    },
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\deep\\second-level.md",
                },
                {
                    original: {
                        name: "third-level",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\content\\pt-BR\\really\\deep\\nested\\third-level.md",
                        ext: "md",
                        size: 17,
                    },
                    processed: {
                        data: {},
                        messages: [],
                        history: [],
                        cwd: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\pub-gen",
                        value: "### Third level\n",
                    },
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\deep\\nested\\third-level.md",
                },
                {
                    original: {
                        name: "file",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\content\\pt-BR\\really\\deep\\nested\\file\\file.md",
                        ext: "md",
                        size: 14,
                    },
                    processed: {
                        data: {},
                        messages: [],
                        history: [],
                        cwd: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\pub-gen",
                        value: "rock bottom.\n",
                    },
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\really\\deep\\nested\\file\\file.md",
                },
                {
                    original: {
                        name: "hello-world",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\content\\pt-BR\\hello-world.md",
                        ext: "md",
                        size: 847,
                    },
                    processed: {
                        data: {},
                        messages: [],
                        history: [],
                        cwd: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\pub-gen",
                        value:
                            "# Hello World\n" +
                            "\n" +
                            "## Second level heading\n" +
                            "\n" +
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var (LINKED ART, 2021a).\n" +
                            "\n" +
                            "**Figura 3: Mermaid**\n" +
                            "\n" +
                            '```{.mermaid&#x20;filename=mermaid&#x20;loc="C:\\\\\\Users\\\\\\55119\\\\\\Elucidário.art\\\\\\elucidario\\\\\\publications\\\\\\publicacao-teste\\\\\\files\\\\\\generated"&#x20;width=720&#x20;background=transparent}\n' +
                            "erDiagram\r\n" +
                            '        OBJETO ||--|{ CLASSIFICACAO : ""\n' +
                            "```\n" +
                            "\n" +
                            "**Fonte:** Elaborado pelo autor.\n" +
                            "\n" +
                            "### Third level heading\n" +
                            "\n" +
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var. (LINKED ART, 2021a)\n" +
                            "\n" +
                            "#### Fourth level heading\n" +
                            "\n" +
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var. (LINKED ART, 2021b)\n" +
                            "\n" +
                            "##### Fifth level heading\n" +
                            "\n" +
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var. (LINKED ART, 2021a, 2021b)\n" +
                            "\n" +
                            "###### Sixth level heading\n" +
                            "\n" +
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae diam eget risus var.\n" +
                            "\n" +
                            "**Figura 4: Lorem ipsum**\n" +
                            "\n" +
                            "![Lorem ipsum](/../../files/static/lorem-ipsum.jpeg)\n",
                    },
                    path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\hello-world.md",
                },
            ],
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
                    "| 3 | **Mermaid** |  |\n" +
                    "| 4 | **Lorem ipsum** |  |",
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
            assets: {
                static: [
                    {
                        name: "lorem-ipsum",
                        path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\files\\static\\lorem-ipsum.jpeg",
                        ext: "jpeg",
                        content: "",
                        size: 316922,
                    },
                ],
            },
        });
    });
});
