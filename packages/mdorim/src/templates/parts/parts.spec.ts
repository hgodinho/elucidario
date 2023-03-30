import { describe, it, expect } from "@jest/globals";
import { mappingTable, metaType, propertiesTable } from "./parts";
import {
    Mapping,
    BaseSchema,
    DataTypes,
    AnyOfSchema,
    OneOfSchema,
} from "@elucidario/types";

describe("mappingTable function", () => {
    it("should create a mapping table", () => {
        const rows: Mapping = {
            first: "second",
            third: "fourth",
        };
        const expectedOutput = `#### Mapeamento\n\n| Vocabulário | Link |\n| --- | --- |\n| first | <second> |\n| third | <fourth> |`;
        const output = mappingTable(rows);
        expect(output).toEqual(expectedOutput);
    });
});

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
        const expectedOutput = `> tipo \`${schema.type}\` com propriedades`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a array type", () => {
        const schema: BaseSchema<DataTypes> = {
            type: "array",
            description: "description",
            items: {
                type: "string",
            },
        };
        const expectedOutput = `> tipo \`${schema.type}\``;
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
        const expectedOutput = `> tipo \`${schema.type}\` anyOf\<[schemas](#schemas) | [schemas](#schemas)\>`;
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
        const expectedOutput = `> tipo \`${schema.type}\` oneOf\<[schemas](#schemas) | [schemas](#schemas)\>`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });

    it("should be a string type", () => {
        const schema: BaseSchema<DataTypes> = {
            type: "string",
            description: "description",
        };
        const expectedOutput = `> tipo \`${schema.type}\``;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
    it("should be a null type", () => {
        const schema: BaseSchema<DataTypes> = {
            type: "null",
            description: "description",
        };
        const expectedOutput = `> tipo \`${schema.type}\` (nulo)`;
        const output = metaType(schema);
        expect(output).toEqual(expectedOutput);
    });
});

describe("propertiesTable", () => {
    it("should create a properties table", () => {
        const schema: BaseSchema<DataTypes> = {
            type: "object",
            description: "description",
            properties: {
                first: {
                    type: "string",
                    description: "description",
                },
                second: {
                    type: "string",
                    description: "description",
                },
            },
        };
        const expectedOutput = `| Propriedade | Tipo | Descrição |\n| --- | --- | --- |\n| first | string | description |\n| second | string | description |`;
        const output = propertiesTable(schema);
        expect(output).toEqual(expectedOutput);
    });
});
