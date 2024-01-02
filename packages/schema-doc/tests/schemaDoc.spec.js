import { schemaDoc } from "../dist/mjs";
import { readFile } from "@elucidario/pkg-paths";

const schema = readFile("tests/data/schema.json");

describe("schemaDoc", () => {
    it("should return a markdown string", () => {
        const docs = schemaDoc(schema);

        // console.log("schema", docs);
        // console.log("markdown", docs.markdown);
        // docs.markdown.map((md) => console.log(md));
    });
});
