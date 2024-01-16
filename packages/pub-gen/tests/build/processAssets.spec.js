import path from "path";
import { processAssets } from "../../lib/build/processAssets.js";
import { getPaths } from "@elucidario/pkg-paths";
import { createFixture, getFixture } from "../__fixtures__/index.js";

describe("processAssets", () => {
    let assets = {};
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
        assets = getFixture("assets.json");
        expected = getFixture("processAssets.expected.json");
    });

    afterEach(() => {
        assets = {};
        expected = {};
    });

    it("processAssets throw error", async () => {
        await expect(processAssets()).rejects.toThrow("`args` is undefined");

        await expect(processAssets({})).rejects.toThrow(
            "`assets` is undefined",
        );

        await expect(processAssets({})).rejects.toThrow(
            "`assets` is undefined",
        );

        await expect(processAssets({ assets, index })).rejects.toThrow(
            "`required` is undefined",
        );

        await expect(
            processAssets({ assets, index, required: "banana" }),
        ).rejects.toThrow(
            "Doing it wrong: `required` is different from `assets`",
        );

        await expect(
            processAssets({ assets, index, required: "assets" }),
        ).rejects.toThrow("`distPath` is undefined");

        await expect(
            processAssets({
                assets,
                index: true,
                required: "assets",
                distPath: "",
            }),
        ).rejects.toThrow("`title` is undefined");

        await expect(
            processAssets({
                assets,
                index: true,
                required: "assets",
                distPath: "",
                title: "banana",
            }),
        ).rejects.toThrow("`title` is not an array");
    });

    it("processAssets custom index", async () => {
        const files = await processAssets({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            index,
            required: "assets",
            assets,
            distPath: path.resolve(
                getPaths().publications,
                "publicacao-teste",
                "dist",
                "pt-br",
            ),
            filePath: "internal/pos/lista-{*}",
        });

        expect(files).toMatchObject(expected);
    });

    it("processAssets default index", async () => {
        const files = await processAssets({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            required: "assets",
            assets,
            distPath: path.resolve(
                getPaths().publications,
                "publicacao-teste",
                "dist",
                "pt-br",
            ),
            filePath: "internal/pos/lista-{*}",
            title: [
                ["imagens", "Lista de imagens"],
                ["figuras", "Lista de figuras"],
                ["quadros", "Lista de quadros"],
                ["tabelas", "Lista de tabelas"],
            ],
        });

        expect(files).toMatchObject(expected);
    });
});
