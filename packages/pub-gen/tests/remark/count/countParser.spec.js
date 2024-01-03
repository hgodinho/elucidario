import path from "path";

import countParser from "../../../lib/remark/count/countParser";
import { readFile, getPaths } from "@elucidario/pkg-paths";

import testProcessor from "../../mocks/remarkProcessor";
import { packageJson } from "../../../lib/utils";

describe("countParser", () => {
    const countContent = readFile(
        path.resolve(
            getPaths().publications,
            "publicacao-teste",
            "content",
            "pt-br",
            "internal",
            "body",
            "hello-world.md",
        ),
    ).value;

    const pkg = packageJson("publicacao-teste");

    it("should return countParser node", async () => {
        const countParserNode = await testProcessor(countContent, {
            plugin: countParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
                pkg,
                assets: {},
                assetsTitles: [
                    ["imagens", "Lista de imagens"],
                    ["figuras", "Lista de figuras"],
                    ["quadros", "Lista de quadros"],
                    ["tabelas", "Lista de tabelas"],
                ],
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });

        expect(countParserNode).toMatchSnapshot();
    });
});
