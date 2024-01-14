import path from "path";
import { processLists } from "../../lib/build/processLists.js";
import { getPaths } from "@elucidario/pkg-paths";
import { createFixture, getFixture } from "../__fixtures__/index.js";

describe("processLists", () => {
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
        expected = getFixture("processLists.expected.json");
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

        createFixture("processLists.expected.json", file);

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
