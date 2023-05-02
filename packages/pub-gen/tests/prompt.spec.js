import { describe, it, expect } from "@jest/globals";

import { pubGenPrompt } from "../lib/prompt";

describe("prompt", () => {
    it("should return a create prompt object", () => {
        const prompt = pubGenPrompt("create", { name: "test" });
        expect(prompt).toEqual([
            {
                type: "string",
                name: "title",
                message: "A human-readable title.",
                default: undefined,
            },
            {
                type: "list",
                name: "type",
                message: "Type of the publication.",
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
                message: "Publication year.",
                default: undefined,
            },
            {
                type: "string",
                name: "description",
                message: "A text description. Markdown is encouraged.",
                default: undefined,
            },
            {
                type: "string",
                name: "language",
                message:
                    "The languages of the publication. Use ISO 639-1 code.",
                default: undefined,
            },
            {
                type: "string",
                name: "homepage",
                message:
                    "The home on the web that is related to this data package.",
                default: undefined,
            },
            {
                type: "string",
                name: "keywords",
                message: "A list of keywords that describe this package.",
                default: undefined,
            },
            {
                type: "string",
                name: "image",
                message: "A image to represent this package.",
            },
        ]);
    });
});
