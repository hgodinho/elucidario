import path from "path";
import { readContents, createFile } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
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
        for (const schema of schemas) {
            const parsedSchema = replaceRef(schema.value, true, pkg.homepage);
            createFile(
                {
                    filePath: schema.path.replace("src", "static/mdorim"),
                    ext: "json",
                },
                parsedSchema,
            );
        }
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
