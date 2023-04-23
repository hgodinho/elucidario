"use strict";

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";
import lodash from "lodash-es";

import { parseArgs } from "@elucidario/pkg-parse-args";
import { toMD } from "@elucidario/pkg-docusaurus-md";
import { Console } from "@elucidario/pkg-console";

import { pubGenPrompt } from "./prompt.js";
import packageJson from "../package.json" assert { type: "json" };

const kebabCase = lodash.kebabCase;
const console = new Console(packageJson);

export const createPublication = async (args) => {
    const options = parseArgs();
    const rootPath = path.resolve(options.path);

    inquirer.prompt(pubGenPrompt("create", args)).then(async (answers) => {
        const name = answers.name;
        const packageName = `@elucidario/pub-${kebabCase(name)}`;

        const pubPath = path.resolve(rootPath, "publications");
        const dirName = path.resolve(pubPath, name);
        const templatePath = path.resolve(
            rootPath,
            "packages",
            "pub-gen",
            "template"
        );

        try {
            fs.readdirSync(dirName);
            console.error(`A publicação ${name} já existe`);
        } catch (error) {
            try {
                const packageJson = createPackageJson(name, packageName);
                const pubGenJson = createPubGenJson(name, answers);

                /**
                 * Create publication directory and copy template files
                 */
                fs.mkdirSync(path.resolve(pubPath, name), { recursive: true });
                fs.mkdirSync(path.resolve(pubPath, name, "files"), {
                    recursive: true,
                });
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
                    createREADME(packageName, answers)
                );

                console.success("Publicação criada com sucesso!");

                /**
                 * Install dependencies
                 */
                console.info("Instalando dependências...");
                execSync(`cd ${dirName} && pnpm install`, {
                    stdio: "inherit",
                });
                console.success("Dependências instaladas com sucesso.");

                console.success("Boa escrita!");
            } catch (error) {
                console.error(error);
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
        creation: new Date().toISOString(),
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
            "add-doc": `pub-gen add-doc -p ${name}`,
            authenticate: `pub-gen authenticate -p ${name}`,
            build: `pnpm clean && pub-gen build -m -g -c -p ${name}`,
            clean: "rm -rf dist/*",
        },
        devDependencies: {
            "@elucidario/pkg-pub-gen": "workspace:^",
        },
    };
};
