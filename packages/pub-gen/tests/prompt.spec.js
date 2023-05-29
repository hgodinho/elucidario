import { describe, it, expect } from "@jest/globals";

import { pubGenPrompt } from "../lib/prompt";

describe("prompt", () => {
    it("should return a create prompt object", () => {
        const prompt = pubGenPrompt("create", { name: "test" });
        expect(prompt).toEqual([
            {
                type: "string",
                name: "title",
                message: "Title (A human-readable title.)",
                default: undefined,
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
            },
            {
                type: "string",
                name: "year",
                message: "Year (Publication year.)",
                default: undefined,
            },
            {
                type: "string",
                name: "description",
                message:
                    "Description (A text description. Markdown is encouraged.)",
                default: undefined,
            },
            {
                type: "string",
                name: "homepage",
                message:
                    "Home Page (The home on the web that is related to this data package.)",
                default: undefined,
            },
            {
                type: "string",
                name: "keywords",
                message:
                    "Keywords (A list of keywords that describe this package.)",
                default: undefined,
            },
            {
                type: "string",
                name: "image",
                message: "Image (A image to represent this package.)",
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
        ]);
    });

    it("should return a publication prompt object", () => {
        const prompt = pubGenPrompt("publication");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "publication.title",
                message: "Title (Title of the publication.)",
                default: undefined,
            },
            {
                type: "string",
                name: "publication.style",
                message: "Style (Use CSL style.)",
                default: undefined,
            },
            {
                type: "string",
                name: "publication.language",
                message:
                    "Language (The language of the publication. Use RFC 5646.)",
                default: undefined,
            },
            {
                default: false,
                message: "Do you want to add another publication?",
                name: "addMorePublication",
                type: "confirm",
            },
        ]);
    });
});
