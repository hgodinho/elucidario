import inquirer from "inquirer";
import { merge } from "lodash-es";
import { kebabCase } from "lodash-es";

import { Console } from "@elucidario/pkg-console";

import { searchId } from "./search.js";
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
    "@schema": "https://elucidario.art/pub-gen/schemas/reference-schema.json",
    "@type": "Reference",
};

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

export const addReference = async (args, paths) => {
    inquirer.prompt(referencePrompt("create")).then(async (answers) => {
        const { type, year } = answers;
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
                        console.log(found, {
                            title: `Found existent reference with title "${title}".`,
                            type: "info",
                            defaultLog: true,
                        });

                        const selected = await refAlreadyExists(title, found);

                        if (selected) {
                            reference = selected;
                        } else {
                            console.log(
                                `None reference selected. Creating new reference with title "${title}".`
                            );
                        }
                    }

                    // isola propriedades que deverão ser atualizadas e isola o restante em um novo objeto "ref"
                    let { id, _slug, _create, _update, ...ref } = reference;

                    // verifica se o slug e o id já existem, se não existirem, cria um novo
                    if (!_slug) {
                        _slug = kebabCase(answers[type].title);
                    }

                    // remove propriedades que devem ser sobrescritas
                    if ("@schema" in ref && "@type" in ref) {
                        delete ref["@schema"];
                        delete ref["@type"];
                    }

                    // cria um novo objeto reference
                    reference = merge({}, schemaDefault, ref, {
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
                        const { newId, authors } = await contributorsProps(
                            year
                        );
                        id = newId;

                        // configura as datas
                        const dates = await dateProps();

                        // configura as propriedades comuns
                        const common = await commonProps();

                        // configura as propriedades de arquivo
                        const archive = await archiveProps();

                        reference = {
                            id,
                            ...reference,
                            ...authors,
                            ...dates,
                            ...common,
                            ...archive,
                        };
                    } catch (error) {
                        throw new Error(error);
                    }

                    // salva o arquivo da referencia
                    try {
                        if (!fs.existsSync(paths.references)) {
                            fs.mkdirSync(paths.references);
                        }
                        const filename = `${id}_${_slug}.json`;
                        const referencePath = path.resolve(
                            paths.references,
                            filename
                        );
                        fs.writeFileSync(
                            referencePath,
                            JSON.stringify(reference, null, 4)
                        );
                        insertIndex(paths.references, id, _slug, filename);
                        if (publication) {
                            insertIndex(
                                path.resolve(
                                    paths.publications,
                                    publication,
                                    "references"
                                ),
                                id,
                                _slug,
                                filename
                            );
                        }
                        console.log(
                            { referencePath, reference },
                            {
                                type: "success",
                                defaultLog: true,
                                title: `Referência "${reference.title}" criada com sucesso!`,
                            }
                        );
                    } catch (error) {
                        throw new Error(error);
                    }
                });
        } catch (error) {
            console.log(error, {
                type: "error",
                defaultLog: true,
                title: "Erro ao criar referência",
            });
        }
    });
};

/**
 * Verifica se a referência já existe no registro de referências
 * @param {string} title Titulo da referencia
 * @param {array} refs Array de referencias encontradas
 * @returns {object} Referencia selecionada
 */
const refAlreadyExists = async (title, refs) => {
    let selected = false;
    await inquirer
        .prompt([
            {
                type: "confirm",
                name: "reuse",
                message: `Found ${refs.length} reference(s) with title "${title}". Do you want to reuse one of them?`,
                default: true,
            },
            {
                type: "list",
                name: "refs",
                message: "Select a reference to reuse:",
                choices: [
                    ...refs.map(
                        (ref) => `${ref.id}: ${ref.title} (${ref.type})`
                    ),
                    "None",
                ],
                when: (answers) => answers.reuse,
            },
        ])
        .then((answers) => {
            if (answers.reuse) {
                if (answers.refs === "None") return;

                const refId = answers.refs.split(":")[0];
                const ref = refs.find((ref) => ref.id === refId);
                selected = ref;
            }
        });
    return selected;
};

/**
 * Configura as propriedades de autores
 * @param {string|integer} year Ano da publicação
 * @returns {object} Objeto com as propriedades de autores
 */
