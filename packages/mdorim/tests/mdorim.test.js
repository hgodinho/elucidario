import { matchersWithOptions } from "jest-json-schema";

import schemas from "../src/schemas";
import examples from "../src/examples";

import * as mdorim from "../static/mdorim";

console.log({ mdorim });

expect.extend(
    matchersWithOptions({
        schemas: [...Object.values(schemas.LinkedArt), schemas.Core],
    })
);

describe("Validate Schemas", () => {
    test("Core Schema must be valid", () => {
        expect(schemas.Core).toBeValidSchema();
    });

    test("Object Schema must be valid", () => {
        expect(schemas.Object).toBeValidSchema();
    });

    test("definitions Object Schema must be valid", () => {
        expect(schemas.Object.definitions.Object).toBeValidSchema();
    });

    // test( "LinkedArt schemas must be valid", () => {
    //     Object.values( schemas.LinkedArt ).forEach( ( schema ) => {
    //         expect( schema ).toBeValidSchema();
    //     } );
    // } );
});

describe("Validate Schemas with data", () => {
    test("Object Schema must be valid", () => {
        expect(examples.Storage.Object).toMatchSchema(schemas.Object);
    });
});
