import schema from "./schema/pub-gen-schema.json" assert { type: "json" };

export const pubGenPrompt = (callback, defaults = undefined) => {
    const createPromptType = ["name", "type", "year"];
    const syncInputs = ["type", "title", "preset", "language", "keywords"];

    const createPrompt = Object.entries(schema.properties)
        .map(([key, value]) => {
            if (createPromptType.includes(key)) {
                return createInput(
                    key,
                    value,
                    defaults
                        ? defaults[key]
                            ? defaults[key]
                            : undefined
                        : undefined
                );
            }
        })
        .filter((x) => x);

    const authorPrompt = Object.entries(
        schema.properties.authors.items.properties
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

    const documentPrompt = Object.entries(
        schema.properties.documents.items.properties
    )
        .map(([key, value]) => {
            if (syncInputs.includes(key)) {
                return createInput(
                    `document.${key}`,
                    value,
                    defaults
                        ? defaults[key]
                            ? defaults[key]
                            : undefined
                        : undefined
                );
            }
        })
        .filter((x) => x);
    documentPrompt.push({
        type: "confirm",
        name: "anotherDocument",
        message: "Do you want to add another document?",
        default: false,
    });

    switch (callback) {
        case "create":
            return createPrompt;

        case "addAuthor":
            return authorPrompt;

        case "addDocument":
            return documentPrompt;
    }
};

const createInput = (name, value, defaultValue) => {
    switch (value.type) {
        case "string":
            if (value.enum) {
                return {
                    type: "list",
                    name,
                    message: value.description,
                    choices: value.enum,
                    default: defaultValue,
                };
            } else {
                return {
                    type: value.type,
                    name,
                    message: value.description,
                    default: defaultValue,
                };
            }
    }
};
