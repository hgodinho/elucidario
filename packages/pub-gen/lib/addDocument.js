"use strict";

import fs from "fs";
import path, { dirname } from "path";
import inquirer from "inquirer";
import chalk from "chalk";

import lodash from "lodash";

import { createDoc } from "@elucidario/pkg-md-to-gdoc";

import { pubGenPrompt } from "./prompt.js";
import { getCredentials } from "./getCredentials.js";

const { merge } = lodash;

const __dirname = path.resolve();

export const addDocument = async (args) => {
    const rootPath = path.resolve(__dirname, "..", "..");
    const templatePath = path.resolve(
        rootPath,
        "packages",
        "pub-gen",
        "template"
    );
    const publication = args.publication;
    const pubPath = path.resolve(rootPath, "publications");
    const dirName = path.resolve(pubPath, publication);

    inquirer.prompt(pubGenPrompt("addDocument", args)).then(async (answers) => {
        const { anotherDocument, document } = answers;

        let documents = [];
        if (anotherDocument) {
            console.log(
                chalk.green(`${document.title} adicionado com sucesso`)
            );
            documents = await createGoogleIntegration(
                document,
                templatePath,
                dirName,
                rootPath
            );
            addDocument(args);
        } else {
            documents = await createGoogleIntegration(
                document,
                templatePath,
                dirName,
                rootPath
            );
            /**
             * Save pub-gen.json
             */
            saveDocumentsToPubGenJson(documents, dirName);
        }
    });
};

const saveDocumentsToPubGenJson = (documents, dirName) => {
    const pubGenJson = JSON.parse(
        fs.readFileSync(path.resolve(dirName, "pub-gen.json"))
    );
    pubGenJson.documents = [...pubGenJson.documents, ...documents];
    try {
        fs.writeFileSync(
            path.resolve(dirName, "pub-gen.json"),
            JSON.stringify(pubGenJson, null, 4)
        );
        const documentsNames = documents.map((doc) => doc.title).join(", ");
        console.log(
            chalk.green(`Successfully create documents: ${documentsNames}`)
        );
    } catch (error) {
        console.log(chalk.red("It was not possible to save pub-gen.json"));
        console.error(error);
    }
};

const documents = [];
const createGoogleIntegration = async (document, from, to, rootPath) => {
    try {
        /**
         * Try to get credentials
         */
        let credentials = {};
        try {
            credentials = getCredentials();
        } catch (error) {
            console.log(chalk.red("It was not possible to get credentials"));
            console.error(error);
            return error;
        }

        switch (document.type) {
            case "doc":
                /**
                 * Create references directory and copy demo references
                 */
                createReferences(document.preset, from, to);

                /**
                 * Create content directory and copy demo content
                 */
                createDemoContent(document.language, from, to);

                /**
                 * Create Google Docs
                 */
                try {
                    const defaultDoc = {
                        ...document,
                        keywords: document.keywords
                            .split(",")
                            .map((keyword) => keyword.trim()),
                    };
                    const response = await createDoc(
                        document.title,
                        credentials,
                        rootPath
                    );
                    const doc = merge({}, defaultDoc, response);
                    documents.push(doc);
                    return documents;
                } catch (error) {
                    console.log(
                        chalk.red("It was not possible to create Google Docs")
                    );
                    console.error(error);
                    return error;
                }

            case "slide":
                console.warn(chalk.yellowBright("Slides not implemented yet"));
                // docs = await createDoc(
                //     document.title,
                //     credentials,
                //     rootPath
                // );
                // console.log(docs);
                throw new Error("Slides not implemented yet");

            case "sheet":
                console.warn(chalk.yellowBright("Sheets not implemented yet"));
                // docs = await createDoc(
                //     document.title,
                //     credentials,
                //     rootPath
                // );
                // console.log(docs);
                throw new Error("Sheets not implemented yet");

            default:
                throw new Error("Document type not found");
        }
    } catch (error) {
        console.log(
            chalk.red("It was not possible to create integration with Google")
        );
        console.error(error);
        return error;
    }
};

const createReferences = (preset, from, to) => {
    try {
        let demoRefs = fs.readdirSync(path.resolve(from, "references", preset));
        if (demoRefs.length > 0) {
            fs.mkdirSync(path.resolve(to, "references", preset), {
                recursive: true,
            });
            demoRefs.forEach((file) => {
                fs.copyFileSync(
                    path.resolve(from, "references", preset, file),
                    path.resolve(to, "references", preset, file)
                );
            });
        }
        console.log(chalk.green("Successfully created references."));
    } catch (error) {
        console.log(chalk.red("It was not possible to create references"));
        console.error(error);
    }
};

const createDemoContent = (language, from, to) => {
    try {
        const demoContent = fs.readdirSync(path.resolve(from, "content"));
        fs.mkdirSync(path.resolve(to, "content", language), {
            recursive: true,
        });
        demoContent.forEach((file) => {
            fs.copyFileSync(
                path.resolve(from, "content", file),
                path.resolve(to, "content", language, file)
            );
        });
        console.log(chalk.green("Successfully created demo content."));
    } catch (error) {
        console.log(chalk.red("It was not possible to create demo content"));
        console.error(error);
    }
};
