import path from "path";
import { execSync } from "child_process";
import { kebabCase } from "lodash-es";

import { Console } from "@elucidario/pkg-console";
import {
    getPaths,
    readFile,
    createDir,
    createFile,
    dirExists,
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
    flattenStyleStructureFiles,
} from "./utils.js";

const pkg = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json"),
).value;
const console = new Console(pkg);

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
            const { title, language, style, index, assets_titles } = document;

            console.log({ title, language, style, index, assets_titles });

            await fetchLocales([language]);

            try {
                const styleName = style.split("-")[0];
                const response = await fetchSearchStyles([styleName]);

                if (response.total_count > 0) {
                    const csl = await makeInquirer({
                        title: `Found ${response.total_count} csl-styles. Select one of them:`,
                        prompt: [
                            {
                                type: "list",
                                name: "style",
                                message: `Found ${response.total_count} csl-styles. Select one of them:`,
                                choices: response.items.map((item) => {
                                    return item.name;
                                }),
                            },
                        ],
                        callback: async (answers) => {
                            await fetchStyles([answers.style]);
                            return answers.style;
                        },
                        type: "warning",
                    });

                    return {
                        document: {
                            title,
                            language,
                            style: {
                                name: style,
                                csl,
                            },
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

            if (dirExists(dirName)) {
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
                const directories = ["dist", "files", "references"];

                if (debug) {
                    console.warning({
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
                        createFile(path.resolve(dirName, key), value);
                    });

                    PubGen.documents.forEach((document) => {
                        const { title, language, style } = document;
                        const documentName = kebabCase(title);
                        const documentDir = path.resolve(
                            dirName,
                            "content",
                            language,
                        );
                        createDir(documentDir);

                        const pageStyle = readFile(
                            path.resolve(
                                getPaths().packages,
                                "pub-gen",
                                "lib",
                                "styles",
                                `${style.name}.json`,
                            ),
                        ).value;
                        if (pageStyle.hasOwnProperty("structure")) {
                            const structure = flattenStyleStructureFiles(
                                pageStyle.structure,
                                ["body"],
                            );
                            console.log({ structure });
                        }
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
                                " ",
                            )}`,
                            {
                                stdio: "inherit",
                            },
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
