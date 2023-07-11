import { matchersWithOptions } from "jest-json-schema";

import mdorim from "../lib/mjs/index";

expect.extend(
    matchersWithOptions({
        schemas: [mdorim.schemas.mapping],
    })
);

describe("Validate Schemas", () => {
    test("Schema must be valid", () => {
        expect(mdorim.schemas.mapping).toBeValidSchema();
    });
});

describe("Validate mapping schema with data", () => {
    test("identified_by mapping must be valid", () => {
        expect(mdorim.mapping.identified_by).toMatchSchema(
            mdorim.schemas.mapping
        );
    });
});
