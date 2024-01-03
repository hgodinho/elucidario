import path from "path";
import { readContents, readFile, getPaths } from "@elucidario/pkg-paths";

import { createInput } from "./createInput.js";

const schema = readFile(
    path.resolve(
        getPaths().packages,
        "pub-gen",
        "static",
        "pub-gen",
        "schemas",
        "pub-gen-schema.json",
    ),
).value;

const pkg = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json"),
).value;

/**
 * Check if the key is required
 * @param {string} key | key of the schema
 * @param {Object} schema | schema
 * @returns {boolean} true if the key is required
 */
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

/**
 *
 * @param {Function} callback | callback function
 * @param {Object} defaults | defaults values
 * @returns | prompt
 */
export const pubGenPrompt = (callback, defaults = undefined) => {
    /**
     * Create prompt
     */
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
        },
    );

    /**
     * Document prompt
     */
    const documentsSchema = schema.properties.documents.items;
    const documentPrompt = Object.entries(documentsSchema.properties).map(
        ([key, value]) => {
            if ("style" === key) {
                const styles = readContents({
                    dirPath: path.resolve(
                        getPaths().packages,
                        "pub-gen",
                        "lib",
                        "styles",
                    ),
                    index: false,
                    extensions: ["json"],
                    pkg,
                }).map((style) => `${style.value.name}-${style.value.type}`);

                return createInput({
                    name: `document.${key}`,
                    schema: {
                        ...value,
                        type: "string",
                        enum: styles,
                        required: isRequired(key, documentsSchema),
                    },
                    defaultValue: defaults
                        ? defaults[key]
                            ? defaults[key]
                            : undefined
                        : undefined,
                });
            }
            if ("index" === key) {
                return createInput({
                    name: `document.${key}`,
                    schema: {
                        type: "boolean",
                        title: value.title,
                        description:
                            "Add default index titles to the document based on the selected style?",
                        required: isRequired(key, documentsSchema),
                    },
                    defaultValue: true,
                });
            }
            if ("assets_titles" === key) {
                return createInput({
                    name: `document.${key}`,
                    schema: {
                        type: "boolean",
                        title: value.title,
                        description:
                            "Add default assets titles to the document based on the selected style?",
                        required: isRequired(key, documentsSchema),
                    },
                    defaultValue: true,
                });
            }

            return createInput({
                name: `document.${key}`,
                schema: {
                    ...value,
                    required: isRequired(key, documentsSchema),
                },
                defaultValue: defaults
                    ? defaults[key]
                        ? defaults[key]
                        : undefined
                    : undefined,
            });
        },
    );
    documentPrompt.push({
        type: "confirm",
        name: "addMoreDocument",
        message: "Do you want to add another document?",
        default: false,
    });

    /**
     * License prompt
     */
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
        },
    );
    licensePrompt.push({
        type: "confirm",
        name: "addMoreLicense",
        message: "Do you want to add another license?",
        default: false,
    });

    /**
     * Author prompt
     */
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
        },
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

        case "document":
            return documentPrompt;
    }
};
