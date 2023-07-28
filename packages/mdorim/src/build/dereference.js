import path from "path";
import fs from "fs";
import { Console } from "@elucidario/pkg-console";
import { replaceRef } from "./replaceRef.js";
import { dereference } from "@elucidario/pkg-schema-doc";

export const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                try {
                    return JSON.parse(JSON.stringify(value));
                } catch (err) {
                    console.log({
                        err,
                        key,
                        value,
                    });
                    seen.add(value);
                }
                return;
            }
        }
        return value;
    };
};

export const dereferenceSchemas = async (pkg, __dirname, schemas) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    try {
        const dereferenced = {};
        await Promise.all(
            Object.entries(schemas).map(async ([name, schema]) => {
                const replaced = replaceRef(schema, false);
                dereferenced[name] = await dereference(replaced, {
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
                                            fileUrl.base,
                                        );
                                        try {
                                            const schema = fs
                                                .readFileSync(filePath, "utf8")
                                                .toString();
                                            return schema;
                                        } catch (err) {
                                            throw new Error(
                                                `Could not find json: ${err}`,
                                            );
                                        }
                                    } catch (err) {
                                        throw new Error(
                                            `Error reading file at ${file.url}: ${err}`,
                                        );
                                    }
                                }
                            },
                        },
                    },
                });
            }),
        );
        return dereferenced;
    } catch (err) {
        console.log(
            { err },
            { type: "error", defaultLog: true, title: "Error" },
        );
        throw new Error(err);
    }
};
