/**
 *  Create a prompt input based on the schema
 * @param {string} name
 * @param {any} schema
 * @param {any} defaultValue
 * @param {any} validate
 * @returns
 */
export const createInput = ({
    name,
    schema,
    defaultValue,
    validate,
    prefix,
}) => {
    if (typeof validate === "undefined" && schema.required === true) {
        validate = (value) => {
            if (value.length === 0) {
                return "This field is required";
            }
            return true;
        };
    }

    const description = schema.description ? ` (${schema.description})` : false;
    const title = schema.title ? schema.title : name;
    let message = typeof prefix !== "undefined" ? `[${prefix}]` + " " : "";
    message += title;
    message += description ? description : "";

    const defaultSchema = {
        name,
        message,
        default: defaultValue,
        validate,
    };

    switch (schema.type) {
        case "string":
            if (schema.enum) {
                return {
                    type: "list",
                    choices: schema.enum,
                    ...defaultSchema,
                };
            } else {
                return {
                    type: schema.type,
                    ...defaultSchema,
                };
            }

        case "checkbox":
            return {
                type: schema.type,
                choices: schema.enum,
                ...defaultSchema,
            };

        case "boolean":
            return {
                type: "confirm",
                ...defaultSchema,
            };

        default:
            return {
                type: "string",
                ...defaultSchema,
            };
    }
};
