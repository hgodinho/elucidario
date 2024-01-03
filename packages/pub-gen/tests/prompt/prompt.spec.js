import { describe, it, expect } from "@jest/globals";

import { pubGenPrompt } from "../../lib/prompt";

describe("prompt", () => {
    it("should return a create prompt object", () => {
        const prompt = pubGenPrompt("create", { name: "test" });

        const matchers = [
            {
                type: "string",
                name: "title",
                message: "Title (A human-readable title.)",
                default: undefined,
                validate: undefined,
            },
            {
                type: "list",
                name: "type",
                message: "Type (Type of the publication.)",
                choices: [
                    "book",
                    "article",
                    "chapter",
                    "conference",
                    "dissertation",
                    "thesis",
                    "manual",
                    "misc",
                ],
                default: undefined,
                validate: expect.any(Function),
            },
            {
                type: "string",
                name: "year",
                message: "Year (Publication year.)",
                default: undefined,
                validate: expect.any(Function),
            },
            {
                type: "string",
                name: "description",
                message:
                    "Description (A text description. Markdown is encouraged.)",
                default: undefined,
                validate: undefined,
            },
            {
                type: "string",
                name: "homepage",
                message:
                    "Home Page (The home on the web that is related to this data package.)",
                default: undefined,
                validate: undefined,
            },
            {
                type: "string",
                name: "keywords",
                message:
                    "Keywords (A list of keywords that describe this package.)",
                default: undefined,
                validate: undefined,
            },
            {
                type: "string",
                name: "image",
                message: "Image (A image to represent this package.)",
                default: undefined,
                validate: undefined,
            },
            {
                default: true,
                message: "Do you want to add a license?",
                name: "addLicense",
                type: "confirm",
            },
            {
                default: true,
                message: "Do you want to add an author?",
                name: "addAuthor",
                type: "confirm",
            },
        ];
        expect(prompt).toMatchObject(matchers);
    });

    it("should return a document prompt object", () => {
        const prompt = pubGenPrompt("document");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "document.title",
                message: "Title (Title of the document.)",
                validate: expect.any(Function),
            },
            {
                type: "string",
                name: "document.language",
                message:
                    "Language (The language of the document. Use RFC 5646.)",
                validate: expect.any(Function),
            },
            {
                type: "list",
                name: "document.style",
                choices: ["abnt-dissertation"],
                message: "Style (Define format style.)",
                validate: expect.any(Function),
            },
            {
                default: true,
                type: "confirm",
                name: "document.index",
                message:
                    "Index titles. (Add default index titles to the document based on the selected style?)",
            },
            {
                default: true,
                type: "confirm",
                name: "document.assets_titles",
                message:
                    "document.assets_titles (Add default assets titles to the document based on the selected style?)",
            },
            {
                type: "confirm",
                name: "addMoreDocument",
                default: false,
                message: "Do you want to add another document?",
            },
        ]);
    });
});
