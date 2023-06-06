import { matchersWithOptions } from "jest-json-schema";

import metadata from "../static/mdorim/schemas/metadata.json";
import Concept from "../static/mdorim/schemas/Concept.json";
import Object from "../static/mdorim/schemas/Object.json";
import User from "../static/mdorim/schemas/User.json";

expect.extend(
    matchersWithOptions({
        schemas: [metadata, Concept],
    })
);

describe("valida schemas", () => {
    test("metadata schema deve ser válido", () => {
        expect(metadata).toBeValidSchema();
    });
    test("Concept schema deve ser válido", () => {
        expect(Concept).toBeValidSchema();
    });
    test("Object schema deve ser válido", () => {
        expect(Object).toBeValidSchema();
    });
    test("User schema deve ser válido", () => {
        expect(User).toBeValidSchema();
    });
});

describe("valida storage schema entidades com dados", () => {});
