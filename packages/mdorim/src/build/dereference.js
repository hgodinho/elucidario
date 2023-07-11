import path from "path";
import { readContents } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
import { writeFile } from "./writeFile.js";
import { replaceRef } from "./replaceRef.js";
import { mergeSubSchema } from "@elucidario/pkg-schema-doc";

export const dereferenceSchemas = async (pkg, __dirname) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let schemas = {};
    try {
        schemas = readContents({
            dirPath: path.resolve(__dirname, "schemas", "mdorim"),
            extensions: ["json"],
            index: false,
            package: pkg,
        });
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
    try {
        const replaced = {};
        Object.entries(schemas).map(async ([name, schema]) => {
            const newSchema = replaceRef(schema);
            replaced[name] = newSchema;
        });

        // dereference schemas
        for (let [name, schema] of Object.entries(replaced)) {
            const dereferencedSchema = await mergeSubSchema(
                schema,
                {
                    resolve: {
                        file: {
                            async read(file, callback, $refs) {
                                if (file.url.includes("node_modules")) {
                                    try {
                                        const fileUrl = path.parse(file.url);
                                        const filePath = path.join(
                                            __dirname,
                                            "schemas",
                                            file.url.includes("linked-art")
                                                ? "linked-art"
                                                : "mdorim",
                                            fileUrl.base
                                        );
                                        try {
                                            const schema = fs
                                                .readFileSync(filePath, "utf8")
                                                .toString();
                                            console.log(
                                                { filePath, fileUrl },
                                                {
                                                    defaultLog: true,
                                                    type: "warning",
                                                }
                                            );
                                            return schema;
                                        } catch (err) {
                                            throw new Error(
                                                `Could not find json: ${err}`
                                            );
                                        }
                                    } catch (err) {
                                        throw new Error(
                                            `Error reading file at ${file.url}: ${err}`
                                        );
                                    }
                                }
                            },
                        },
                    },
                },
                "bundle"
            );
            writeFile(
                path.resolve(outStatic, "schemas", "dereferenced"),
                `${name}.json`,
                JSON.stringify(dereferencedSchema, null, 4)
            );
        }
    } catch (err) {
        console.log(
            { err },
            { type: "error", defaultLog: true, title: "Error" }
        );
        throw new Error(err);
    }
};
