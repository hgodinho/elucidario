import path from "path";

import mermaidParser from "../../../lib/remark/mermaid/mermaidParser";
import { readFile, getPaths } from "@elucidario/pkg-paths";

import testProcessor from "../../mocks/remarkProcessor";
import { packageJson } from "../../../lib/utils";

describe("mermaidParser", () => {
    const mermaidContent = readFile(
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

    it("should return mermaidParser node", async () => {
        const mermaidParserNode = await testProcessor(mermaidContent, {
            plugin: mermaidParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
                pkg,
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });
        expect(mermaidParserNode).toMatchSnapshot();
    });
});
