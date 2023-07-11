import pkg from "../../package.json" assert { type: "json" };
import Ajv from "ajv";
import { dereference } from "@elucidario/pkg-schema-doc";

import examples from "./examples.mjs";
import mapping from "./mapping.mjs";
import translations from "./translations.mjs";
import schemas from "./schemas.mjs";

const mdorim = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    schemas,
    mapping,
    translations,
    examples,
};

// const ajv = new Ajv({
//     schemas: { jsonUi, mdorimCore, mdorimObject, mdorimUser },
// });

// /**
//  * @typedef MDORIM
//  */
export default {
    ...mdorim,
    // validate: (schema, data) => ajv.getSchema(schema)(data),
    dereference,
};
