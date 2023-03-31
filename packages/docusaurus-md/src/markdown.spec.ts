import { describe, it, expect } from "@jest/globals";
import {
    toMD,
    headerTemplate,
    status,
    heading,
    table,
    codeBlock,
    codeInline,
    quote,
    bold,
    italic,
    boldItalic,
    strike,
    underline,
    link,
    image,
    comment,
    list,
    backToTop,
} from "./markdown";
import type { Status, Table } from "@elucidario/types";

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

    it("should remove spaces in the input array", () => {
        const input = ["first string   ", "    second string"];
        const expectedOutput = "first string\n\nsecond string";
        const output = toMD(input);
        expect(output).toEqual(expectedOutput);
    });
});

describe("headerTemplate function", () => {
    it("should create a markdown header", () => {
        const title = "title";
        const description = "description";
        const expectedOutput = `---\ntitle: '${title}'\ndescription: ${description}\n---`;
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
    it("should create a table without title", () => {
        const tableData: Table = {
            headers: ["firstHeader", "secondHeader"],
            rows: [
                ["first", "second"],
                ["third", "fourth"],
            ],
        };
        const expectedOutput = `| firstHeader | secondHeader |\n| --- | --- |\n| first | second |\n| third | fourth |`;
        const output = table(tableData);
        expect(output).toEqual(expectedOutput);
    });
});

describe("codeBlock function", () => {
    it("should create a code block", () => {
        const code = "code";
        const expectedOutput = `\`\`\`json\ncode\n\`\`\``;
        const output = codeBlock(code);
        expect(output).toEqual(expectedOutput);
    });
});

describe("typography functions", () => {
    it("should create an inline code", () => {
        const code = "code";
        const expectedOutput = "`code`";
        const output = codeInline(code);
        expect(output).toEqual(expectedOutput);
    });
    it("should create a quote", () => {
        const quoteText = "quote";
        const expectedOutput = `> quote`;
        const output = quote(quoteText);
        expect(output).toEqual(expectedOutput);
    });
    it("should create bold text", () => {
        const text = "text";
        const expectedOutput = "**text**";
        const output = bold(text);
        expect(output).toEqual(expectedOutput);
    });

    it("should create italic text", () => {
        const text = "text";
        const expectedOutput = "_text_";
        const output = italic(text);
        expect(output).toEqual(expectedOutput);
    });

    it("should create bold and italic text", () => {
        const text = "text";
        const expectedOutput = "***text***";
        const output = boldItalic(text);
        expect(output).toEqual(expectedOutput);
    });

    it("should create strike text", () => {
        const text = "text";
        const expectedOutput = "~~text~~";
        const output = strike(text);
        expect(output).toEqual(expectedOutput);
    });

    it("should create underline text", () => {
        const text = "text";
        const expectedOutput = "<u>text</u>";
        const output = underline(text);
        expect(output).toEqual(expectedOutput);
    });
});

describe("link functions", () => {
    it("should create a link", () => {
        const text = "text";
        const url = "link";
        const expectedOutput = `[text](${url})`;
        const output = link(text, url);
        expect(output).toEqual(expectedOutput);
    });

    it("should create an image", () => {
        const text = "text";
        const url = "link";
        const expectedOutput = `![text](${url})`;
        const output = image(text, url);
        expect(output).toEqual(expectedOutput);
    });

    it("should create a link back to the top", () => {
        const expectedOutput = `[Voltar ao topo](#)`;
        const output = backToTop("Voltar ao topo");
        expect(output).toEqual(expectedOutput);
    });
});

describe("comment function", () => {
    it("should create a comment", () => {
        const text = "text";
        const expectedOutput = `<!-- text -->`;
        const output = comment(text);
        expect(output).toEqual(expectedOutput);
    });
});

describe("list functions", () => {
    it("should create an unordered list", () => {
        const items = ["first", "second"];
        const expectedOutput = `- first\n- second`;
        const output = list(items);
        expect(output).toEqual(expectedOutput);
    });
    it("should create an ordered list", () => {
        const items = ["first", "second"];
        const expectedOutput = `1. first\n2. second`;
        const output = list(items, true);
        expect(output).toEqual(expectedOutput);
    });
});
