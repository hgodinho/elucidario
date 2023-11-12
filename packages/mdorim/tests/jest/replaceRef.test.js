import { replaceRef } from "../../src/build/replaceRef";

describe("replaceRef", () => {
    test("replaceRef external ref", () => {
        const schema = {
            $ref: "<local>/core.json",
        };
        expect(replaceRef(schema, true, "http://test.com")).toEqual({
            $ref: "http://test.com/schemas/mdorim/core.json",
        });
    });

    test("replaceRef external ref with no ref", () => {
        const schema = {
            $ref: "<local>/core.json",
        };
        expect(() => replaceRef(schema, true)).toThrow();
    });

    test("replaceRef external false", () => {
        const schema = {
            $ref: "<local>/core.json",
        };
        expect(replaceRef(schema)).toEqual({
            $ref: "./core.json",
        });
    });

    test("replaceRef deep nested external false", () => {
        const schema = {
            $ref: "<local>/core.json",
            properties: {
                $ref: "<local>/core.json",
                properties: {
                    $ref: "<local>/core.json",
                },
            },
        };
        expect(replaceRef(schema)).toEqual({
            $ref: "./core.json",
            properties: {
                $ref: "./core.json",
                properties: {
                    $ref: "./core.json",
                },
            },
        });
    });

    test("replaceRef deep nested external ref", () => {
        const schema = {
            $ref: "<local>/core.json",
            properties: {
                $ref: "<local>/core.json",
                properties: {
                    $ref: "<local>/core.json",
                },
            },
        };
        expect(replaceRef(schema, true, "http://test.com")).toEqual({
            $ref: "http://test.com/schemas/mdorim/core.json",
            properties: {
                $ref: "http://test.com/schemas/mdorim/core.json",
                properties: {
                    $ref: "http://test.com/schemas/mdorim/core.json",
                },
            },
        });
    });
});
