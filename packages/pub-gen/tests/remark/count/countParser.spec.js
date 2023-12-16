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
            "hello-world.md",
        ),
    ).content;

    const pkg = packageJson("publicacao-teste");

    it("should return countParser node", async () => {
        const countParserNode = await testProcessor(countContent, {
            plugin: countParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
                pkg,
                assets: {},
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });

        expect(countParserNode).toMatchSnapshot();
    });
});
