import path from "path";
import fs from "fs";
import chalk from "chalk";

import { getPaths } from "@elucidario/pkg-paths";

const paths = getPaths();

export const getCredentials = (publication = undefined) => {
    let rootPath = paths.root;

    if (publication) {
        rootPath = path.resolve(rootPath, "publications", publication);
    }
    try {
        console.log(
            chalk.cyan(`Trying to read credentials.json from ${rootPath}`)
        );
        const credentials = JSON.parse(
            fs.readFileSync(path.resolve(rootPath, "credentials.json"))
        );
        console.log(chalk.green("Credentials found!"));
        return credentials.installed;
    } catch (error) {
        console.error(chalk.red("Credentials not found"));
        return error;
    }
};
