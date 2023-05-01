import {
    authorPrompt,
    datePrompt,
    referencePrompt,
    authorProperties,
    dateProperties,
} from "./prompt/referencePrompt.js";
import inquirer from "inquirer";

import { Console } from "@elucidario/pkg-console";
import packageJson from "../package.json" assert { type: "json" };
import { kebabCase } from "lodash-es";

const console = new Console(packageJson);

export const addReference = async (defaults) => {
    try {
        console.log("Selecione o tipo de referencia:");
        inquirer
            .prompt(referencePrompt("create", defaults))
            .then(async (answers) => {
                await addReferenceByType(answers.type, defaults);
            });
    } catch (error) {
        console.error(error);
    }
};

export const addReferenceByType = async (type, defaults) => {
    try {
        console.log(`Adicionando nova referencia do tipo ${type}`);
        await inquirer
            .prompt(referencePrompt(type, defaults))
            .then(async (answers) => {
                // parse answers and return a new object with only the non-empty values
                let reference = Object.keys(answers[type]).reduce(
                    (acc, cur) => {
                        if (answers[type][cur].length) {
                            acc[cur] = answers[type][cur];
                        }
                        return acc;
                    },
                    {}
                );
                reference["type"] = type;
                reference["_slug"] = kebabCase(reference.title);

                // configura a referencia
                try {
                    // configura os autores
                    try {
                        console.log("Selecione o tipo de autor:");
                        await inquirer
                            .prompt(authorPrompt("type", { defaults }))
                            .then(async (answers) => {
                                const { type } = answers;

                                // configura os nomes dos autores
                                try {
                                    const authors = await author(
                                        type,
                                        defaults
                                    ).then((authorNames) => {
                                        // parse authorNames and return a new object with only the non-empty values
                                        return Object.keys(authorNames).reduce(
                                            (acc, cur) => {
                                                if (authorNames[cur].length) {
                                                    acc[cur] = authorNames[cur];
                                                }
                                                return acc;
                                            },
                                            {}
                                        );
                                    });

                                    reference = { ...reference, ...authors };
                                } catch (error) {
                                    console.error(error);
                                    throw new Error(error);
                                }
                            });
                    } catch (error) {
                        console.error(error);
                        throw new Error(error);
                    }

                    // configura as datas
                    try {
                        console.log("Selecione o tipo de data:");
                        await inquirer
                            .prompt(datePrompt("type", { defaults }))
                            .then(async (answers) => {
                                const { type } = answers;

                                // configura os tipos de datas
                                try {
                                    const dates = await date(
                                        type,
                                        defaults
                                    ).then((dateNames) => {
                                        // parse authorNames and return a new object with only the non-empty values
                                        return Object.keys(dateNames).reduce(
                                            (acc, cur) => {
                                                if (
                                                    Object.keys(dateNames[cur])
                                                        .length
                                                ) {
                                                    acc[cur] = dateNames[cur];
                                                }
                                                return acc;
                                            },
                                            {}
                                        );
                                    });

                                    reference = { ...reference, ...dates };
                                } catch (error) {
                                    console.error(error);
                                    throw new Error(error);
                                }
                            });
                    } catch (error) {
                        console.error(error);
                        throw new Error(error);
                    }

                    // configura as propriedades comuns
                    try {
                        console.log("Selecione as propriedades comuns:");
                        await inquirer
                            .prompt(
                                referencePrompt("common", {
                                    defaults,
                                })
                            )
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
                        console.error(error);
                        throw new Error(error);
                    }

                    // configura as propriedades de arquivo
                    try {
                        console.log("Selecione as propriedades de arquivo:");
                        await inquirer
                            .prompt(
                                referencePrompt("archive", {
                                    defaults,
                                })
                            )
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
                        console.error(error);
                        throw new Error(error);
                    }
                } catch (error) {
                    console.error(error);
                    throw new Error(error);
                }

                console.log({ reference }, true);
            });
    } catch (error) {
        throw new Error(error);
    }
};

// cria um objeto em que cada propriedade é um item do array authorProperties
const authorNames = authorProperties.reduce((acc, cur) => {
    acc[cur] = [];
    return acc;
}, {});

export const author = async (type, { defaults }) => {
    console.log(`Adicionando novo autor do tipo ${type}`);
    await inquirer
        .prompt(
            authorPrompt("names", {
                defaults,
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
                            defaults,
                        })
                    )
                    .then(async (answers) => {
                        const { type } = answers;
                        await author(type, { defaults });
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
export const date = async (type, { defaults }) => {
    console.log(`Adicionando nova data do tipo ${type}`);
    await inquirer
        .prompt(
            datePrompt("date", {
                defaults,
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
                            defaults,
                            name: type,
                        })
                    )
                    .then(async (answers) => {
                        const { type } = answers;
                        await date(type, { defaults, name: type });
                    });
            }
        });

    return dateNames;
};
