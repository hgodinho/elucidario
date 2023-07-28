import path from "path";
import { getPaths } from "@elucidario/pkg-paths";

import { dereferenceSchemas } from "../../src/build/dereference.js";
import packageJson from "../../package.json" assert { type: "json" };

import core from "../../src/schemas/mdorim/core.json" assert { type: "json" };
import object from "../../src/schemas/mdorim/object.json" assert { type: "json" };
import concept from "../../src/schemas/mdorim/concept.json" assert { type: "json" };
import options from "../../src/schemas/mdorim/options.json" assert { type: "json" };

const { packages } = getPaths();
const __dirname = path.resolve(packages, "mdorim", "src");

export const dereferenced = await dereferenceSchemas(packageJson, __dirname, {
    options,
    core,
    object,
    concept,
});
