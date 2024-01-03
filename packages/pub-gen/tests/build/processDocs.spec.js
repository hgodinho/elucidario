import path from "path";
import { processDocs } from "../../lib/build/processDocs.js";
import { packageJson } from "../../lib/utils.js";
import { createFile, getPaths, readFile } from "@elucidario/pkg-paths";

describe("processDocs", () => {
    const pkg = packageJson("publicacao-teste");

    let expected = {};
    let assets = {};
    beforeEach(() => {
        expected = readFile(
            path.resolve(
                getPaths().packages,
                "pub-gen",
                "tests",
                "build",
                "data",
                "processDocs.expected.json",
            ),
        ).value;

        assets = readFile(
            path.resolve(
                getPaths().packages,
                "pub-gen",
                "tests",
                "build",
                "data",
                "assets.json",
            ),
        ).value;
    });

    afterEach(() => {
        expected = {};
        assets = {};
    });

    it("processDocs throw error", async () => {
        await expect(processDocs()).rejects.toThrow("`args` is undefined");

        await expect(processDocs({})).rejects.toThrow(
            "`publication` is undefined",
        );

        await expect(
            processDocs({ publication: "publicacao-teste" }),
        ).rejects.toThrow("`lang` is undefined");

        await expect(
            processDocs({
                publication: "publicacao-teste",
                lang: "pt-BR",
            }),
        ).rejects.toThrow("`type` is undefined");

        await expect(
            processDocs({
                publication: "publicacao-teste",
                lang: "pt-BR",
                type: "dissertation",
            }),
        ).rejects.toThrow("`style` is undefined");

        await expect(
            processDocs({
                publication: "publicacao-teste",
                lang: "pt-BR",
                type: "dissertation",
                style: {
                    name: "abnt",
                },
            }),
        ).rejects.toThrow("`csl` property from `style` is undefined");
    });

    it("processDocs custom index", async () => {
        const processed = await processDocs({
            publication: "publicacao-teste",
            lang: "pt-BR",
            type: "dissertation",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            index: {
                assets: {
                    imagens: "Lista de imagens",
                    figuras: "Lista de figuras",
                    quadros: "Lista de quadros",
                    tabelas: "Lista de tabelas",
                },
                acronyms: "Lista de abreviaturas e siglas",
                bibliography: "Bibliografia",
            },
            version: "1.0.0",
            assets,
            pkg,
        });

        // createFile(
        //     path.resolve(
        //         getPaths().packages,
        //         "pub-gen",
        //         "tests",
        //         "build",
        //         "data",
        //         "processDocs.processed.json",
        //     ),
        //     processed,
        // );

        expect(processed).toMatchObject(expected);
    });

    it("processDocs default index", async () => {
        const processed = await processDocs({
            publication: "publicacao-teste",
            lang: "pt-BR",
            type: "dissertation",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            version: "1.0.0",
            assets,
            pkg,
        });

        // createFile(
        //     {
        //         filePath: path.resolve(
        //             getPaths().packages,
        //             "pub-gen",
        //             "tests",
        //             "build",
        //             "data",
        //             "processDocs.processed.json",
        //         ),
        //         ext: "json",
        //     },
        //     processed,
        // );

        expect(processed).toMatchObject(expected);
    });
});
