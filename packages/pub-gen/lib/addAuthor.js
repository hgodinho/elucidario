import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

import { pubGenPrompt } from "./prompt/pubGenPrompt.js";

const authors = [];

const __dirname = path.resolve();

export const addAuthor = async (args) => {
    const rootPath = path.resolve(__dirname, "..", "..");

    inquirer.prompt(pubGenPrompt("addAuthor", args)).then(async (answers) => {
        const publication = args.publication;

        authors.push(answers.authors);

        if (answers.addAuthor) {
            console.log(
                chalk.green(`${answers.authors.name} adicionado com sucesso`)
            );
            addAuthor(args);
        } else {
            const pubPath = path.resolve(rootPath, "publications");
            const dirName = path.resolve(pubPath, publication);
            const pubGenJson = JSON.parse(
                fs.readFileSync(path.resolve(dirName, "pub-gen.json"))
            );
            pubGenJson.authors = [...pubGenJson.authors, ...authors];

            fs.writeFileSync(
                path.resolve(dirName, "pub-gen.json"),
                JSON.stringify(pubGenJson, null, 4)
            );
            const authorsNames = authors
                .map((author) => author.name)
                .join(", ");

            console.log(
                chalk.green(`Autores adicionados com sucesso: ${authorsNames}`)
            );
        }
    });
};
