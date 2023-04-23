import schema from "../dist/pub-gen-schema.json" assert { type: "json" };

export const pubGenPrompt = (callback, defaults = undefined) => {
    const syncInputs = ["type", "title", "preset", "language", "keywords"];

    const createPromptType = [
        "name",
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
        default:
            return {
                type: "string",
                name,
                message: value.description,
                default: defaultValue,
            };
    }
};
