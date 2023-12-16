import path from "path";

import codeParser from "../../../lib/remark/code/codeParser";
import { readFile, getPaths } from "@elucidario/pkg-paths";

import testProcessor from "../../mocks/remarkProcessor";

describe("codeParser", () => {
    const codeContent = readFile(
        path.resolve(
            getPaths().publications,
            "publicacao-teste",
            "content",
            "pt-br",
            "nodes",
            "code.md"
        )
    ).content;

    it("should return codeParser node", async () => {
        const codeParserNode = await testProcessor(codeContent, {
            plugin: codeParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });

        expect(codeParserNode).toMatchSnapshot();
    });
});
