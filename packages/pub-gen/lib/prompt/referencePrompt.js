import fs from "fs";
import path from "path";
import { getPaths } from "../getPaths.js";
const paths = getPaths();
const schema = JSON.parse(
    fs.readFileSync(
        path.resolve(
            paths.pubGen,
            "static",
            "pub-gen",
            "schema",
            "reference-schema.json"
        )
    )
);

import { createInput } from "./createInput.js";

export const authorProperties = [
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
];

export const nameProperties = ["family", "given", "suffix", "literal"];

export const dateProperties = [
    "accessed",
    "available-date",
    "event-date",
    "issued",
    "original-date",
    "submitted",
];

export const propertiesFromDate = [
    // "date-parts", Removed because it is not supported by inquirer, and CSL recommendation is to use EDTF string
    // if you want to use date-parts, you can write manually in the json file
    "season",
    "circa",
    "literal",
    "raw",
];

export const commonProperties = [
    "language",
    "abstract",
    "keyword",
    "medium",
    "note",
    "URL",
];

export const bookProperties = [
    "title",
    "container-title",
    "publisher",
    "publisher-place",
    "volume",
    "number-of-volumes",
    "number",
    "number-of-pages",
    "ISBN",
];

export const articleProperties = [
    "title",
    "container-title",
    "publisher",
    "publisher-place",
    "volume",
    "number-of-volumes",
    "number",
    "issue",
    "page",
    "number-of-pages",
    "DOI",
    "ISSN",
];

export const eventProperties = ["event-title", "event-place"];

export const archiveProperties = [
    "archive",
    "archive_location",
    "archive-place",
    "call-number",
];

export const defaultProperties = [
    "title",
    "container-title",
    "publisher",
    "publisher-place",
    "volume",
    "number-of-volumes",
    "number",
    "number-of-pages",
    "issue",
];

const othersPromptType = Object.keys(schema.properties).filter(
    (key) => !authorProperties.includes(key) && !dateProperties.includes(key)
);

export const allProperties = Object.keys(schema.properties);

export const referencePrompt = (name, defaults = undefined) => {
    const createPrompt = createInput(
        "type",
        schema.properties.type,
        defaults ? (defaults.type ? defaults.type : undefined) : undefined
    );

    const mapProperties = (type, props) =>
        props.map((key) => {
            return createInput(
                type ? `${type}.${key}` : key,
                schema.properties[key],
                defaults
                    ? defaults[key]
                        ? defaults[key]
                        : undefined
                    : undefined
            );
        });

    const bookPrompt = mapProperties("book", bookProperties);

    const eventPrompt = mapProperties("event", eventProperties);

    const articlePrompt = (type) => mapProperties(type, articleProperties);

    const archivePrompt = mapProperties(null, archiveProperties);

    const commonPrompt = mapProperties(null, commonProperties);

    const defaultPrompt = (type) => mapProperties(type, defaultProperties);

    switch (name) {
        case "create":
            return createPrompt;
        case "book":
            return bookPrompt;
        case "event":
            return eventPrompt;
        case "article":
        case "article-journal":
        case "article-magazine":
        case "article-newspaper":
            return articlePrompt(name);

        case "archive":
            return archivePrompt;

        case "common":
            return commonPrompt;
        default:
            return defaultPrompt(name);
    }
};

export const authorPrompt = (name, args = undefined) => {
    // type prompt
    const authorType = createInput("type", {
        type: "string",
        enum: authorProperties,
    });

    // names prompt
    const authorSchema = schema.definitions["name-variable"].anyOf[0];
    const namesPrompt = nameProperties.map((key) => {
        return createInput(
            args?.name ? `${args.name}.${key}` : key,
            authorSchema.properties[key],
            args?.defaults
                ? args?.defaults[key]
                    ? args?.defaults[key]
                    : undefined
                : undefined
        );
    });
    namesPrompt.push(
        createInput(
            "addMore",
            {
                type: "boolean",
                message: "Add more names?",
                default: false,
            },
            false
        )
    );

    switch (name) {
        case "type":
            return authorType;
        case "names":
            return namesPrompt;
    }
};

export const datePrompt = (name, args = undefined) => {
    const dateSchema = schema.definitions["date-variable"].anyOf[0];
    const dateTypePrompt = createInput("type", {
        type: "string",
        enum: dateProperties,
    });

    const datePrompt = propertiesFromDate.map((key) => {
        // if (key === "date-parts") {
        //     return createDateInput(
        //         args?.name ? `${args.name}.${key}` : key,
        //         dateSchema.properties[key],
        //         args?.defaults
        //             ? args?.defaults[key]
        //                 ? args?.defaults[key]
        //                 : undefined
        //             : undefined
        //     );
        // }
        return createInput(
            args?.name ? `${args.name}.${key}` : key,
            dateSchema.properties[key],
            args?.defaults
                ? args?.defaults[key]
                    ? args?.defaults[key]
                    : undefined
                : undefined
        );
    });
    datePrompt.push(
        createInput(
            "addMore",
            {
                type: "boolean",
                message: "Add more dates?",
                default: false,
            },
            false
        )
    );

    switch (name) {
        case "type":
            return dateTypePrompt;
        case "date":
            return datePrompt;
    }
};
