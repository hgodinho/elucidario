import { SchemaValidator } from "../dist/mjs";

const validator = new SchemaValidator();

import objectJson from "./data/object.json";
import principalJson from "./data/principal.json";
import definitionsJson from "./data/definitions.json";
import definitionsJson2 from "./data/definitions2.json";

test("validate should return true if right schema and data", () => {
    const validate = validator.validate({
        schema: objectJson,
        data: {
            id: 1,
            name: "John Doe",
        },
    });

    expect(validate).toBe(true);
});

test("validate should return false if wrong schema or data", () => {
    const validate = validator.validate({
        schema: objectJson,
        data: {
            id: 1,
            name: 123,
        },
    });

    expect(validate).toBe(false);

    const validate2 = validator.validate({
        schema: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
            },
        },
        data: {
            id: 1,
            name: "John Doe",
        },
    });

    expect(validate2).toBe(false);
});

test("validate should return true if right schema and data with $ref", () => {
    const validate = validator.validate({
        schema: principalJson,
        data: {
            id: 1,
            name: "John",
            anotherName: "Doe",
        },
        schemas: [definitionsJson, definitionsJson2],
    });

    expect(validate).toBe(true);
});

test("validate getErrors should return errors if wrong schema or data", () => {
    const validate = validator.validate({
        schema: objectJson,
        data: {
            id: 1,
            name: 123,
        },
    });

    expect(validate).toBe(false);

    const errors = validator.getErrors();

    expect(errors).toEqual([
        {
            path: ["name"],
            property: "instance.name",
            message: "is not of a type(s) string",
            schema: { type: "string" },
            instance: 123,
            name: "type",
            argument: ["string"],
            stack: "instance.name is not of a type(s) string",
        },
    ]);
});
