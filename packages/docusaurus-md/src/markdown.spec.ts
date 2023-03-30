import { describe, it, expect } from "@jest/globals";
import {
    toMD,
    headerTemplate,
    status,
    heading,
    table,
} from "./markdown";
import type {
    Status,
    Table,
    Mapping,
    BaseSchema,
    DataTypes,
    ArraySchema,
    AnyOfSchema,
    OneOfSchema,
} from "@elucidario/types";

describe("toMD function", () => {
    it("should join array of strings with two new lines by default", () => {
        const input = ["first string", "second string", ""];
        const expectedOutput = "first string\n\nsecond string";
        const output = toMD(input);
        expect(output).toEqual(expectedOutput);
    });

    it("should join array of strings with a custom separator", () => {
        const input = ["first string", "second string", ""];
        const separator = "###";
        const expectedOutput = "first string###second string";
        const output = toMD(input, separator);
        expect(output).toEqual(expectedOutput);
    });

    it("should ignore empty strings in the input array", () => {
        const input = ["first string", "", "second string"];
        const expectedOutput = "first string\n\nsecond string";
        const output = toMD(input);
        expect(output).toEqual(expectedOutput);
    });
});

describe("headerTemplate function", () => {
    it("should create a markdown header", () => {
        const title = "title";
        const description = "description";
        const expectedOutput = `---\ntitle: "${title}"\ndescription: ${description}\n---`;
        const output = headerTemplate(title, description);
        expect(output).toEqual(expectedOutput);
    });
});

describe("status function", () => {
    it("should create a status message", () => {
        const statusInfo: Status = {
            type: "info",
            title: "title",
            description: "description",
        };
        const expectedOutput = `:::info title\n\ndescription\n\n:::`;
        const output = status(statusInfo);
        expect(output).toEqual(expectedOutput);
    });
});

describe("heading function", () => {
    it("should create a heading", () => {
        const level = 3;
        const title = "title";
        const expectedOutput = "### title";
        const output = heading(level, title);
        expect(output).toEqual(expectedOutput);
    });

    it("should limit the level to 1-5", () => {
        const level = 10;
        const title = "title";
        const expectedOutput = "##### title";
        const output = heading(level, title);
        expect(output).toEqual(expectedOutput);
    });
});

describe("table function", () => {
    it("should create a table", () => {
        const tableData: Table = {
            title: "title",
            titleLevel: 3,
            headers: ["firstHeader", "secondHeader"],
            rows: [
                ["first", "second"],
                ["third", "fourth"],
            ],
        };
        const expectedOutput = `### title\n\n| firstHeader | secondHeader |\n| --- | --- |\n| first | second |\n| third | fourth |`;
        const output = table(tableData);
        expect(output).toEqual(expectedOutput);
    });
});

