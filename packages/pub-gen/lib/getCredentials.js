import path from "path";
import fs from "fs";
import chalk from "chalk";

const __dirname = path.resolve();

export const getCredentials = (publication = undefined) => {
    let rootPath = path.resolve(__dirname, "..", "..");
    if (publication) {
        rootPath = path.resolve(
            rootPath,
            "publications",
            publication
        );
    }
    try {
        console.log(chalk.cyan(`Trying to read credentials.json from ${rootPath}`));
        const credentials = JSON.parse(
            fs.readFileSync(
                path.resolve(rootPath, "credentials.json")
            )
        );
        console.log(chalk.green("Credentials found!"));
        return credentials.installed;
    } catch (error) {
        console.error(chalk.red("Credentials not found"));
        return error;
    }
} 