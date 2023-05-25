import { describe, it, expect } from "@jest/globals";
import { mappingTable, metaType, resolveRef } from "../dist";
import {
    Mapping,
    BaseSchema,
    DataTypes,
    AnyOfSchema,
    OneOfSchema,
    ArraySchema,
} from "@elucidario/pkg-types";


describe("metaType function", () => {
    it("should be a object type", () => {
        const schema: BaseSchema<DataTypes> = {
            type: "object",
            description: "description",
            properties: {
                first: {
                    type: "string",
                },
                second: {
                    type: "string",
                },
            },
        };
        const expectedOutput = `> type \`${schema.type}\` with properties`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a array type", () => {
        const schema: ArraySchema = {
            type: "array",
            description: "description",
            items: {
                type: "string",
            },
        };
        const expectedOutput = `> type array<\`${schema.items.type}\`>`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a array type with anyOf property", () => {
        const schema: AnyOfSchema = {
            type: "array",
            items: {
                anyOf: [
                    {
                        $ref: "#/definitions/schemas",
                    },
                    {
                        $ref: "#/definitions/schemas",
                    },
                ],
            },
        };
        const expectedOutput = `> type ${schema.type}<anyOf\<[\`schemas\`](#schemas) | [\`schemas\`](#schemas)\>>`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a array type with oneOf property", () => {
        const schema: OneOfSchema = {
            type: "array",
            items: {
                oneOf: [
                    {
                        $ref: "#/definitions/schemas",
                    },
                    {
                        $ref: "#/definitions/schemas",
                    },
                ],
            },
        };
        const expectedOutput = `> type \`${schema.type}\` oneOf\<[\`schemas\`](#schemas) | [\`schemas\`](#schemas)\>`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a array with title property", () => {
        const schema: ArraySchema = {
            type: "array",
            description: "description",
            items: {
                title: "title",
                type: "string",
            },
        };
        const expectedOutput = `> type array<[\`${schema.items.title}\`](#${schema.items.title})>`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });

    it("should be a string type", () => {
        const schema: BaseSchema<DataTypes> = {
            type: "string",
            description: "description",
        };
        const expectedOutput = `> type \`${schema.type}\``;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a null type", () => {
        const schema: BaseSchema<DataTypes> = {
            type: null,
            description: "description",
        };
        const expectedOutput = `> type \`${schema.type}\``;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
});

describe("resolveRef function", () => {
    it("should resolve a http ref", () => {
        const ref = "https://example.com"
        const expectedOutput = `[https://example.com](https://example.com)`;
        const output = resolveRef(ref);
        expect(output).toEqual(expectedOutput);
    });
    it("should resolve a http ref with codeInline", () => {
        const ref = "https://example.com"
        const expectedOutput = `[\`https://example.com\`](https://example.com)`;
        const output = resolveRef(ref, true);
        expect(output).toEqual(expectedOutput);
    });
    it("should resolve a ref in definitions", () => {
        const ref = "#/definitions/schemas"
        const expectedOutput = `[schemas](#schemas)`;
        const output = resolveRef(ref);
        expect(output).toEqual(expectedOutput);
    });
    it("should resolve a ref in definitions with codeInline", () => {
        const ref = "#/definitions/schemas"
        const expectedOutput = `[\`schemas\`](#schemas)`;
        const output = resolveRef(ref, true);
        expect(output).toEqual(expectedOutput);
    });
    it("should resolve a ref in <local>", () => {
        const ref = "<local>/metadata.json#/definitions/schemas"
        const expectedOutput = `[schemas](https://elucidario.art/metadata.json#/definitions/schemas)`;
        const output = resolveRef(ref, false, "https://elucidario.art");
        expect(output).toEqual(expectedOutput);
    });
    it("should resolve a ref in <local> with codeInline", () => {
        const ref = "<local>/metadata.json#/definitions/schemas"
        const expectedOutput = `[\`schemas\`](https://elucidario.art/metadata.json#/definitions/schemas)`;
        const output = resolveRef(ref, true, "https://elucidario.art");
        expect(output).toEqual(expectedOutput);
    });
    it("should throw an error when <local> is defined and no base parameter is passed", () => {
        const ref = "<local>/metadata.json#/definitions/schemas"
        expect(() => resolveRef(ref)).toThrowError("Found <local> definition but no base parameter.");
    });
});

describe("mappingTable function", () => {
    it("should create a mapping table", () => {
        const rows: Mapping = {
            first: "second",
            third: "fourth",
        };
        const expectedOutput = `#### Mapping\n\n| Vocabulary | Link |\n| --- | --- |\n| first | <second> |\n| third | <fourth> |`;
        const output = mappingTable(rows);
        expect(output).toEqual(expectedOutput);
    });
    it("should return an empty string when undefined map are passed", () => {
        const expectedOutput = "";
        const output = mappingTable(undefined);
        expect(output).toEqual(expectedOutput);
    });

});


// describe("propertiesTable", () => {
//     const schema: BaseSchema<DataTypes> = {
//         type: "object",
//         description: "description",
//         properties: {
//             first: {
//                 type: "string",
//                 description: "description",
//             },
//             second: {
//                 type: "string",
//                 description: "description",
//             },
//         },
//     };

//     it("should create a properties table with default heading level", () => {
//         const expectedOutput = `#### Propriedades\n\n| Nome | Tipo | Descrição | Obrigatório? |\n| --- | --- | --- | --- |\n| first | string | description | Não |\n| second | string | description | Não |`;
//         const output = propertiesTable(schema);
//         expect(output).toEqual(expectedOutput);
//     });

//     it("should create a properties table with custom heading level", () => {
//         const expectedOutput = `### Propriedades\n\n| Nome | Tipo | Descrição | Obrigatório? |\n| --- | --- | --- | --- |\n| first | string | description | Não |\n| second | string | description | Não |`;
//         const output = propertiesTable(schema);
//         expect(output).toEqual(expectedOutput);
//     });
// });
