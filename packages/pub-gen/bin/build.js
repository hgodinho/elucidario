#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { pubGenRemarkProcessor } from "../lib/remark/processor.js";
import { readContents } from "@elucidario/pkg-schema-doc";
import chalk from "chalk";

const srcPath = path.resolve("src");
const libPath = path.resolve("lib");
const docsPath = path.resolve("docs");

const docs = readContents(srcPath, ["md"]);

console.log(chalk.green("[pub-gen] Building docs..."));
const build = Object.entries(docs).map(async ([name, content]) => {
    const newFile = await pubGenRemarkProcessor(content, {
        pubGen: {
            publication: "test",
            path: libPath,
        },
    });

    fs.writeFileSync(path.resolve(docsPath, `${name}.md`), newFile.toString());
    return `${name}.md`;
});

Promise.all(build).then((files) => {
    console.log(
        chalk.blueBright("[pub-gen] Built files:"),
        chalk.blueBright(files)
    );
});
