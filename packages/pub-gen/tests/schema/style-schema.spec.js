import path from "path";
import { SchemaValidator } from "@elucidario/pkg-schema-validator";
import { readFile, getPaths } from "@elucidario/pkg-paths";

const styleSchema = readFile(
    path.resolve(
        getPaths().packages,
        "pub-gen",
        "static",
        "pub-gen",
        "schemas",
        "style-schema.json",
    ),
).value;

const validator = new SchemaValidator();

describe("style-schema abnt", () => {
    const abnt = readFile(
        path.resolve(
            getPaths().packages,
            "pub-gen",
            "lib",
            "styles",
            "abnt-dissertation.json",
        ),
    ).value;

    it("should validate data against schema", () => {
        const validate = validator.validate({
            schema: styleSchema,
            data: abnt,
        });

        if (!validate) console.error(validator.getErrors());

        expect(validate).toBeTruthy();
    });
});
