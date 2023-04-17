#!/usr/bin/env node

import { readContent } from "../lib/readContent.js";
import path from "path";
import fs from "fs";
import { pubGenRemarkProcessor } from "../lib/remark/processor.js";

const srcPath = path.resolve("src");
const libPath = path.resolve("lib");
const docsPath = path.resolve("docs");

const docs = readContent(srcPath, ["md"]);

Object.entries(docs).map(async ([name, content]) => {
    const newFile = await pubGenRemarkProcessor(content, {
        pubGen: {
            publication: "test",
            path: libPath,
        },
    });

    fs.writeFileSync(path.resolve(docsPath, `${name}.md`), newFile.toString());

    // console.log("newFile", newFile);
});
