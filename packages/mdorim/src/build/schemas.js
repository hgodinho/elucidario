import path from "path";
import { readContents } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
import { writeFile } from "./writeFile.js";
import { replaceRef } from "./replaceRef.js";

/**
 * Build schemas
 */
export const buildSchemas = async (pkg, __dirname, outStatic) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let schemas = {};
    try {
        schemas = readContents({
            dirPath: path.join(__dirname, "schemas"),
            extensions: ["json"],
            index: false,
            package: pkg,
        });
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
    try {
        const toCopy = ["json-ui", "linked-art", "mapping", "mdorim"];
        for (let [name, schema] of Object.entries(schemas)) {
            if (toCopy.includes(name)) {
                Object.entries(schema).map(([schemaName, schemaValue]) => {
                    const fileName = `${schemaName}.json`;
                    // replace ref to external schemas
                    const external = replaceRef(
                        schemaValue,
                        true,
                        pkg.homepage
                    );
                    writeFile(
                        path.resolve(outStatic, "schemas", name),
                        fileName,
                        JSON.stringify(external, null, 4),
                        pkg
                    );
                });
            }
        }
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
