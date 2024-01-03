import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { Console } from "@elucidario/pkg-console";
import { readFile, getPaths, fileExists } from "@elucidario/pkg-paths";

const pkg = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json"),
).value;
const console = new Console(pkg);

export const init = async (options) => {
    const configPath = path.resolve(process.cwd(), "pub-gen-config.json");

    if (options.force) {
        buildInit(configPath);
        return;
    }

    if (options.default) {
        buildInit(configPath, true);
        return;
    }

    if (fileExists(configPath)) {
        console.log("Config file exists.");
        inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "overwrite",
                    message: "Overwrite existing config file?",
                },
            ])
            .then((answers) => {
                if (answers.overwrite) {
                    buildInit(configPath);
                }
            });
    } else {
        buildInit(configPath);
    }
};

export const buildInit = async (configPath, def) => {
    if (def) {
        fs.writeFileSync(
            configPath,
            JSON.stringify(
                {
                    root: ".",
                    references: "references",
                    publications: "publications",
                },
                null,
                4,
            ),
        );
        console.log(`Config file created at ${path}`);
        return;
    }
    inquirer
        .prompt([
            {
                type: "input",
                name: "root",
                message: "What is the path to the root folder?",
                default: ".",
            },
            {
                type: "input",
                name: "references",
                message: "What is the path to the references folder?",
                default: "references",
            },
            {
                type: "input",
                name: "publications",
                message: "What is the path to the publications folder?",
                default: "publications",
            },
        ])
        .then((answers) => {
            fs.writeFileSync(path, JSON.stringify(answers, null, 4));
            console.log(`Config file created at ${path}`);
        });
};
