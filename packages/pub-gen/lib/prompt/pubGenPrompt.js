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

export const isRequired = (key, schema) => {
    if (schema.required) {
        return schema.required.includes(key);
    }
    if (schema.anyOf) {
        return schema.anyOf.some((item) => item.required.includes(key));
    }
    if (schema.oneOf) {
        return schema.oneOf.some((item) => item.required.includes(key));
    }
    return false;
};

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
        return createInput({
            name: key,
            schema: {
                ...schema.properties[key],
                required: isRequired(key, schema),
            },
            defaultValue: defaults
                ? defaults[key]
                    ? defaults[key]
                    : undefined
                : undefined,
        });
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

    const publicationSchema = schema.properties.publications.items;
    const publicationPrompt = Object.entries(publicationSchema.properties).map(
        ([key, value]) => {
            return createInput({
                name: `publication.${key}`,
                schema: {
                    ...value,
                    required: isRequired(key, publicationSchema),
                },
                defaultValue: defaults
                    ? defaults[key]
                        ? defaults[key]
                        : undefined
                    : undefined,
            });
        }
    );
    publicationPrompt.push({
        type: "confirm",
        name: "addMorePublication",
        message: "Do you want to add another publication?",
        default: false,
    });

    const licenseSchema = schema.properties.licenses.items;
    const licensePrompt = Object.entries(licenseSchema.properties).map(
        ([key, value]) => {
            return createInput({
                name: `license.${key}`,
                schema: { ...value, required: isRequired(key, licenseSchema) },
                defaultValue: defaults
                    ? defaults[key]
                        ? defaults[key]
                        : undefined
                    : undefined,
            });
        }
    );
    licensePrompt.push({
        type: "confirm",
        name: "addMoreLicense",
        message: "Do you want to add another license?",
        default: false,
    });

    const authorSchema = schema.properties.contributors.items;
    const authorPrompt = Object.entries(authorSchema.properties).map(
        ([key, value]) => {
            return createInput({
                name: `contributor.${key}`,
                schema: { ...value, required: isRequired(key, authorSchema) },
                defaultValue: defaults
                    ? defaults[key]
                        ? defaults[key]
                        : undefined
                    : undefined,
            });
        }
    );
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
