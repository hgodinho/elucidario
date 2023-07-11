/**
 * Replace <local>|<linked-art> with the local path
 * @param {object} schema - schema
 * @param {boolean} ext - if true, replace <local>|<linked-art> with the external path
 * @returns {object} schema
 */
export const replaceRef = (schema, ext = false, ref) => {
    const newSchema = structuredClone(schema);
    for (let key in newSchema) {
        if (key === "$ref") {
            if (newSchema[key].includes("<local>")) {
                if (ext && !ref) throw new Error("No ref provided");
                newSchema[key] = newSchema[key].replace(
                    "<local>",
                    ext ? `${ref}/schema` : "mdorim"
                );
            }
            if (newSchema[key].includes("<linked-art>")) {
                newSchema[key] = newSchema[key].replace(
                    "<linked-art>",
                    ext ? `https://linked.art/api/1.0/schema` : "linked-art"
                );
            }
        } else if (typeof newSchema[key] === "object") {
            newSchema[key] = replaceRef(newSchema[key], ext, ref);
        }
    }
    return newSchema;
};
