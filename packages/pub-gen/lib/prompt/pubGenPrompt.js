import fs from "fs";
import path from "path";

import { createInput } from "./createInput.js";
import { getPaths } from "../getPaths.js";

const paths = getPaths();
const schema = JSON.parse(
    fs.readFileSync(
        path.resolve(
            paths.pubGen,
            "static",
            "pub-gen",
            "schema",
            "pub-gen-schema.json"
        )
    )
);

export const pubGenPrompt = (callback, defaults = undefined) => {
    const createPromptType = [
        "title",
        "type",
        "year",
        "description",
        "language",
        "homepage",
        "keywords",
        "image",
    ];
    const createPrompt = createPromptType.map((key) => {
        return createInput(
            key,
            schema.properties[key],
            defaults ? (defaults[key] ? defaults[key] : undefined) : undefined
        );
    });

    const authorPrompt = Object.entries(
        schema.properties.contributors.items.properties
    ).map(([key, value]) => {
        return createInput(
            `authors.${key}`,
            value,
            defaults ? (defaults[key] ? defaults[key] : undefined) : undefined
        );
    });
    authorPrompt.push({
        type: "confirm",
        name: "addAuthor",
        message: "Do you want to add another author?",
        default: false,
    });

    switch (callback) {
        case "create":
            return createPrompt;

        case "addAuthor":
            return authorPrompt;
    }
};
