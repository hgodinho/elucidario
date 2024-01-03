import path from "path";
import { processBibliography } from "../../lib/build/processBibliography.js";
import { getPaths, createFile } from "@elucidario/pkg-paths";

describe("processBibliography", () => {
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
            name: "referencias",
            path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\publications\\publicacao-teste\\dist\\pt-BR\\internal\\pos\\referencias.md",
            ext: "md",
            value: "# Bibliografia\n\nLINKED ART. **Linked Art**. 2021a. Disponível em: https://linked.art/. Acesso em: 20 maio. 2023\\. \n\nLINKED ART. **Community - Linked Art**. 2021b. Disponível em: https://linked.art/community/. Acesso em: 20 maio. 2023\\.",
        };
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
