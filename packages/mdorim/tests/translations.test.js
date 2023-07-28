import { matchersWithOptions } from "jest-json-schema";

import mdorim from "../lib/mjs/index.mjs";

expect.extend(
    matchersWithOptions({
        schemas: [mdorim.schemas.jsonUi],
    }),
);

describe("Validate JSON-UI Schema", () => {
    test("JSON-UI Schema must be valid", () => {
        expect(mdorim.schemas.jsonUi).toBeValidSchema();
    });
});

describe("Validate translations", () => {
    test("Translations must adhere to schema", () => {
        expect(mdorim.translations).toMatchSchema(mdorim.schemas.jsonUi);
    });
});

// describe("Validate Snapshots", () => {
//     test("Snapshots must be equal", () => {
//         expect(translations).toMatchSnapshot();
//     });
// });
