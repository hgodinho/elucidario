import { createInput } from "../../lib/prompt/createInput";

describe("createInput", () => {
    const inputs = [
        // schema without description, with prefix
        {
            name: "teste-1",
            schema: {
                type: "string",
                title: "Teste 1",
            },
            defaultValue: "",
            validate: () => true,
            prefix: "suite-1",
        },

        // schema with description, with prefix
        {
            name: "teste-1",
            schema: {
                type: "string",
                title: "Teste 2",
                description: "Um teste",
            },
            defaultValue: "",
            validate: () => true,
            prefix: "suite-1",
        },

        // schema with description, without prefix
        {
            name: "teste-1",
            schema: {
                type: "string",
                title: "Teste 2",
                description: "Um teste",
            },
            defaultValue: "",
            validate: () => true,
        },

        // schema without title, without prefix, with description
        {
            name: "teste-1",
            schema: {
                type: "string",
                description: "Um teste",
            },
            defaultValue: "",
            validate: () => true,
        },

        // schema without title, without prefix, without description
        {
            name: "teste-1",
            schema: {
                type: "string",
            },
            defaultValue: "",
            validate: () => true,
        },

        // schema without validate
        {
            name: "teste-1",
            schema: {
                type: "string",
            },
            defaultValue: "",
        },

        // schema without validate, with schema required true
        {
            name: "teste-1",
            schema: {
                type: "string",
                required: true,
            },
            defaultValue: "",
        },

        // schema with enum and default value
        {
            name: "teste-1",
            schema: {
                type: "string",
                required: true,
                enum: ["a", "b", "c"],
            },
            defaultValue: "a",
        },

        // schema boolean type
        {
            name: "teste-1",
            schema: {
                type: "boolean",
                required: true,
            },
            defaultValue: false,
        },
    ];

    const mock = [
        {
            type: "string",
            name: "teste-1",
            message: "[suite-1] Teste 1",
            default: "",
            validate: expect.any(Function),
        },
        {
            type: "string",
            name: "teste-1",
            message: "[suite-1] Teste 2 (Um teste)",
            default: "",
            validate: expect.any(Function),
        },
        {
            type: "string",
            name: "teste-1",
            message: "Teste 2 (Um teste)",
            default: "",
            validate: expect.any(Function),
        },
        {
            type: "string",
            name: "teste-1",
            message: "teste-1 (Um teste)",
            default: "",
            validate: expect.any(Function),
        },
        {
            type: "string",
            name: "teste-1",
            message: "teste-1",
            default: "",
            validate: expect.any(Function),
        },
        {
            type: "string",
            name: "teste-1",
            message: "teste-1",
            default: "",
            validate: undefined,
        },
        {
            type: "string",
            name: "teste-1",
            message: "teste-1",
            default: "",
            validate: expect.any(Function),
        },
        {
            type: "list",
            name: "teste-1",
            message: "teste-1",
            default: "a",
            choices: ["a", "b", "c"],
            validate: expect.any(Function),
        },
        {
            type: "confirm",
            name: "teste-1",
            message: "teste-1",
            default: false,
            validate: expect.any(Function),
        },
    ];

    it("should create inputs with the given properties", () => {
        const createdInputs = inputs.map((mock) => createInput(mock));

        expect(createdInputs).toEqual(mock);
    });
});
