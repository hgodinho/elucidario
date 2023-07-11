const pkg = require("../../package.json");

/**
 * @typedef {import("./index.d.ts")} MDORIM
 * @type {MDORIM}
 */
module.exports = {
    name: "mdorim",
    version: pkg.version,
    description: pkg.description,
    schemas: require("./schemas.cjs"),
    mapping: require("./mapping.cjs"),
    translations: require("./translations.cjs"),
    examples: require("./examples.cjs"),
};
