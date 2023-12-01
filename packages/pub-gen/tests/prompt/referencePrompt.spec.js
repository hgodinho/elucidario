import { describe, it, expect } from "@jest/globals";

import { referencePrompt, authorPrompt, datePrompt } from "../../lib/prompt";

describe("referencePrompt", () => {
    it("should return a reference type prompt object", () => {
        const prompt = referencePrompt("create");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "year",
                message: "year (The year of publication.)",
                default: undefined,
                validate: expect.any(Function),
            },
            {
                type: "list",
                name: "type",
                message: "type",
                choices: [
                    "article",
                    "article-journal",
                    "article-magazine",
                    "article-newspaper",
                    "bill",
                    "book",
                    "broadcast",
                    "chapter",
                    "classic",
                    "collection",
                    "dataset",
                    "document",
                    "entry",
                    "entry-dictionary",
                    "entry-encyclopedia",
                    "event",
                    "figure",
                    "graphic",
                    "hearing",
                    "interview",
                    "legal_case",
                    "legislation",
                    "manuscript",
                    "map",
                    "motion_picture",
                    "musical_score",
                    "pamphlet",
                    "paper-conference",
                    "patent",
                    "performance",
                    "periodical",
                    "personal_communication",
                    "post",
                    "post-weblog",
                    "regulation",
                    "report",
                    "review",
                    "review-book",
                    "software",
                    "song",
                    "speech",
                    "standard",
                    "thesis",
                    "treaty",
                    "webpage",
                ],
                default: undefined,
            },
        ]);
    });

    it("should return a reference type prompt object with default", () => {
        const prompt = referencePrompt("create", { type: "article" });
        expect(prompt).toEqual([
            {
                type: "string",
                name: "year",
                message: "year (The year of publication.)",
                validate: expect.any(Function),
            },
            {
                type: "list",
                name: "type",
                message: "type",
                choices: [
                    "article",
                    "article-journal",
                    "article-magazine",
                    "article-newspaper",
                    "bill",
                    "book",
                    "broadcast",
                    "chapter",
                    "classic",
                    "collection",
                    "dataset",
                    "document",
                    "entry",
                    "entry-dictionary",
                    "entry-encyclopedia",
                    "event",
                    "figure",
                    "graphic",
                    "hearing",
                    "interview",
                    "legal_case",
                    "legislation",
                    "manuscript",
                    "map",
                    "motion_picture",
                    "musical_score",
                    "pamphlet",
                    "paper-conference",
                    "patent",
                    "performance",
                    "periodical",
                    "personal_communication",
                    "post",
                    "post-weblog",
                    "regulation",
                    "report",
                    "review",
                    "review-book",
                    "software",
                    "song",
                    "speech",
                    "standard",
                    "thesis",
                    "treaty",
                    "webpage",
                ],
                default: "article",
            },
        ]);
    });

    it("should return a reference of type book prompt object", () => {
        const prompt = referencePrompt("book");
        expect(prompt).toEqual([
            {
                default: undefined,
                message: "book.title",
                name: "book.title",
                type: "string",
                validate: expect.any(Function),
            },
            {
                default: undefined,
                message: "book.container-title",
                name: "book.container-title",
                type: "string",
            },
            {
                default: undefined,
                message: "book.publisher",
                name: "book.publisher",
                type: "string",
            },
            {
                default: undefined,
                message: "book.publisher-place",
                name: "book.publisher-place",
                type: "string",
            },
            {
                default: undefined,
                message: "book.volume",
                name: "book.volume",
                type: "string",
            },
            {
                default: undefined,
                message: "book.number-of-volumes",
                name: "book.number-of-volumes",
                type: "string",
            },
            {
                default: undefined,
                message: "book.number",
                name: "book.number",
                type: "string",
            },
            {
                default: undefined,
                message: "book.number-of-pages",
                name: "book.number-of-pages",
                type: "string",
            },
            {
                default: undefined,
                message: "book.ISBN",
                name: "book.ISBN",
                type: "string",
            },
        ]);
    });

    const articlePrompt = (type) => [
        {
            type: "string",
            name: `${type}.title`,
            message: `${type}.title`,
            default: undefined,
            validate: expect.any(Function),
        },
        {
            type: "string",
            name: `${type}.container-title`,
            message: `${type}.container-title`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.publisher`,
            message: `${type}.publisher`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.publisher-place`,
            message: `${type}.publisher-place`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.volume`,
            message: `${type}.volume`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.number-of-volumes`,
            message: `${type}.number-of-volumes`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.number`,
            message: `${type}.number`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.issue`,
            message: `${type}.issue`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.page`,
            message: `${type}.page`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.number-of-pages`,
            message: `${type}.number-of-pages`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.DOI`,
            message: `${type}.DOI`,
            default: undefined,
        },
        {
            type: "string",
            name: `${type}.ISSN`,
            message: `${type}.ISSN`,
            default: undefined,
        },
    ];
    it("should return a reference of type article prompt", () => {
        const prompt = referencePrompt("article");
        expect(prompt).toEqual(articlePrompt("article"));
    });
    it("should return a reference of type article-journal", () => {
        const prompt = referencePrompt("article-journal");
        expect(prompt).toEqual(articlePrompt("article-journal"));
    });
    it("should return a reference of type article-magazine", () => {
        const prompt = referencePrompt("article-magazine");
        expect(prompt).toEqual(articlePrompt("article-magazine"));
    });
    it("should return a reference of type article-newspaper", () => {
        const prompt = referencePrompt("article-newspaper");
        expect(prompt).toEqual(articlePrompt("article-newspaper"));
    });

    it("should return a reference of type event prompt", () => {
        const prompt = referencePrompt("event");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "event.event-title",
                message: "event.event-title",
                default: undefined,
            },
            {
                type: "string",
                name: "event.event-place",
                message: "event.event-place",
                default: undefined,
            },
        ]);
    });

    it("should return a reference with archive properties", () => {
        const prompt = referencePrompt("archive");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "archive",
                message: "archive",
                default: undefined,
            },
            {
                type: "string",
                name: "archive_location",
                message: "archive_location",
                default: undefined,
            },
            {
                type: "string",
                name: "archive-place",
                message: "archive-place",
                default: undefined,
            },
            {
                type: "string",
                name: "call-number",
                message: "call-number",
                default: undefined,
            },
        ]);
    });

    it("should return a reference with common properties", () => {
        const prompt = referencePrompt("common");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "language",
                message: "language",
                default: undefined,
            },
            {
                type: "string",
                name: "abstract",
                message: "abstract",
                default: undefined,
            },
            {
                type: "string",
                name: "keyword",
                message: "keyword",
                default: undefined,
            },
            {
                type: "string",
                name: "medium",
                message: "medium",
                default: undefined,
            },
            {
                type: "string",
                name: "note",
                message: "note",
                default: undefined,
            },
            {
                type: "string",
                name: "URL",
                message: "URL",
                default: undefined,
            },
        ]);
    });

    it("should return a reference", () => {
        const prompt = referencePrompt("bill");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "bill.title",
                message: "bill.title",
                default: undefined,
                validate: expect.any(Function),
            },
            {
                type: "string",
                name: "bill.container-title",
                message: "bill.container-title",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.publisher",
                message: "bill.publisher",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.publisher-place",
                message: "bill.publisher-place",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.volume",
                message: "bill.volume",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.number-of-volumes",
                message: "bill.number-of-volumes",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.number",
                message: "bill.number",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.number-of-pages",
                message: "bill.number-of-pages",
                default: undefined,
            },
            {
                type: "string",
                name: "bill.issue",
                message: "bill.issue",
                default: undefined,
            },
        ]);
    });
});

describe("authorPrompt", () => {
    it("should return an author type prompt object", () => {
        const prompt = authorPrompt("type", { name: "author" });
        expect(prompt).toEqual({
            choices: [
                "author",
                "chair",
                "collection-editor",
                "compiler",
                "composer",
                "container-author",
                "contributor",
                "curator",
                "director",
                "editor",
                "editorial-director",
                "executive-producer",
                "guest",
                "host",
                "interviewer",
                "illustrator",
                "narrator",
                "organizer",
                "original-author",
                "performer",
                "producer",
                "recipient",
                "reviewed-author",
                "script-writer",
                "series-creator",
                "translator",
            ],
            default: undefined,
            message: "type",
            name: "type",
            type: "list",
        });
    });

    it("should return an author names prompt object", () => {
        const prompt = authorPrompt("names");
        expect(prompt).toEqual([
            {
                default: undefined,
                message: "family",
                name: "family",
                type: "string",
                validate: expect.any(Function),
            },
            {
                default: undefined,
                message: "given",
                name: "given",
                type: "string",
            },
            {
                default: undefined,
                message: "suffix",
                name: "suffix",
                type: "string",
            },
            {
                default: undefined,
                message: "literal",
                name: "literal",
                type: "string",
            },
            {
                default: false,
                message: "addMore",
                name: "addMore",
                type: "confirm",
            },
        ]);
    });
});

describe("datePrompt", () => {
    it("should return a date type prompt object", () => {
        const prompt = datePrompt("type");
        expect(prompt).toEqual({
            choices: [
                "accessed",
                "available-date",
                "event-date",
                "issued",
                "original-date",
                "submitted",
            ],
            default: undefined,
            message: "type",
            name: "type",
            type: "list",
        });
    });

    it("should return a date prompt object", () => {
        const prompt = datePrompt("date");
        expect(prompt).toEqual([
            {
                type: "string",
                name: "season",
                message: "season",
                default: undefined,
            },
            {
                type: "string",
                name: "circa",
                message: "circa",
                default: undefined,
            },
            {
                type: "string",
                name: "literal",
                message: "literal",
                default: undefined,
            },
            {
                type: "string",
                name: "raw",
                message: "raw",
                default: undefined,
            },
            {
                type: "confirm",
                name: "addMore",
                message: "addMore",
                default: false,
            },
        ]);
    });
});
