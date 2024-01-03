import path from "path";
import { getPaths, createFile } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";

import { pubGenPrompt } from "./prompt/pubGenPrompt.js";
import {
    makeInquirer,
    pubGenConfig,
    packageJson,
    cleanFalsy,
} from "./utils.js";

let authors = [];

export const addAuthor = async (args) => {
    const { publication } = args;
    const pkg = packageJson(publication);
    const console = new Console(pkg);

    await makeInquirer({
        title: "Adicionando autor...",
        publication,
        prompt: pubGenPrompt("addAuthor", args),
        callback: async (answers) => {
            const { contributor, addMoreAuthor } = cleanFalsy(answers);

            authors.push(contributor);

            if (addMoreAuthor) {
                console.success({
                    message: `Autor ${contributor.title} adicionado com sucesso! Adicione mais autores:`,
                });
                addAuthor(args);
            } else {
                const pubGenJson = pubGenConfig(publication);

                pubGenJson.contributors = [
                    ...pubGenJson.contributors,
                    ...authors,
                ];

                createFile(
                    {
                        filePath: path.resolve(
                            getPaths().publications,
                            publication,
                            "pub-gen.json"
                        ),
                        ext: "json",
                    },
                    pubGenJson
                );

                const authorsNames = authors
                    .map((author) => author.title)
                    .join(", ");

                console.success({
                    message: `Autores adicionados com sucesso: ${authorsNames}`,
                });

                authors = [];
            }
        },
    });
};
