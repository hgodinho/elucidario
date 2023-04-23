#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { pubGenRemarkProcessor } from "../lib/remark/processor.js";
import { readContents, mergeAllOfSchema } from "@elucidario/pkg-schema-doc";
import { Command } from "commander";

import { Console } from "@elucidario/pkg-console";

import packageJson from "../package.json" assert { type: "json" };
const log = new Console(packageJson);

const srcPath = path.resolve("src");
const libPath = path.resolve("lib");
const docsPath = path.resolve("docs");
const distPath = path.resolve("dist");

const docs = readContents(srcPath, ["md"]);
const schemas = readContents(path.resolve(libPath, "schema"), ["json"]);

if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath);
}

export const build = async (language) => {
    const buildSchemas = async () =>
        Object.entries(schemas).map(async ([name, schema]) => {
            const newSchema = await mergeAllOfSchema(schema);

            fs.writeFileSync(
                path.resolve(distPath, `${name}.json`),
                JSON.stringify(newSchema, null, 4)
            );

            return `${name}.json`;
        });

    const buildDocs = async (language) =>
        Object.entries(docs).map(async ([name, content]) => {
            const newFile = await pubGenRemarkProcessor(content, {
                pubGen: {
                    publication: "test",
                    path: distPath,
                    startLevel: 2,
                    language,
                },
            });

            fs.writeFileSync(
                path.resolve(docsPath, `${name}.md`),
                newFile.toString()
            );
            return `${name}.md`;
        });

    log.info("Building schemas...");
    const builtSchemas = await buildSchemas();
    log.success(`Built ${builtSchemas.length} schemas`);

    log.info("Building docs...");
    const builtDocs = await buildDocs(language);
    log.success(`Built ${builtDocs.length} docs`);
};

export const buildProcess = async () => {
    const program = new Command();

    program.option("-w, --watch", "watch for changes", false);
    program.option("-l, --language <lang>", "language", "en");
    program.parse();

    const options = program.opts();

    if (options.watch) {
        log.info("Watching for changes...");
        await build(options.language);
        fs.watch(srcPath, { recursive: true }, async (eventType, filename) => {
            log.info(`Change detected (${eventType}): ${filename}`);
            await build(options.language);
        });
    } else {
        await build(options.language);
    }
};

buildProcess();
