#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { pubGenRemarkProcessor } from "../lib/remark/processor.js";
import { readContents } from "@elucidario/pkg-schema-doc";

const srcPath = path.resolve("src");
const libPath = path.resolve("lib");
const docsPath = path.resolve("docs");

// console.log({ srcPath, libPath, docsPath });
const docs = readContents(srcPath, ["md"]);

Object.entries(docs).map(async ([name, content]) => {
    const newFile = await pubGenRemarkProcessor(content, {
        pubGen: {
            publication: "test",
            path: libPath,
        },
    });

    fs.writeFileSync(path.resolve(docsPath, `${name}.md`), newFile.toString());
});
