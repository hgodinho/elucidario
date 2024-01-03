import path from "path";
import tableParser from "../../../lib/remark/table/tableParser";
import { readFile, getPaths } from "@elucidario/pkg-paths";
import testProcessor from "../../mocks/remarkProcessor";

describe("tableParser", () => {
    const tableContent = readFile(
        path.resolve(
            getPaths().publications,
            "publicacao-teste",
            "content",
            "pt-br",
            "internal",
            "body",
            "really",
            "first-level.md",
        ),
    ).value;

    it("should return tableParser node", async () => {
        const tableParserNode = await testProcessor(tableContent, {
            plugin: tableParser,
            pluginOptions: {
                publication: "publicacao-teste",
                lang: "pt-BR",
            },
            stringifyOptions: {},
            publication: "publicacao-teste",
            lang: "pt-BR",
        });

        expect(tableParserNode).toMatchSnapshot();
    });
});
