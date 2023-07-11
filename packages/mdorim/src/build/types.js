import fs from "fs";
import path from "path";
import { mergeSubSchema } from "@elucidario/pkg-schema-doc";
import { Console } from "@elucidario/pkg-console";
import pkg from "json-schema-to-typescript";
const { compile } = pkg;

/**
 * Build types
 */
export const buildTypes = async (pkg, __dirname) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    const index = JSON.parse(
        fs.readFileSync(path.join(__dirname, "schemas", "index.json"), "utf8")
    );
    try {
        const newSchema = await mergeSubSchema(
            index,
            {
                resolve: {
                    file: {
                        async read(file) {
                            if (file.url.includes("node_modules")) {
                                try {
                                    const fileUrl = path.parse(file.url);
                                    const filePath = path.join(
                                        __dirname,
                                        "schemas",
                                        fileUrl.base
                                    );

                                    try {
                                        const schemaJson = JSON.parse(
                                            fs
                                                .readFileSync(filePath, "utf8")
                                                .toString()
                                        );

                                        return schemaJson;
                                    } catch (err) {
                                        throw new Error("Could not find json", {
                                            cause: { err },
                                        });
                                    }
                                } catch (err) {
                                    throw new Error(
                                        `Error reading file ${file.url}: ${err}`
                                    );
                                }
                            }
                        },
                    },
                },
            },
            "bundle"
        );
        try {
            compile(newSchema, "MDORIM").then((ts) => {
                if (!fs.existsSync(path.resolve("dist"))) {
                    fs.mkdirSync(path.resolve("dist"), {
                        recursive: true,
                    });
                }
                fs.writeFileSync(path.resolve("dist", "index.d.ts"), ts);
            });
        } catch (err) {
            throw new Error(err);
        }
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
