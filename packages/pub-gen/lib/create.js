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
    createGitIgnore,
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
const addPublicationInquirer = async (defaults) => {
    return await makeInquirer({
        title: "Adding publications...",
        prompt: pubGenPrompt("publication", defaults),
        callback: async (answers) => {
            const { publication, addMorePublication } = cleanFalsy(answers);
            const { title, language, style } = publication;

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
                        publication: {
                            title,
                            language,
                            style,
                        },
                        addMorePublication,
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
        console.log(
            { args },
            { type: "warning", defaultLog: true, title: "Debug mode" }
        );
    }
    await makeInquirer({
        title: "Creating publication...",
        prompt: pubGenPrompt("create", args),
        callback: async (answers) => {
            let { addLicense, addAuthor, ...options } = cleanFalsy(answers);

            console.error({
                message: cleanFalsy(answers),
                defaultLog: true,
            });

            const PubGen = {
                ...options,
                name: kebabCase(options.title),
                licenses: [],
                contributors: [],
                publications: [],
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
                if (debug) {
                    console.log(
                        { license: license.license, addMoreLicense },
                        {
                            type: "warning",
                            defaultLog: true,
                            title: "Debug mode",
                        }
                    );
                }
            }

            while (addAuthor) {
                const { addMoreAuthor, ...contributor } =
                    await addAuthorInquirer();

                PubGen.contributors.push(contributor.contributor);
                addAuthor = addMoreAuthor;
                if (debug) {
                    console.log(
                        { author: contributor.contributor, addMoreAuthor },
                        {
                            type: "warning",
                            defaultLog: true,
                            title: "Debug mode",
                        }
                    );
                }
            }

            let { addMorePublication, ...publication } =
                await addPublicationInquirer({
                    title: PubGen.title,
                });

            PubGen.publications.push(publication.publication);

            while (addMorePublication) {
                const publicationResponse = await addPublicationInquirer({
                    title: PubGen.title,
                });

                PubGen.publications.push(publicationResponse.publication);

                if (!publicationResponse.addMorePublication) {
                    addMorePublication = false;
                }
            }

            try {
                const files = {
                    "package.json": createPackageJson(name),
                    "pub-gen.json": createPubGenJson(name, PubGen),
                    "README.md": createREADME(name, PubGen),
                    ".gitignore": createGitIgnore(),
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
                    console.log("Boa escrita!");
                }
            } catch (error) {
                console.log(error, { type: "error", defaultLog: true });
            }
        },
    });
    // await inquirer
    //     .prompt(pubGenPrompt("create", args))
    //     .then();
};
