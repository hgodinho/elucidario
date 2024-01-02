import path from "path";

import embedParser from "../../../lib/remark/embed/embedParser";
import { readFile, getPaths } from "@elucidario/pkg-paths";

import testProcessor from "../../mocks/remarkProcessor";

describe("embedParser", () => {
    const embedContent = readFile(
        path.resolve(
            getPaths().publications,
            "publicacao-teste",
            "content",
            "pt-br",
            "internal",
            "body",
            "nodes",
            "embed.md",
        ),
    ).content;

    it("should return embedParser node", async () => {
        const embedParserNode = await testProcessor(embedContent, {
            plugin: embedParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });
        expect(embedParserNode).toMatchSnapshot();
    });
});
