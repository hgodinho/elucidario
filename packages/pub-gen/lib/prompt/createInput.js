/**
 *  Create a prompt input based on the schema
 * @param {string} name
 * @param {any} schema
 * @param {any} defaultValue
 * @returns
 */
export const createInput = (name, schema, defaultValue, validate) => {
    switch (schema.type) {
        case "string":
            if (schema.enum) {
                return {
                    type: "list",
                    name,
                    message: schema.title
                        ? `${schema.title} (${schema.description})`
                        : schema.description,
                    choices: schema.enum,
                    default: defaultValue,
                    validate,
                };
            } else {
                return {
                    type: schema.type,
                    name,
                    message: schema.title
                        ? `${schema.title} (${schema.description})`
                        : schema.description,
                    default: defaultValue,
                    validate,
                };
            }
        case "checkbox":
            return {
                type: schema.type,
                name,
                message: schema.title
                    ? `${schema.title} (${schema.description})`
                    : schema.description,
                choices: schema.enum,
                default: defaultValue,
                validate,
            };
        case "boolean":
            return {
                type: "confirm",
                name,
                message: schema.title
                    ? `${schema.title} (${schema.description})`
                    : schema.description,
                default: defaultValue,
                validate,
            };
        default:
            return {
                type: "string",
                name,
                message: schema.title
                    ? `${schema.title} (${schema.description})`
                    : schema.description,
                default: defaultValue,
                validate,
            };
    }
};