const contributorsProps = async (year) => {
    console.log("Select author type:");
    return await inquirer.prompt(authorPrompt("type")).then(async (answers) => {
        const { type } = answers;

        // configura os nomes dos autores
        try {
            const authors = await authorQuery(type).then((authorNames) => {
                // parse authorNames and return a new object with only the non-empty values
                return Object.keys(authorNames).reduce((acc, cur) => {
                    if (authorNames[cur].length) {
                        acc[cur] = authorNames[cur];
                    }
                    return acc;
                }, {});
            });

            // create a list of choices for inquirer based on the authors
            let choices = [];
            Object.keys(authors).map((contributor) => {
                authors[contributor].map((author) => {
                    choices.push({
                        name: `${author.family} (${author.given})`,
                        value: author.family,
                    });
                });
            });

            let chosenOne = "";
            if (choices.length > 1) {
                chosenOne = await inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "chosenOne",
                            message: "Select the author to use for id:",
                            choices,
                        },
                    ])
                    .then((answers) => answers.chosenOne);
            } else {
                chosenOne = choices[0].value;
            }

            let newId = `${kebabCase(chosenOne)}${year}`;

            await searchId(paths.references, newId).then((found) => {
                if (found.length > 0) {
                    // loop through the found, split the id by ".", get the last element, then find the highest number and add 1
                    const idNumber = Math.max(
                        ...found.map((f) => {
                            if (f.id.includes(".")) {
                                return parseInt(f.id.split(".").pop());
                            } else {
                                return 0;
                            }
                        })
                    );
                    newId = `${newId}.${idNumber + 1}`;
                }
            });

            return { authors, newId };
        } catch (error) {
            console.log(error, {
                type: "error",
                defaultLog: true,
                title: "Erro ao configurar autores",
            });
            throw new Error(error);
        }
    });
};

// cria um objeto em que cada propriedade é um item do array authorProperties
const authorNames = authorProperties.reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
}, {});

/**
 * Query para adicionar autores
 * @param {string} type Tipo de autor
 * @param {object} options Opções para a query
 * @returns {object} Objeto com os nomes dos autores
 */
const authorQuery = async (type, options) => {
    console.log(`Adding new author of type ${type}`);
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
                        await authorQuery(type, {
                            defaults: options?.defaults,
                        });
                    });
            }
        });

    return authorNames;
};

/**
 * Configura as propriedades de datas
 * @returns {object} Objeto com as propriedades de datas
 */
const dateProps = async () => {
    console.log("Select date type:");
    return await inquirer.prompt(datePrompt("type")).then(async (answers) => {
        const { type } = answers;

        // configura os tipos de datas
        try {
            return await dateQuery(type).then((dateNames) => {
                // parse authorNames and return a new object with only the non-empty values
                return Object.keys(dateNames).reduce((acc, cur) => {
                    if (Object.keys(dateNames[cur]).length) {
                        acc[cur] = dateNames[cur];
                    }
                    return acc;
                }, {});
            });
        } catch (error) {
            console.log(error, {
                type: "error",
                defaultLog: true,
            });
            throw new Error(error);
        }
    });
};

// cria um objeto em que cada propriedade é um item do array dateProperties
const dateNames = dateProperties.reduce((acc, cur) => {
    acc[cur] = {};
    return acc;
}, {});

/**
 * Query para adicionar datas
 * @param {string} type Tipo de data
 * @param {object} options Opções para a query
 * @returns {object} Objeto com os nomes das datas
 */
const dateQuery = async (type, options) => {
    console.log(`Adding new date of type ${type}`);
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
                        await dateQuery(type, {
                            defaults: options?.defaults,
                            name: type,
                        });
                    });
            }
        });

    return dateNames;
};

/**
 * Configura as propriedades comuns das referências
 * @returns {object} Objeto com as propriedades comuns das referências
 */
const commonProps = async () => {
    return await inquirer
        .prompt(referencePrompt("common"))
        .then(async (answers) => {
            return Object.keys(answers).reduce((acc, cur) => {
                if (answers[cur].length) {
                    acc[cur] = answers[cur];
                }
                return acc;
            }, {});
        });
};

/**
 * Configura as propriedades de arquivo das referências
 * @returns {object} Objeto com as propriedades de arquivo das referências
 */
const archiveProps = async () => {
    return await inquirer
        .prompt(referencePrompt("archive"))
        .then(async (answers) => {
            return Object.keys(answers).reduce((acc, cur) => {
                if (answers[cur].length) {
                    acc[cur] = answers[cur];
                }
                return acc;
            }, {});
        });
};

/**
 * Adiciona referência no index.json
 * @param {string} indexPath Caminho para o index.json de referências
 * @param {string} id ID da referência
 * @param {string} slug Slug da referência
 * @param {string} filename Nome do arquivo da referência
 */
export const insertIndex = async (indexPath, id, slug, filename) => {
    const index = {
        id,
        slug,
        path: `<references>/${filename}`,
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
