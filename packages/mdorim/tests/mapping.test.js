import { matchersWithOptions } from "jest-json-schema";

import mdorim from "../lib/mjs/index";

expect.extend(
    matchersWithOptions({
        schemas: [mdorim.schemas.mapping],
    }),
);

describe("Validate Schemas", () => {
    test("Schema must be valid", () => {
        expect(mdorim.schemas.mapping).toBeValidSchema();
    });
});

describe("Validate mapping schema with data", () => {
    test("Mapping must be valid", () => {
        expect(mdorim.mapping.mapping_test).toMatchSchema(
            mdorim.schemas.mapping,
        );
    });
});
