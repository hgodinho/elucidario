import { matchersWithOptions } from "jest-json-schema";

import schemas from "../src/schemas";
import mapping from "../src/mapping";

expect.extend(
    matchersWithOptions({
        schemas: [schemas.Mapping.Schema],
    })
);

describe("Validate Schemas", () => {
    test("Schema must be valid", () => {
        expect(schemas.Mapping.Schema).toBeValidSchema();
    });
});

describe("Validate mapping schema with data", () => {
    test("Mapping schema must be valid", () => {
        expect(mapping["identified_by"]).toMatchSchema(schemas.Mapping.Schema);
    });
});
