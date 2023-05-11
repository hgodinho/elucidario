#!/usr/bin/env node

import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import { pubGenRemarkProcessor } from "../lib/remark/processor.js";
import { readContents, mergeSubSchema } from "@elucidario/pkg-schema-doc";
import { Command } from "commander";

import { Console } from "@elucidario/pkg-console";
import { getPaths } from "../lib/getPaths.js";
const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"), "utf-8")
);
const console = new Console(packageJson);

const srcPath = path.resolve("src");
const libPath = path.resolve("lib");
const docsPath = path.resolve("docs");
const distPath = path.resolve("static", "pub-gen", "schemas");

const docs = readContents(srcPath, ["md"], false);

const schemas = readContents(path.resolve(libPath, "schema"), ["json"]);

if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath);
}
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
}

const baseDocs = [
    "home",
    "referencia",
    "publicacao",
    "google-drive",
    "versionamento",
];

const debounce = async (func, delay) => {
    let timeoutId;
    return async (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            await func(...args);
        }, delay);
    };
};

export const build = async (language, exclude) => {
    const jsonExclude = exclude?.filter((item) => item.endsWith(".json"));
    const mdExclude = exclude?.filter((item) => item.endsWith(".md"));

    const buildSchemas = async () =>
        await Promise.all(
            Object.entries(schemas).map(async ([name, schema]) => {
                const excluded = Object.keys(schema.properties).filter(
                    (key) => key
                );
                const options = {
                    dereference: {
                        excludedPathMatcher: (path) => {
                            // console.console(path);
                            let isExcluded = false;
                            excluded.forEach((item) => {
                                if (path.includes(item)) {
                                    isExcluded = true;
                                }
                            });
                            return isExcluded;
                        },
                    },
                };
                let newSchema = await mergeSubSchema(
                    schema,
                    options
                    // jsonExclude?.includes(name) ? options : undefined
                );

                fs.writeFileSync(
                    path.resolve(distPath, name),
                    JSON.stringify(newSchema, null, 4)
                );

                Promise.resolve(`${name}.json`);
            })
        );

    const buildDocs = async () =>
        Promise.all(
            Object.entries(docs).map(async ([name, content]) => {
                const newFile = await pubGenRemarkProcessor(content, {
                    pubGen: {
                        publication: "test",
                        path: distPath,
                        startLevel: 2,
                        language,
                    },
                });

                if (baseDocs.includes(name)) {
                    fs.writeFileSync(
                        path.resolve(docsPath, `${name}.md`),
                        newFile.toString()
                    );
                } else {
                    if (!fs.existsSync(path.resolve(docsPath, "schemas"))) {
                        fs.mkdirSync(path.resolve(docsPath, "schemas"));
                    }
                    fs.writeFileSync(
                        path.resolve(docsPath, "schemas", `${name}.md`),
                        newFile.toString()
                    );
                }

                Promise.resolve(`${name}.md`);
            })
        );

    console.log("Building schemas...");
    const builtSchemas = await buildSchemas();
    console.log(`Built ${builtSchemas.length} schemas`, "success");

    console.log("Building docs...");
    const builtDocs = await buildDocs();
    console.log(`Built ${builtDocs.length} docs`, "success");
};

export const buildProcess = async () => {
    const program = new Command();

    program.option("-w, --watch", "watch for changes", false);
    program.option("-l, --language <lang>", "language", "en");
    program.option("-e, --exclude <exclude>", "exclude");
    program.parse();

    const options = program.opts();

    let exclude = [];
    if (options.exclude) {
        exclude = options.exclude.split(",");
    }
    if (exclude.length > 0) {
        console.log(["Excluded files", exclude]);
    }

    if (options.watch) {
        console.log("Watching for changes...");
        await build(options.language, exclude);

        console.log("Watching for changes...", "warning");

        chokidar
            .watch(srcPath, { recursive: true })
            .on("all", async (event, path) => {
                console.log(`Change detected (${event}): ${path}`, "warning");
                await debounce(build(options.language, exclude), 500);
            });
    } else {
        await build(options.language);
    }
};

await buildProcess();
