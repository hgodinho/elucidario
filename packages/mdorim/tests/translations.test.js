import { matchersWithOptions } from "jest-json-schema";

import schemas from "../src/schemas";
import translations from "../src/translations";

expect.extend(
    matchersWithOptions({
        schemas: [schemas.JsonUi.Schema],
    })
);

describe("Validate JSON-UI Schema", () => {
    test("JSON-UI Schema must be valid", () => {
        expect(schemas.JsonUi.Schema).toBeValidSchema();
    });
});

describe("Validate translations", () => {
    test("Translations must adhere to schema", () => {
        expect(translations).toMatchSchema(schemas.JsonUi.Schema);
    });
});

// describe("Validate Snapshots", () => {
//     test("Snapshots must be equal", () => {
//         expect(translations).toMatchSnapshot();
//     });
// });
