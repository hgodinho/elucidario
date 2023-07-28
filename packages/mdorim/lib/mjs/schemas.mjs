import jsonUi from "../../static/mdorim/schemas/json-ui/schema.json" assert { type: "json" };
import mapping from "../../static/mdorim/schemas/mapping/schema.json" assert { type: "json" };

import core from "../../static/mdorim/schemas/mdorim/core.json" assert { type: "json" };
import object from "../../static/mdorim/schemas/mdorim/object.json" assert { type: "json" };
import options from "../../static/mdorim/schemas/mdorim/options.json" assert { type: "json" };
// import user from "../../static/mdorim/schemas/mdorim/user.json" assert { type: "json" };

import { dereferenced } from "./deref.mjs";

const mdorim = {
    options,
    core,
    object,
};

const schemas = {
    jsonUi,
    mapping,
    dereferenced,
    mdorim,
};

export default schemas;
