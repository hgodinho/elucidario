import inquirer from "inquirer";
import { merge } from "lodash-es";
import { kebabCase } from "lodash-es";

import { Console } from "@elucidario/pkg-console";

import {
    authorPrompt,
    datePrompt,
    referencePrompt,
    authorProperties,
    dateProperties,
} from "../prompt/referencePrompt.js";
import { getPaths } from "../getPaths.js";
import { searchTitle } from "./search.js";

import fs from "fs";
import path from "path";

const schemaDefault = {
    "@schema": "https://elucidario.art/pub-gen/schema/reference-schema.json",
    "@type": "Reference",
};

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

export const addReference = async (args, paths) => {
    inquirer.prompt(referencePrompt("create")).then(async (answers) => {
        const { type } = answers;
        const { publication } = args;
        try {
            console.log(`Adding new reference of type "${type}"`);
            await inquirer
                .prompt(referencePrompt(type))
                .then(async (answers) => {
                    // cria uma referencia vazia
                    let reference = {};

                    const title = answers[type].title;

                    // verifica se já existe uma referencia com o mesmo título
                    const found = await searchTitle(paths.references, title);
                    if (found && found.length > 0) {
                        const selected = await refAlreadyExists(title, found);
                        if (selected) {
                            console.log(selected, {
                                title: `Selected reference with title "${title}".`,
                                type: "info",
                                defaultLog: true,
                            });
                            reference = selected;
                        } else {
                            console.log(found, {
                                title: `Reference with title "${title}" already exists.`,
                                type: "error",
                                defaultLog: true,
                            });
                            throw new Error(
                                `Reference with title "${title}" already exists.`
                            );
                        }
                    }

                    // remove propriedades que deverão ser atualizadas e cria um novo objeto ref
                    let { _id, _slug, _create, _update, ...ref } = reference;

                    // verifica se o slug e o id já existem, se não existirem, cria um novo
                    if (!_slug) {
                        _slug = kebabCase(answers[type].title);
                    }
                    if (!_id) {
                        _id = Math.random().toString(36).substring(2, 9);
                    }

                    // remove propriedades que devem ser sobrescritas
                    if ("@schema" in ref && "@type" in ref) {
                        delete ref["@schema"];
                        delete ref["@type"];
                    }

                    // cria um novo objeto reference
                    reference = merge({}, schemaDefault, ref, {
                        _id,
                        _slug,
                        _create: !_create ? new Date().toISOString() : _create,
                        _update: new Date().toISOString(),
                        type,
                        // properties from answers
                        // parse answers and return a new object with only the non-empty values
                        ...Object.keys(answers[type]).reduce((acc, cur) => {
                            if (answers[type][cur].length) {
                                acc[cur] = answers[type][cur];
                            }
                            return acc;
                        }, {}),
                    });

                    // configura a referencia
                    try {
                        // configura os autores
                        try {
                            console.log("Select author type:");
                            await inquirer
                                .prompt(authorPrompt("type"))
                                .then(async (answers) => {
                                    const { type } = answers;

                                    // configura os nomes dos autores
                                    try {
                                        const authors = await author(type).then(
                                            (authorNames) => {
                                                // parse authorNames and return a new object with only the non-empty values
                                                return Object.keys(
                                                    authorNames
                                                ).reduce((acc, cur) => {
                                                    if (
                                                        authorNames[cur].length
                                                    ) {
                                                        acc[cur] =
                                                            authorNames[cur];
                                                    }
                                                    return acc;
                                                }, {});
                                            }
                                        );

                                        reference = {
                                            ...reference,
                                            ...authors,
                                        };
                                    } catch (error) {
                                        console.log(error, {
                                            type: "error",
                                            defaultLog: true,
                                        });
                                        throw new Error(error);
                                    }
                                });
                        } catch (error) {
                            console.log(error, {
                                type: "error",
                                defaultLog: true,
                            });
                            throw new Error(error);
                        }

                        // configura as datas
                        try {
                            console.log("Select date type:");
                            await inquirer
                                .prompt(datePrompt("type"))
                                .then(async (answers) => {
                                    const { type } = answers;

                                    // configura os tipos de datas
                                    try {
                                        const dates = await date(type).then(
                                            (dateNames) => {
                                                // parse authorNames and return a new object with only the non-empty values
                                                return Object.keys(
                                                    dateNames
                                                ).reduce((acc, cur) => {
                                                    if (
                                                        Object.keys(
                                                            dateNames[cur]
                                                        ).length
                                                    ) {
                                                        acc[cur] =
                                                            dateNames[cur];
                                                    }
                                                    return acc;
                                                }, {});
                                            }
                                        );

                                        reference = { ...reference, ...dates };
                                    } catch (error) {
                                        console.log(error, {
                                            type: "error",
                                            defaultLog: true,
                                        });
                                        throw new Error(error);
                                    }
                                });
                        } catch (error) {
                            console.log(error, {
                                type: "error",
                                defaultLog: true,
                            });
                            throw new Error(error);
                        }

                        // configura as propriedades comuns
                        try {
                            console.log("Selecione as propriedades comuns:");
                            await inquirer
                                .prompt(referencePrompt("common"))
                                .then(async (answers) => {
                                    const cleanAnswers = Object.keys(
                                        answers
                                    ).reduce((acc, cur) => {
                                        if (answers[cur].length) {
                                            acc[cur] = answers[cur];
                                        }
                                        return acc;
                                    }, {});

                                    reference = {
                                        ...reference,
                                        ...cleanAnswers,
                                    };
                                });
                        } catch (error) {
                            console.log(error, {
                                type: "error",
                                defaultLog: true,
                            });
                            throw new Error(error);
                        }

                        // configura as propriedades de arquivo
                        try {
                            console.log(
                                "Selecione as propriedades de arquivo:"
                            );
                            await inquirer
                                .prompt(referencePrompt("archive"))
                                .then(async (answers) => {
                                    const cleanAnswers = Object.keys(
                                        answers
                                    ).reduce((acc, cur) => {
                                        if (answers[cur].length) {
                                            acc[cur] = answers[cur];
                                        }
                                        return acc;
                                    }, {});

                                    reference = {
                                        ...reference,
                                        ...cleanAnswers,
                                    };
                                });
                        } catch (error) {
                            console.log(error, {
                                type: "error",
                                defaultLog: true,
                            });
                            throw new Error(error);
                        }
                    } catch (error) {
                        console.log(error, { type: "error", defaultLog: true });
                        throw new Error(error);
                    }

                    // escreve o arquivo da referencia
                    try {
                        if (!fs.existsSync(paths.references)) {
                            fs.mkdirSync(paths.references);
                        }
                        const filename = `${_id}_${_slug}.json`;
                        const referencePath = path.resolve(
                            paths.references,
                            filename
                        );
                        fs.writeFileSync(
                            referencePath,
                            JSON.stringify(reference, null, 4)
                        );
                        insertIndex(
                            paths.references,
                            _id,
                            _slug,
                            `references/${filename}`
                        );
                        console.log(
                            { referencePath, reference },
                            {
                                type: "success",
                                defaultLog: true,
                                title: `Referência "${reference.title}" criada com sucesso!`,
                            }
                        );
                    } catch (error) {
                        console.log(error, { type: "error", defaultLog: true });
                        throw new Error(error);
                    }
                });
        } catch (error) {
            throw new Error(error);
        }
    });
};

