import path from "path";
import { processBibliography } from "../../lib/build/processBibliography.js";
import { createFixture, getFixture } from "../__fixtures__/index.js";

describe("processBibliography", () => {
    let expected = {};
    const index = {
        assets: {
            image: "Lista de imagens",
            figure: "Lista de figuras",
            chart: "Lista de quadros",
            table: "Lista de tabelas",
        },
        acronyms: "Lista de abreviaturas e siglas",
        bibliography: "Bibliografia",
    };

    beforeEach(() => {
        expected = getFixture("processBibliography.expected.json");
    });

    afterEach(() => {
        expected = {};
    });

    it("processBibliography throw error", async () => {
        await expect(processBibliography()).rejects.toThrow(
            "`args` is undefined",
        );

        await expect(processBibliography({})).rejects.toThrow(
            "`publication` is undefined",
        );

        await expect(
            processBibliography({ publication: "publicacao-teste" }),
        ).rejects.toThrow("`lang` is undefined");

        await expect(
            processBibliography({
                publication: "publicacao-teste",
                lang: "pt-BR",
            }),
        ).rejects.toThrow("`style` is undefined");

        await expect(
            processBibliography({
                publication: "publicacao-teste",
                lang: "pt-BR",
                style: {
                    name: "abnt",
                },
            }),
        ).rejects.toThrow("`csl` property from `style` is undefined");

        await expect(
            processBibliography({
                publication: "publicacao-teste",
                lang: "pt-BR",
                style: {
                    name: "abnt",
                    csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                },
            }),
        ).rejects.toThrow("`title` is undefined");

        await expect(
            processBibliography({
                publication: "publicacao-teste",
                lang: "pt-BR",
                index: {},
                style: {
                    name: "abnt",
                    csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                },
            }),
        ).rejects.toThrow("`bibliography` property from `index` is undefined");
    });

    it("processBibliography custom index", async () => {
        const file = await processBibliography({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            index,
            filePath: "internal/pos/referencias",
        });

        expect(file).toMatchObject(expected);
    });

    it("processBibliography default index", async () => {
        const file = await processBibliography({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            filePath: "internal/pos/referencias",
            title: "Bibliografia",
        });

        expect(file).toMatchObject(expected);
    });
});
