import path from "path";
import { processLists } from "../../lib/build/processLists.js";
import { getPaths, createFile, writeFile } from "@elucidario/pkg-paths";

describe("processLists", () => {
    let expected = {};
    const index = {
        assets: {
            imagens: "Lista de imagens",
            figuras: "Lista de figuras",
            quadros: "Lista de quadros",
            tabelas: "Lista de tabelas",
        },
        acronyms: "Lista de abreviaturas e siglas",
        bibliography: "Bibliografia",
    };

    beforeEach(() => {
        expected = {
            name: "lista-abreviaturas-siglas",
            path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-br\\internal\\pre\\lista-abreviaturas-siglas.md",
            ext: "md",
            content:
                "# LISTA DE ABREVIATURAS E SIGLAS\n\n|  |  |  |\n| --- | --- | --- |\n| 1 | ABNT - Associação Brasileira de Normas Técnicas; |  |\n| 2 | APA - American Psychological Association; |  |",
        };
    });

    afterEach(() => {
        expected = {};
    });

    it("processLists throw error", async () => {
        await expect(processLists()).rejects.toThrow("`args` is undefined");

        await expect(processLists({})).rejects.toThrow(
            "`distPath` is undefined",
        );

        await expect(processLists({ distPath: "" })).rejects.toThrow(
            "`required` is undefined",
        );

        await expect(
            processLists({
                distPath: "",
                required: "acronyms",
            }),
        ).rejects.toThrow("`srcPath` is undefined");

        await expect(
            processLists({
                distPath: "",
                required: "acronyms",
                srcPath: path.resolve(
                    getPaths().publications,
                    "publicacao-teste",
                    "content",
                    "pt-br",
                ),
                index: true,
            }),
        ).rejects.toThrow("`filePath` is undefined");

        await expect(
            processLists({
                distPath: "",
                required: "acronyms",
                srcPath: path.resolve(
                    getPaths().publications,
                    "publicacao-teste",
                    "content",
                    "pt-br",
                ),
                filePath: "internal/pre/lista-abreviaturas-siglas",
                index: {},
            }),
        ).rejects.toThrow("`acronyms` property from `index` is undefined");
    });

    it("processLists custom index", async () => {
        const file = await processLists({
            required: "acronyms",
            filePath: "internal/pre/lista-abreviaturas-siglas",
            distPath: path.resolve(
                getPaths().publications,
                "publicacao-teste",
                "dist",
                "pt-br",
            ),
            srcPath: path.resolve(
                getPaths().publications,
                "publicacao-teste",
                "content",
                "pt-br",
            ),
            index,
        });

        createFile(
            {
                filePath: path.resolve(
                    getPaths().packages,
                    "pub-gen",
                    "tests",
                    "build",
                    "data",
                    "processLists.processed.json",
                ),
            },
            file,
        );

        expect(file).toMatchObject(expected);
    });

    it("processLists default index", async () => {
        const file = await processLists({
            required: "acronyms",
            filePath: "internal/pre/lista-abreviaturas-siglas",
            distPath: path.resolve(
                getPaths().publications,
                "publicacao-teste",
                "dist",
                "pt-br",
            ),
            srcPath: path.resolve(
                getPaths().publications,
                "publicacao-teste",
                "content",
                "pt-br",
            ),
            title: "Lista de abreviaturas e siglas",
        });

        expect(file).toMatchObject(expected);
    });
});
