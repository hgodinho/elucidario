/**
 *  Create a prompt input based on the schema
 * @param {string} name
 * @param {any} schema
 * @param {any} defaultValue
 * @returns
 */
export const createInput = (name, schema, defaultValue) => {
    switch (schema.type) {
        case "string":
            if (schema.enum) {
                return {
                    type: "list",
                    name,
                    message: schema.description,
                    choices: schema.enum,
                    default: defaultValue,
                };
            } else {
                return {
                    type: schema.type,
                    name,
                    message: schema.description,
                    default: defaultValue,
                };
            }
        case "checkbox":
            return {
                type: schema.type,
                name,
                message: schema.description,
                choices: schema.enum,
                default: defaultValue,
            };
        case "boolean":
            return {
                type: "confirm",
                name,
                message: schema.description,
                default: defaultValue,
            };
        default:
            return {
                type: "string",
                name,
                message: schema.description,
                default: defaultValue,
            };
    }
};
