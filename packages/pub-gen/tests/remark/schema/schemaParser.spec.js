import schemaParser from "../../../lib/remark/schema/schemaParser.js";

describe.skip("schemaParser", () => {
    it("should return schema node", async () => {
        const schemaNode = await schemaParser({
            publication: "publicacao-teste",
            lang: "pt-BR",
            filePath: "nodes/schema.json",
            fileOptions: {},
            docxProcessor: "pandoc",
        });

        console.log(schemaNode);

        // expect(schemaNode).toMatchSnapshot();
    });
});
