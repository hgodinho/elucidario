import { createDoc } from "@elucidario/md-to-gdoc";
import path from "path";
import fs from "fs";
import chalk from "chalk";

const __dirname = path.resolve();

export const syncPublication = (args) => {
    console.log("sync", { args });

    try {
        const { publication } = args;

        if (!publication) throw new Error("publication name is required");

        const rootPath = path.resolve(__dirname, "..", "..");
        const publicationsDirPath = path.resolve(
            rootPath,
            "publications",
            publication
        );
        const pubGen = JSON.parse(
            fs.readFileSync(
                path.resolve(publicationsDirPath, "pub-gen.json")
            )
        );

        let credentials = {};
        try {
            try {
                console.log(chalk.cyan(`Trying to read credentials.json from ${rootPath}`));
                credentials = JSON.parse(
                    fs.readFileSync(
                        path.resolve(rootPath, "credentials.json")
                    )
                );
                console.log(chalk.green("Credentials found"));
            } catch (error) {
                console.log(chalk.blue(`Trying to read credentials.json from ${publicationsDirPath}`));
                credentials = JSON.parse(
                    fs.readFileSync(
                        path.resolve(publicationsDirPath, "credentials.json")
                    )
                );
            }
        } catch (error) {
            return console.error(chalk.red("Credentials not found"));
        }

        console.log("rootPath", {
            rootPath,
            publication,
            publicationsDirPath,
            pubGen,
            credentials,
        });

        try {
            // createDoc(pubGen.title, credentials.installed, rootPath);
        } catch (error) {
            console.error(chalk.error("Error creating doc"));
        }

    } catch (error) {
        console.error(error);
    }

    // const doc = createDoc();
    // return doc;
};
