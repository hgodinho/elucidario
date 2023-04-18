"use strict";

import fs from "fs";
import { parseArgs } from "@elucidario/parse-args";
import path from "path";
import inquirer from "inquirer";
import { pubGenPrompt } from "./prompt.js";
import { execSync } from "child_process";
import lodash from "lodash";
const kebabCase = lodash.kebabCase;

import packageJson from "../package.json" assert { type: "json" };
const { version } = packageJson;

export const createPublication = async (args) => {
    const options = parseArgs();
    const rootPath = path.resolve(options.path);

    inquirer.prompt(pubGenPrompt("create", args)).then(async (answers) => {
        const name = kebabCase(answers.name);
        const packageName = `@elucidario/${name}`;

        const pubPath = path.resolve(rootPath, "publications");
        const dirName = path.resolve(pubPath, name);
        const templatePath = path.resolve(
            rootPath,
            "packages",
            "pub-gen",
            "template"
        );

        console.log("Criando publicação...", {
            "Publication name": name,
            "Publication path": dirName,
            "Package name": packageName,
        });

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
                    createREADME(packageName)
                );

                console.log("Publicação criada com sucesso!");

                /**
                 * Install dependencies
                 */
                console.log("Instalando dependências...");
                execSync(`cd ${dirName} && pnpm install`, {
                    stdio: "inherit",
                });
                console.log("Dependências instaladas com sucesso.");

                console.log("Boa escrita!");
            } catch (error) {
                console.error(error);
            }
        }
    });
};

/**
 *  Creates the README.md file for the publication
 * @param {string} packageName | Name of the publication package
 * @returns | README.md
 */
const createREADME = (packageName) => {
    return `# \`${packageName}\`\n`;
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
        name,
        ...answers,
        creationDate: new Date().toISOString(),
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
            "@elucidario/pub-gen": `^${version}`,
        },
    };
};
