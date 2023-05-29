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
            "schemas",
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
    createPrompt.push(
        {
            type: "confirm",
            name: "addLicense",
            message: "Do you want to add a license?",
            default: true,
        },
        {
            type: "confirm",
            name: "addAuthor",
            message: "Do you want to add an author?",
            default: true,
        }
    );

    const publicationPrompt = Object.entries(
        schema.properties.publications.items.properties
    ).map(([key, value]) => {
        return createInput(
            `publication.${key}`,
            value,
            defaults ? (defaults[key] ? defaults[key] : undefined) : undefined
        );
    });
    publicationPrompt.push({
        type: "confirm",
        name: "addMorePublication",
        message: "Do you want to add another publication?",
        default: false,
    });

    const licensePrompt = Object.entries(
        schema.properties.licenses.items.properties
    ).map(([key, value]) => {
        return createInput(
            `license.${key}`,
            value,
            defaults ? (defaults[key] ? defaults[key] : undefined) : undefined
        );
    });
    licensePrompt.push({
        type: "confirm",
        name: "addMoreLicense",
        message: "Do you want to add another license?",
        default: false,
    });

    const authorPrompt = Object.entries(
        schema.properties.contributors.items.properties
    ).map(([key, value]) => {
        return createInput(
            `contributor.${key}`,
            value,
            defaults ? (defaults[key] ? defaults[key] : undefined) : undefined
        );
    });
    authorPrompt.push({
        type: "confirm",
        name: "addMoreAuthor",
        message: "Do you want to add another author?",
        default: false,
    });

    switch (callback) {
        case "create":
            return createPrompt;

        case "addAuthor":
            return authorPrompt;

        case "addLicense":
            return licensePrompt;

        case "publication":
            return publicationPrompt;
    }
};
