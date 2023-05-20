import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import { kebabCase } from "lodash-es";

import { toMD } from "@elucidario/pkg-docusaurus-md";
import { Console } from "@elucidario/pkg-console";
import { readContents } from "@elucidario/pkg-schema-doc";

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
            let { addLicense, addAuthor, languages, ...options } = answers;
            const PubGen = {
                ...options,
                languages: languages.includes(",")
                    ? languages.split(",").map((lang) => lang.trim())
                    : [languages],
                licenses: [],
                contributors: [],
            };
            const name = kebabCase(PubGen.title);
            const packageName = `@elucidario/pub-${name}`;

            const dirName = path.resolve(paths.publications, name);
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

            try {
                fs.readdirSync(dirName);
                console.log(`A publicação ${name} já existe`, {
                    type: "error",
                });
            } catch (error) {
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
                        PubGen.languages.forEach((lang) => {
                            const content = readContents(
                                path.resolve(templatePath, "content"),
                                ["md"]
                            );
                            Object.entries(content).forEach(([key, value]) => {
                                fs.mkdirSync(
                                    path.resolve(dirName, "content", lang),
                                    {
                                        recursive: true,
                                    }
                                );
                                fs.writeFileSync(
                                    path.resolve(
                                        dirName,
                                        "content",
                                        lang,
                                        `${key}.md`
                                    ),
                                    value
                                );
                            });
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
                            console.log(
                                "Dependências instaladas com sucesso.",
                                {
                                    type: "success",
                                }
                            );
                        }
                        console.log("Boa escrita!");
                    }
                } catch (error) {
                    console.log(error, { type: "error" });
                }
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
        $schema: "https://elucidario.art/pub-gen/schema/pub-gen-schema.json",
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
            "ref-add": `pub-gen reference add -p ${name}`,
            "ref-search": `pub-gen reference search -p ${name}`,
            "version-up": `pub-gen version -p ${name}`,
            authenticate: `pub-gen authenticate -p ${name}`,
            build: `pnpm clean && pub-gen build -p ${name}`,
            clean: "rm -rf dist/*",
        },
        devDependencies: {
            "@elucidario/pkg-pub-gen": "workspace:^",
        },
    };
};
