#!/usr/bin/env node

import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import { pubGenRemarkProcessor } from "../lib/remark/processor.js";
import { mergeSubSchema, replaceRef } from "@elucidario/pkg-schema-doc";
import { Command } from "commander";

import { Console } from "@elucidario/pkg-console";
import {
    getPaths,
    readContents,
    readFile,
    createFile,
} from "@elucidario/pkg-paths";
import { debounce } from "../lib/utils.js";

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(
        path.resolve(paths.packages, "pub-gen", "package.json"),
        "utf-8",
    ),
);
const console = new Console(packageJson);

const srcPath = path.resolve(paths.packages, "pub-gen", "src", "docs");
const libPath = path.resolve(paths.packages, "pub-gen", "lib");
const docsPath = path.resolve(paths.packages, "pub-gen", "docs");
const distPath = path.resolve(
    paths.packages,
    "pub-gen",
    "static",
    "pub-gen",
    "schemas",
);

const docs = readContents({
    dirPath: srcPath,
    extensions: ["md"],
    index: false,
});

const schemas = readContents({
    dirPath: path.resolve(libPath, "schema"),
    extensions: ["json"],
    index: false,
});

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

export const build = async (language, exclude) => {
    const buildSchemas = async () =>
        await Promise.all(
            schemas.map(async (file) => {
                const options = {
                    resolve: {
                        file: {
                            async read(file, callback, $refs) {
                                if (file.url.includes("node_modules")) {
                                    return readFile(
                                        path.resolve(
                                            distPath,
                                            file.url.split("/").pop(),
                                        ),
                                    ).content;
                                }
                            },
                        },
                    },
                };
                const newSchema = await mergeSubSchema(
                    replaceRef(file.content, [["core", "./core.json"]]),
                    options,
                );
                return Promise.resolve(
                    createFile(
                        {
                            filePath: path.resolve(
                                distPath,
                                `${file.name}.json`,
                            ),
                            ext: "json",
                        },
                        newSchema,
                    ),
                );
            }),
        );

    const buildDocs = async () =>
        Promise.all(
            Object.entries(docs).map(async ([name, content]) => {
                const newFile = await pubGenRemarkProcessor(content, {
                    pubGen: {
                        // publication: "test",
                        path: distPath,
                        startLevel: 2,
                        language,
                    },
                });

                if (baseDocs.includes(name)) {
                    fs.writeFileSync(
                        path.resolve(docsPath, `${name}.md`),
                        newFile.toString(),
                    );
                } else {
                    if (!fs.existsSync(path.resolve(docsPath, "schemas"))) {
                        fs.mkdirSync(path.resolve(docsPath, "schemas"));
                    }
                    fs.writeFileSync(
                        path.resolve(docsPath, "schemas", `${name}.md`),
                        newFile.toString(),
                    );
                }

                return Promise.resolve(`${name}.md`);
            }),
        );

    console.log("Building schemas...");
    const builtSchemas = await buildSchemas();
    console.log(builtSchemas, {
        type: "success",
        title: `Built ${builtSchemas.length} schemas!`,
        defaultLog: true,
    });

    console.log("Building docs...");
    const builtDocs = await buildDocs();
    console.log(builtDocs, {
        type: "success",
        title: `Built ${builtDocs.length} docs!`,
        defaultLog: true,
    });
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
