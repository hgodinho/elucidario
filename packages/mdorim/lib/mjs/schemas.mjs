import jsonUi from "../../static/mdorim/schemas/json-ui/schema.json" assert { type: "json" };
import mapping from "../../static/mdorim/schemas/mapping/schema.json" assert { type: "json" };

import core from "../../static/mdorim/schemas/mdorim/core.json" assert { type: "json" };
import object from "../../static/mdorim/schemas/mdorim/object.json" assert { type: "json" };
// import user from "../../static/mdorim/schemas/mdorim/user.json" assert { type: "json" };

const schemas = {
    jsonUi,
    mapping,
    mdorim: {
        core,
        object,
        // user,
    },
};

export default schemas;
