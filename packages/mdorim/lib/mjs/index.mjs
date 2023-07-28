import pkg from "../../package.json" assert { type: "json" };
import jc from "json-cycle";

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
    decycle: (obj) => JSON.stringify(jc.decycle(obj)),
    retrocycle: (obj) => jc.retrocycle(JSON.parse(obj)),
};

// const ajv = new Ajv({
//     schemas: { jsonUi, mdorimCore, mdorimObject, mdorimUser },
// });

export default mdorim;
