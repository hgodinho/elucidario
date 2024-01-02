import { replaceRef } from "../dist/mjs/index.mjs";

describe("replaceRef function", () => {
    const schema1 = {
        $ref: "<example>/definitions/schemas",
    };
    const schema2 = {
        type: "array",
        items: {
            oneOf: [
                {
                    $ref: "<example>/definitions/schemas",
                },
                {
                    $ref: "<example>/definitions/schemas",
                },
            ],
        },
    };
    const schema3 = {
        type: "object",
        properties: {
            type: {
                $ref: "<example>/definitions/schemas",
            },
            another: {
                $ref: "<example>/definitions/schemas",
            },
        },
    };

    it("should replace schema1", () => {
        const expectedOutput = {
            $ref: "https://example.com/definitions/schemas",
        };

        const output = replaceRef(schema1, [
            ["example", "https://example.com"],
        ]);

        expect(output).toEqual(expectedOutput);
    });

    it("should replace schema2", () => {
        const expectedOutput = {
            type: "array",
            items: {
                oneOf: [
                    {
                        $ref: "https://example.com/definitions/schemas",
                    },
                    {
                        $ref: "https://example.com/definitions/schemas",
                    },
                ],
            },
        };

        const output = replaceRef(schema2, [
            ["example", "https://example.com"],
        ]);

        expect(output).toEqual(expectedOutput);
    });

    it("should replace schema3", () => {
        const expectedOutput = {
            type: "object",
            properties: {
                type: {
                    $ref: "https://example.com/definitions/schemas",
                },
                another: {
                    $ref: "https://example.com/definitions/schemas",
                },
            },
        };

        const output = replaceRef(schema3, [
            ["example", "https://example.com"],
        ]);

        expect(output).toEqual(expectedOutput);
    });
});
