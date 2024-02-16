import path from "path";

import imageParser from "../../../lib/remark/image/imageParser";
import { readFile, getPaths } from "@elucidario/pkg-paths";

import testProcessor from "../../mocks/remarkProcessor";
import { packageJson } from "../../../lib/utils";

describe("imageParser", () => {
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

    it("should return imageParser node", async () => {
        const imageParserNode = await testProcessor(mermaidContent, {
            plugin: imageParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
                pkg,
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });

        expect(imageParserNode).toMatchSnapshot();
    });
});