const refAlreadyExists = async (title, refs) => {
    let selected = false;
    await inquirer
        .prompt([
            {
                type: "confirm",
                name: "reuse",
                message: `Foram encontradas ${refs.length} referências com o título "${title}". Deseja reutilizar alguma delas?`,
                default: true,
            },
            {
                type: "list",
                name: "refs",
                message: "Selecione a referência que deseja reutilizar:",
                choices: refs.map(
                    (ref) => `${ref._id}: ${ref.title} (${ref.type})`
                ),
                when: (answers) => answers.reuse,
            },
        ])
        .then((answers) => {
            if (answers.reuse) {
                const refId = answers.refs.split(":")[0];
                const ref = refs.find((ref) => ref._id === refId);
                selected = ref;
            }
        });
    return selected;
};

// cria um objeto em que cada propriedade é um item do array authorProperties
const authorNames = authorProperties.reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
}, {});

export const author = async (type, options) => {
    console.log(`Adicionando novo autor do tipo ${type}`);
    await inquirer
        .prompt(
            authorPrompt("names", {
                defaults: options?.defaults,
                name: type,
            })
        )
        .then(async (answers) => {
            const { addMore, ...definedAuthor } = answers;
            const cleanAuthor = Object.keys(definedAuthor[type]).reduce(
                (acc, cur) => {
                    if (definedAuthor[type][cur]) {
                        acc[cur] = definedAuthor[type][cur];
                    }
                    return acc;
                },
                {}
            );
            authorNames[type].push(cleanAuthor);
            if (addMore) {
                await inquirer
                    .prompt(
                        authorPrompt("type", {
                            defaults: options?.defaults,
                        })
                    )
                    .then(async (answers) => {
                        const { type } = answers;
                        await author(type, { defaults: options?.defaults });
                    });
            }
        });

    return authorNames;
};

// cria um objeto em que cada propriedade é um item do array dateProperties
const dateNames = dateProperties.reduce((acc, cur) => {
    acc[cur] = {};
    return acc;
}, {});

export const date = async (type, options) => {
    console.log(`Adicionando nova data do tipo ${type}`);
    await inquirer
        .prompt(
            datePrompt("date", {
                defaults: options?.defaults,
                name: type,
            })
        )
        .then(async (answers) => {
            const { addMore, ...definedDate } = answers;

            const cleanDate = Object.keys(definedDate[type]).reduce(
                (acc, cur) => {
                    if (definedDate[type][cur]) {
                        acc[cur] = definedDate[type][cur];
                    }
                    return acc;
                },
                {}
            );
            dateNames[type] = cleanDate;
            if (addMore) {
                await inquirer
                    .prompt(
                        datePrompt("type", {
                            defaults: options?.defaults,
                            name: type,
                        })
                    )
                    .then(async (answers) => {
                        const { type } = answers;
                        await date(type, {
                            defaults: options?.defaults,
                            name: type,
                        });
                    });
            }
        });

    return dateNames;
};

export const insertIndex = async (indexPath, id, slug, destPath) => {
    const index = {
        id,
        slug,
        path: destPath,
    };

    if (!fs.existsSync(path.resolve(indexPath, "index.json"))) {
        const indexFile = {
            items: [index],
        };
        fs.writeFileSync(
            path.resolve(indexPath, "index.json"),
            JSON.stringify(indexFile, null, 4)
        );
    } else {
        const indexFile = JSON.parse(
            fs.readFileSync(path.resolve(indexPath, "index.json"), "utf-8")
        );
        indexFile.items.push(index);
        fs.writeFileSync(
            path.resolve(indexPath, "index.json"),
            JSON.stringify(indexFile, null, 4)
        );
    }
};
