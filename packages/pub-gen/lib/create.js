import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { kebabCase } from "lodash-es";

import { toMD } from "@elucidario/pkg-docusaurus-md";
import { Console } from "@elucidario/pkg-console";
import { fetchLocales } from "./reference/fetchLocales.js";
import { fetchStyles } from "./reference/fetchStyles.js";
import { fetchSearchStyles } from "./reference/fetchSearchStyles.js";
import { pubGenPrompt } from "./prompt/pubGenPrompt.js";

import { getPaths } from "./getPaths.js";
const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

const addLicenseInquirer = async () => {
    console.log("Adding licenses...");
    return await inquirer
        .prompt(pubGenPrompt("addLicense"))
        .then(async (answers) => {
            return answers;
        });
};

const addAuthorInquirer = async () => {
    console.log("Adding contributors...");
    return await inquirer
        .prompt(pubGenPrompt("addAuthor"))
        .then(async (answers) => {
            return answers;
        });
};

const addPublicationInquirer = async (defaults) => {
    console.log("Adding publications...");
    return await inquirer
        .prompt(pubGenPrompt("publication", defaults))
        .then(async (answers) => {
            const { publication, addMorePublication } = answers;
            const { title, language, style } = publication;

            await fetchLocales([language]);

            try {
                const response = await fetchSearchStyles([style]);

                if (response.total_count > 0) {
                    const style = await inquirer
                        .prompt([
                            {
                                type: "list",
                                name: "style",
                                message: `Found ${response.total_count} styles. Select one of them:`,
                                choices: response.items.map((item) => {
                                    return item.name;
                                }),
                            },
                        ])
                        .then(async (answers) => {
                            await fetchStyles([answers.style]);
                            return {
                                name: answers.style,
                                url: response.items.find(
                                    (item) => item.name === answers.style
                                ).html_url,
                            };
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

    await inquirer
        .prompt(pubGenPrompt("create", args))
        .then(async (answers) => {
            let { addLicense, addAuthor, ...options } = answers;

            const PubGen = {
                ...options,
                name: kebabCase(options.title),
                licenses: [],
                contributors: [],
                publications: [],
            };

            const name = PubGen.name;

            const packageName = `@elucidario/pub-${name}`;

            const dirName = path.resolve(paths.publications, name);

            if (fs.existsSync(dirName)) {
                throw new Error(`A publicação ${name} já existe`);
            }

            const templatePath = path.resolve(paths.pubGen, "template");

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
                const packageJson = createPackageJson(name, packageName);
                const pubGenJson = createPubGenJson(name, PubGen);
                const readme = createREADME(packageName, PubGen);

                if (debug) {
                    console.log(
                        {
                            pubGenJson,
                            packageJson,
                            readme,
                        },
                        {
                            type: "info",
                            defaultLog: true,
                            title: "Debug mode",
                        }
                    );
                } else {
                    /**
                     * Create publication directory and copy template files
                     */
                    fs.mkdirSync(dirName, { recursive: true });
                    fs.writeFileSync(
                        path.resolve(dirName, "package.json"),
                        JSON.stringify(packageJson, null, 4)
                    );
                    fs.writeFileSync(
                        path.resolve(dirName, "pub-gen.json"),
                        JSON.stringify(pubGenJson, null, 4)
                    );
                    fs.copyFileSync(
                        path.resolve(templatePath, ".gitignore"),
                        path.resolve(dirName, ".gitignore")
                    );
                    fs.writeFileSync(
                        path.resolve(dirName, "README.md"),
                        readme
                    );
                    fs.mkdirSync(path.resolve(dirName, "files"), {
                        recursive: true,
                    });
                    fs.mkdirSync(path.resolve(dirName, "dist"), {
                        recursive: true,
                    });
                    fs.mkdirSync(path.resolve(dirName, "references"), {
                        recursive: true,
                    });
                    fs.mkdirSync(path.resolve(dirName, "content"), {
                        recursive: true,
                    });

                    console.log(pubGenJson, {
                        title: "Publicação criada com sucesso!",
                        type: "success",
                        defaultLog: true,
                    });

                    /**
                     * Install dependencies
                     */
                    if (!noInstall) {
                        console.log("Instalando dependências...");
                        execSync(`cd ${dirName} && pnpm install`, {
                            stdio: "inherit",
                        });
                        console.log("Dependências instaladas com sucesso.", {
                            type: "success",
                        });
                    }
                    console.log("Boa escrita!");
                }
            } catch (error) {
                console.log(error, { type: "error" });
            }
        });
};

/**
 *  Creates the README.md file for the publication
 * @param {string} packageName | Name of the publication package
 * @param {*} answers | package.json of the publication
 * @returns | README.md
 */
const createREADME = (packageName, answers) => {
    return toMD([
        `# \`${packageName}\`\n`,
        `> Publicação gerada com [pub-gen](https://elucidario.art/pub-gen)`,
        answers.description,
    ]);
};

/**
 *  Creates the pub-gen.json file for the publication
 * @param {string} name | name of the publication
 * @param {*} answers | answers from the prompt
 * @returns | pub-gen.json
 */
const createPubGenJson = (name, answers) => {
    return {
        $schema: "https://elucidario.art/pub-gen/schemas/pub-gen-schema.json",
        version: "1.0.0",
        profile: "data-package",
        id: `https://elucidario.art/publicacoes/${name}`,
        ...answers,
        keywords: answers.keywords.split(","),
        created: new Date().toISOString(),
    };
};

/**
 * Creates the package.json file for the publication
 * @param {string} name | name of the publication
 * @param {string} packageName | name of the publication package
 * @returns | package.json
 */
const createPackageJson = (name, packageName) => {
    return {
        name: packageName,
        version: "0.1.0",
        main: "README.md",
        private: true,
        scripts: {
            "add-author": `pub-gen add-author -p ${name}`,
            authenticate: `pub-gen authenticate -p ${name}`,
            build: `pnpm clean && pub-gen build -p ${name}`,
            clean: "rm -rf dist/*",
            convert: `pub-gen convert -p ${name}`,
            "ref-add": `pub-gen reference add -p ${name}`,
            "ref-search": `pub-gen reference search -p ${name}`,
            "version-up": `pub-gen version -p ${name}`,
        },
        devDependencies: {
            "@elucidario/pkg-pub-gen": "workspace:^",
        },
    };
};
