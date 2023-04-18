#!/usr/bin/env node

import path from "path";
import fs from "fs";
import chalk from "chalk";

import { pubGenRemarkProcessor } from "./remark/processor.js";

import { readContents } from "@elucidario/pkg-schema-doc";
import { updateDoc } from "@elucidario/pkg-md-to-gdoc";
import { getCredentials } from "./getCredentials.js";

const __dirname = path.resolve();

export const buildPublication = async (args) => {
    console.log("build", { args });
    const { publication, md, gdoc, cleanDist } = args;

    const rootPath = path.resolve(__dirname, "..", "..");
    const pubPath = path.resolve(rootPath, "publications", publication);
    const contentPath = path.resolve(pubPath, "content");
    const distPath = path.resolve(pubPath, "dist");

    const pubGenJson = JSON.parse(
        fs.readFileSync(path.resolve(pubPath, "pub-gen.json"))
    );

    const { documents } = pubGenJson;

    fs.existsSync(distPath) || fs.mkdirSync(distPath);

    if (cleanDist && fs.existsSync(distPath)) {
        const distFiles = fs.readdirSync(distPath);
        distFiles.map((file) => {
            fs.unlinkSync(path.resolve(distPath, file));
        });
    }

    documents.map(async (doc) => {
        const languageContentPath = path.resolve(contentPath, doc.language);
        const mdContent = readContents(languageContentPath, "md");

        if (md) {
            fs.existsSync(path.resolve(distPath, doc.language)) ||
                fs.mkdirSync(path.resolve(distPath, doc.language));
        }

        let gdocument = [];
        await Promise.all(
            Object.entries(mdContent).map(async ([name, content]) => {
                const newFile = await pubGenRemarkProcessor(content, {
                    pubGen: {
                        publication,
                        path: languageContentPath,
                    },
                });

                if (md) {
                    fs.writeFileSync(
                        path.resolve(distPath, doc.language, `${name}.md`),
                        newFile.value
                    );
                }

                if (gdoc) {
                    // console.log("gdoc", { name, content });
                    console.warn(
                        chalk.yellow("parsing of tables not implemented yet")
                    );
                    gdocument.push({
                        name,
                        content: content,
                    });
                }
            })
        );

        if (gdoc) {
            const gdocContent = await updateDoc(
                doc.id,
                gdocument.map((item) => item.content).join("\n"),
                getCredentials(),
                rootPath
            );

            console.log("gdocContent", gdoc, gdocContent);
        }
    });
};
