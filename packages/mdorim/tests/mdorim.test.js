import { matchersWithOptions } from "jest-json-schema";

import mdorim from "../lib/mjs/index.mjs";

expect.extend(
    matchersWithOptions({
        schemas: [mdorim.schemas.mdorim.core, mdorim.schemas.mdorim.object],
    })
);

describe("Validate Schemas", () => {
    test("Core Schema must be valid", () => {
        expect(mdorim.schemas.mdorim.core).toBeValidSchema();
    });

    test("Object Schema must be valid", () => {
        expect(mdorim.schemas.mdorim.object).toBeValidSchema();
    });

    test("Options Schema must be valid", () => {
        expect(mdorim.schemas.mdorim.options).toBeValidSchema();
    });

    // test("definitions Object Schema must be valid", () => {
    //     expect(schemas.Object.definitions.Object).toBeValidSchema();
    // });

    // test( "LinkedArt schemas must be valid", () => {
    //     Object.values( schemas.LinkedArt ).forEach( ( schema ) => {
    //         expect( schema ).toBeValidSchema();
    //     } );
    // } );
});

describe("Validate Options Schema with data", () => {
    test("Storage Options data must be valid", () => {
        expect(mdorim.examples.storage.Options).toMatchSchema(
            mdorim.schemas.mdorim.options
        );
    });
});

describe("Validate Schemas with data", () => {
    // test("Object Schema must be valid", () => {
    //     expect(mdorim.examples.rest.RioJaneiro).toMatchSchema(
    //         mdorim.schemas.mdorim.object
    //     );
    // });
});
