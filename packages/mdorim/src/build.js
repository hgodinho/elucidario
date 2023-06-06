import path from "path";
import fs from "fs";
import pkg from "json-schema-to-typescript";
import { exec } from "child_process";
import { program } from "commander";

import { build, getPaths, readContents } from "@elucidario/pkg-paths";
import { mergeSubSchema } from "@elucidario/pkg-schema-doc";
import { Console } from "@elucidario/pkg-console";

import { pubGenRemarkProcessor } from "@elucidario/pkg-pub-gen/lib/remark/processor.js";
import { type } from "os";

const { compile } = pkg;

const { packages } = getPaths();

const outDocs = "docs";
const outStatic = path.resolve(
    packages,
    "mdorim",
    "static",
    "mdorim",
    "schemas"
);

const __dirname = path.resolve(packages, "mdorim", "src");

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(packages, "mdorim", "package.json"))
);
const console = new Console(packageJson);

const buildDocs = async () => {
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

const buildTypes = async () => {
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

                                        console.log(
                                            { schemaJson },
                                            { defaultLog: true }
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

const buildSchemas = async () => {
    const schemas = readContents({
        dirPath: path.join(__dirname, "schemas"),
        extensions: ["json"],
        index: false,
        ignore: ["index.json"],
        package: packageJson,
    });

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
                    path.resolve(outStatic, `${name}.json`),
                    JSON.stringify(newSchema, null, 4),
                    (err) => {
                        if (err)
                            console.log(`There was an error: ${err}`, {
                                type: "error",
                                defaultLog: true,
                            });
                    }
                );
                console.log(`Built: ${name}.json`, {
                    type: "success",
                    title: "Schema built",
                });
            })
        );
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};

const test = async () => {
    console.log("Testing...");
    exec("pnpm test", async (error, stdout, stderr) => {
        if (error) {
            console.log(
                { error },
                {
                    defaultLog: true,
                    type: "error",
                    title: "Error",
                }
            );
            return;
        }
        if (stderr) {
            console.log(stderr, {
                defaultLog: true,
                type: "warning",
                title: "stderr",
            });
            return;
        }
        console.log(
            { stdout },
            {
                defaultLog: true,
                type: "success",
                title: "stdout",
            }
        );
    });
};

export const buildMdorim = async () => {
    program
        .description("Builds the mdorim model")
        .option("-w, --watch", "Watch for changes", false)
        .option("-s, --schema", "Builds the schema", false)
        .option("-e, --examples", "Builds the examples", false)
        .option("-t, --types", "Builds the types", false)
        .option("-d, --docs", "Builds the docs", false)
        .option("--test", "Test the model", false)
        .action(async (options) => {
            await build(
                {
                    package: packageJson,
                    watch: options.watch,
                    watchSrc: [
                        __dirname,
                        path.resolve(__dirname, "..", "test"),
                    ],
                },
                async () => {
                    if (options.schema) await buildSchemas();
                    if (options.types) await buildTypes();
                    if (options.docs) await buildDocs();

                    if (options.test) {
                        await test();
                    }
                }
            );
        });

    program.parse(process.argv);
};

await buildMdorim();
