#!/usr/bin/env node
"use strict";

import fs from "fs";
import { parseArgs } from "@elucidario/parse-args";
import path from "path";
import inquirer from "inquirer";
import { pubGenPrompt } from "./prompt";
import { execSync } from "child_process";
import lodash from "lodash";
const kebabCase = lodash.kebabCase;

export const createPublication = async (args: any) => {
    args = parseArgs();
    console.log("Criando publicação...");
    const rootPath = path.resolve(args.path, "..", "..");
    inquirer.prompt(pubGenPrompt(args)).then(async (answers) => {
        const pubPath = path.resolve(rootPath, "publications");
        const name = kebabCase(answers.titulo);
        const dirName = path.resolve(pubPath, name);
        const packageName = `@elucidario/${name}`;

        try {
            fs.readdirSync(dirName);
            console.error(`A publicação ${name} já existe`);
        } catch (error) {
            try {
                const packageJson = createPackageJson(
                    packageName,
                    answers,
                    args.path
                );
                const pubGenJson = createPubGenJson(name, answers);

                fs.mkdirSync(path.resolve(pubPath, name), { recursive: true });

                fs.writeFileSync(
                    path.resolve(dirName, "package.json"),
                    JSON.stringify(packageJson, null, 4)
                );
                fs.writeFileSync(
                    path.resolve(dirName, "pub-gen.json"),
                    JSON.stringify(pubGenJson, null, 4)
                );
                fs.copyFileSync(
                    path.resolve(args.path, "template", ".gitignore"),
                    path.resolve(dirName, ".gitignore")
                );
                fs.writeFileSync(
                    path.resolve(dirName, "README.md"),
                    createREADME(packageName)
                );

                const demoContent = fs.readdirSync(
                    path.resolve(args.path, "template", "content")
                );

                if (answers.multiIdioma) {
                    const idiomas = answers.idiomas
                        .split(",")
                        .map((x: string) => x.trim());
                    idiomas.forEach((idioma: string) => {
                        fs.mkdirSync(path.resolve(dirName, "content", idioma), {
                            recursive: true,
                        });
                        demoContent.forEach((file: string) => {
                            fs.copyFileSync(
                                path.resolve(
                                    args.path,
                                    "template",
                                    "content",
                                    file
                                ),
                                path.resolve(dirName, "content", idioma, file)
                            );
                        });
                    });
                } else {
                    fs.mkdirSync(
                        path.resolve(dirName, "content", answers.idiomaPadrao),
                        {
                            recursive: true,
                        }
                    );
                    demoContent.forEach((file: string) => {
                        fs.copyFileSync(
                            path.resolve(
                                args.path,
                                "template",
                                "content",
                                file
                            ),
                            path.resolve(
                                dirName,
                                "content",
                                answers.idiomaPadrao,
                                file
                            )
                        );
                    });
                }

                let demoRefs: string[] = [];
                switch (answers.preset) {
                    case "abnt":
                        demoRefs = fs.readdirSync(
                            path.resolve(
                                args.path,
                                "template",
                                "references",
                                "abnt"
                            )
                        );
                        break;
                    case "apa":
                        demoRefs = fs.readdirSync(
                            path.resolve(
                                args.path,
                                "template",
                                "references",
                                "apa"
                            )
                        );
                        break;
                }
                if (demoRefs.length > 0) {
                    fs.mkdirSync(
                        path.resolve(dirName, "references", answers.preset),
                        {
                            recursive: true,
                        }
                    );

                    demoRefs.forEach((file: string) => {
                        fs.copyFileSync(
                            path.resolve(
                                args.path,
                                "template",
                                "references",
                                answers.preset,
                                file
                            ),
                            path.resolve(
                                dirName,
                                "references",
                                answers.preset,
                                file
                            )
                        );
                    });
                }

                console.log("Publicação criada com sucesso!");
                if (answers.instalarDependencias) {
                    console.log("Instalando dependências...");
                    const deps = ["tsx", "typescript"];
                    execSync(
                        `cd ${dirName} && yarn add -D ${deps.join(
                            " "
                        )} && yarn lerna link`,
                        {
                            stdio: "inherit",
                        }
                    );
                    console.log("Dependências instaladas com sucesso.");
                }
                console.log("Boa escrita!");
            } catch (error) {
                console.error(error);
            }
        }
    });
};

const createREADME = (name: string) => {
    return `# \`${name}\`\n`;
};

const createPubGenJson = (name: string, answers: any) => {
    return {
        nome: name,
        titulo: answers.titulo,
        tipo: answers.tipo,
        instituicaoAfiliada: answers.instituicaoAfiliada,
        instituicaoPublicacao: answers.instituicaoPublicacao,
        ano: answers.ano,
        palavrasChave: answers.palavrasChave
            .split(",")
            .map((x: string) => x.trim()),
        preset: answers.preset,
        multiIdioma: answers.multiIdioma,
        idioma: answers.idiomaPadrao,
        idiomas: answers.idiomas,
        dataCriacao: new Date().toISOString(),
    };
};

const createPackageJson = (name: string, answers: any, rootPath: any) => {
    const toGdocVersion = JSON.parse(
        fs.readFileSync(path.resolve(rootPath, "package.json")).toString()
    ).devDependencies["@elucidario/md-to-gdoc"];

    return {
        name,
        version: "0.1.0",
        main: "README.md",
        private: true,
        scripts: {
            authenticate:
                "tsx ./node_modules/@elucidario/md-to-gdoc/src/authenticate.ts",
            "create-doc":
                "tsx ./node_modules/@elucidario/md-to-gdoc/src/create-doc.ts",
            sync: "tsx ./node_modules/@elucidario/md-to-gdoc/src/sync.ts",
        },
        devDependencies: {
            "@elucidario/md-to-gdoc": `${toGdocVersion}`,
            tsx: "^3.12.6",
            typescript: "^5.0.3",
        },
        keywords: answers.palavrasChave.split(",").map((x: string) => x.trim()),
    };
};
