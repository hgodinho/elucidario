import path from "path";
import fs from "fs";
import { Command } from "commander";
import { debounce } from "lodash-es";
import pkg from "json-schema-to-typescript";

import { readContents, mergeSubSchema } from "@elucidario/pkg-schema-doc";
import { Console } from "@elucidario/pkg-console";

import { fileURLToPath } from "url";
import { pubGenRemarkProcessor } from "@elucidario/pkg-pub-gen/lib/remark/processor.js";

const { compile } = pkg;
const outDocs = "docs";
const outStatic = path.resolve("static", "mdorim", "schemas");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "package.json"))
);
const console = new Console(packageJson);

export const buildDocs = async () => {
    const pages = readContents(path.join(__dirname, "pages"), ["md"]);
    return Promise.all(
        Object.entries(pages).map(async ([name, page]) => {
            const newFile = await pubGenRemarkProcessor(page, {
                pubGen: {
                    path: __dirname,
                },
            });
            fs.writeFile(
                path.resolve(outDocs, `${name}.md`),
                newFile.toString(),
                (err) => {
                    if (err)
                        console.log(`There was an error: ${err}`, {
                            type: "error",
                            defaultLog: true,
                        });
                }
            );
            const sidebar = fs.readFileSync(
                path.join(__dirname, "sidebars.cjs"),
                "utf8"
            );
            const localSidebar = fs.readFileSync(
                path.join(__dirname, "localSidebars.cjs"),
                "utf8"
            );
            fs.writeFile(
                path.resolve(outDocs, "sidebars.cjs"),
                sidebar.toString(),
                (err) => {
                    if (err)
                        console.log(`There was an error: ${err}`, {
                            type: "error",
                            defaultLog: true,
                        });
                }
            );
            fs.writeFile(
                path.resolve(outDocs, "localSidebars.cjs"),
                localSidebar.toString(),
                (err) => {
                    if (err)
                        console.log(`There was an error: ${err}`, {
                            type: "error",
                            defaultLog: true,
                        });
                }
            );
        }),
        console.log("Done!", { type: "success" })
    );
};

export const buildTypes = async () => {
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
                                        const schemaJson = fs.readFileSync(
                                            filePath,
                                            "utf8"
                                        );

                                        return schemaJson;
                                    } catch (err) {
                                        throw new Error(err);
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

const replaceRef = (schema) => {
    for (let key in schema) {
        if (key === "$ref") {
            if (schema[key].includes("<local>")) {
                schema[key] = schema[key].replace(
                    "<local>",
                    `${packageJson.homepage}/schema`
                );
            }
        } else if (typeof schema[key] === "object") {
            replaceRef(schema[key]);
        }
    }
    return schema;
};

export const buildSchemas = async () => {
    const schemas = readContents(
        path.join(__dirname, "schemas"),
        ["json"],
        undefined,
        ["index.json"]
    );
    try {
        return Promise.all(
            Object.entries(schemas).map(async ([name, schema]) => {
                const newSchema = replaceRef(schema);
                if (!fs.existsSync(path.resolve(outStatic))) {
                    fs.mkdirSync(path.resolve(outStatic), {
                        recursive: true,
                    });
                }
                fs.writeFile(
                    path.resolve(outStatic, `${name}`),
                    JSON.stringify(newSchema, null, 4),
                    (err) => {
                        if (err)
                            console.log(`There was an error: ${err}`, {
                                type: "error",
                                defaultLog: true,
                            });
                    }
                );
            })
        );
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};

export const build = async () => {
    const program = new Command("build");

    program.option("-w, --watch", "Watch for changes", false);

    program.parse();

    const options = program.opts();

    if (options.watch) {
        await buildSchemas();
        await buildTypes();
        await buildDocs();
        console.log(`Watching for changes in ${__dirname}`, { type: "info" });
        fs.watch(
            __dirname,
            {
                recursive: true,
            },
            debounce(async (eventType, filename) => {
                if (filename) {
                    console.log(
                        `event of type "${eventType}" at file "${filename}"`,
                        { type: "info" }
                    );
                    await buildSchemas();
                    await buildTypes();
                    await buildDocs();
                }
            }, 500)
        );
    } else {
        await buildSchemas();
        await buildTypes();
        await buildDocs();
    }
};

// await build();
