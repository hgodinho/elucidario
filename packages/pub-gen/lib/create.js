import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { kebabCase } from "lodash-es";

import { Console } from "@elucidario/pkg-console";
import {
    getPaths,
    readFile,
    createDir,
    createFile,
} from "@elucidario/pkg-paths";

import { fetchLocales } from "./reference/fetchLocales.js";
import { fetchStyles } from "./reference/fetchStyles.js";
import { fetchSearchStyles } from "./reference/fetchSearchStyles.js";
import { pubGenPrompt } from "./prompt/pubGenPrompt.js";
import {
    cleanFalsy,
    makeInquirer,
    createREADME,
    createGitignore,
    createPubGenJson,
    createPackageJson,
} from "./utils.js";

const packageJson = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json")
).content;
const console = new Console(packageJson);

/**
 *  Add license inquirer
 *
 * @returns {Object}
 */
const addLicenseInquirer = async () =>
    await makeInquirer({
        title: "Adding licenses...",
        prompt: pubGenPrompt("addLicense"),
    });

/**
 * Add author inquirer
 *
 * @returns {Object}
 */
const addAuthorInquirer = async () =>
    await makeInquirer({
        title: "Adding contributors...",
        prompt: pubGenPrompt("addAuthor"),
    });

/**
 * Add publication inquirer
 *
 * @param {Object} defaults
 * @returns {Object}
 */
const addDocumentInquirer = async (defaults) => {
    return await makeInquirer({
        title: "Adding documents...",
        prompt: pubGenPrompt("document", defaults),
        callback: async (answers) => {
            const { document, addMoreDocument } = cleanFalsy(answers);
            const { title, language, style } = document;

            await fetchLocales([language]);

            try {
                const response = await fetchSearchStyles([style]);

                if (response.total_count > 0) {
                    const style = await makeInquirer({
                        title: `Found ${response.total_count} styles. Select one of them:`,
                        prompt: [
                            {
                                type: "list",
                                name: "style",
                                message: `Found ${response.total_count} styles. Select one of them:`,
                                choices: response.items.map((item) => {
                                    return item.name;
                                }),
                            },
                        ],
                        callback: async (answers) => {
                            await fetchStyles([answers.style]);
                            return {
                                name: answers.style,
                                url: response.items.find(
                                    (item) => item.name === answers.style
                                ).html_url,
                            };
                        },
                    });

                    return {
                        document: {
                            title,
                            language,
                            style,
                        },
                        addMoreDocument,
                    };
                }
            } catch (error) {
                console.log(error);
            }
        },
    });
};

export const createPublication = async (args) => {
    const { noInstall, debug } = args;

    if (debug) {
        console.warning({
            message: args,
            defaultLog: true,
            title: "Debug mode",
        });
    }
    await makeInquirer({
        title: "Creating publication...",
        prompt: pubGenPrompt("create", args),
        callback: async (answers) => {
            let { addLicense, addAuthor, ...options } = cleanFalsy(answers);

            if (debug) {
                console.warning({
                    message: cleanFalsy(answers),
                    defaultLog: true,
                    title: "Debug mode",
                });
            }

            const PubGen = {
                ...options,
                name: kebabCase(options.title),
                licenses: [],
                contributors: [],
                documents: [],
            };

            const name = PubGen.name;

            const dirName = path.resolve(getPaths().publications, name);

            if (fs.existsSync(dirName)) {
                throw new Error(`A publicação ${name} já existe`);
            }

            while (addLicense) {
                const { addMoreLicense, ...license } =
                    await addLicenseInquirer();

                PubGen.licenses.push(license.license);
                addLicense = addMoreLicense;
            }

            while (addAuthor) {
                const { addMoreAuthor, ...contributor } =
                    await addAuthorInquirer();

                PubGen.contributors.push(contributor.contributor);
                addAuthor = addMoreAuthor;
            }

            let { addMoreDocument, document } = await addDocumentInquirer({
                title: PubGen.title,
            });

            PubGen.documents.push(document);

            while (addMoreDocument) {
                const documentResponse = await addPublicationInquirer({
                    title: PubGen.title,
                });

                PubGen.documents.push(documentResponse.document);

                if (!documentResponse.addMoreDocument) {
                    addMoreDocument = false;
                }
            }

            try {
                const files = {
                    "package.json": createPackageJson(name),
                    "pub-gen.json": createPubGenJson(name, PubGen),
                    "README.md": createREADME(name, PubGen),
                    ".gitignore": createGitignore(),
                };
                const directories = ["content", "dist", "files", "references"];

                if (debug) {
                    console.warning({
                        defaultLog: true,
                        message: {
                            files,
                            directories,
                        },
                    });
                } else {
                    /**
                     * Create publication directories and files
                     */
                    directories.forEach((dir) => {
                        createDir(path.resolve(dirName, dir));
                    });

                    Object.entries(files).forEach(([key, value]) => {
                        console.log(key, value);
                        createFile(path.resolve(dirName, key), value);
                    });

                    console.success({
                        title: `Publicação ${name} criada com sucesso.`,
                        message: {
                            files,
                            directories,
                        },
                        defaultLog: true,
                    });

                    const devDependencies = ["jest"];
                    /**
                     * Install dependencies
                     */
                    if (!noInstall) {
                        console.log("Instalando dependências...");
                        execSync(
                            `cd ${dirName} && pnpm install -D ${devDependencies.join(
                                " "
                            )}`,
                            {
                                stdio: "inherit",
                            }
                        );
                        console.log("Dependências instaladas com sucesso.", {
                            type: "success",
                        });
                    }
                    console.success({ message: "Boa escrita!" });
                }
            } catch (error) {
                console.error({ message: error, defaultLog: true });
            }
        },
    });
};
