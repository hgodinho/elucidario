import { exec } from "child_process";
import path from "path";
import lodash from "lodash-es";
import fs from "fs";
import { readContents } from "@elucidario/pkg-schema-doc";
const { kebabCase } = lodash;
import chalk from "chalk";

const __dirname = path.resolve();

export const convert = async (args) => {
    console.log("Running pandoc...", { args });
    const { publication, output, title } = args;
    let { ext } = args;
    if (!publication) {
        throw new Error(
            "Publication not specified, pass --publication or -p argument"
        );
    }
    const rootPath = path.resolve(__dirname, "..", "..");
    const pubPath = path.resolve(rootPath, "publications", publication);
    const pubGenJson = JSON.parse(
        fs.readFileSync(path.resolve(pubPath, "pub-gen.json"))
    );

    const { documents } = pubGenJson;
    console.log(documents);
    const pandocs = documents.map((doc) => {
        let { preset, language } = doc;
        preset = kebabCase(preset);
        language = kebabCase(language);

        let files = [];
        try {
            files = readContents(
                path.resolve(pubPath, "dist", language),
                ["md"],
                true
            );
            console.log("files", files);
        } catch (error) {
            console.error(
                chalk.red(
                    '[pub-gen] No files found at dist folder! Try running "pub-gen build" first.'
                )
            );
            return error;
        }

        const docTitle =
            title ?? `${language}-${preset}-${kebabCase(doc.title)}`;
        ext = ext ?? "docx";
        const outputFile =
            output ?? path.resolve(pubPath, "files", `${docTitle}.${ext}`);

        const pandocArgs = [
            "--from=markdown+grid_tables",
            `--to=${ext}`,
            `--output=${outputFile}`,
            ...files,
        ];

        const isPandocInstalled = exec("pandoc --version");

        isPandocInstalled.on("close", (code) => {
            let pandoc;
            if (code !== 0) {
                const dockerArgs = [
                    "--rm",
                    `--volume "pwd:/data"`,
                    `--user $(id -u):$(id -g)`,
                    "pandoc/core:3.1.1.0",
                    ...pandocArgs,
                ];
                pandoc = exec(`docker run ${dockerArgs.join(" ")}`);
            } else {
                pandoc = exec(`pandoc ${pandocArgs.join(" ")}`);
            }
            pandoc.stdout.on("data", (data) => {
                console.log(data);
            });
            pandoc.stderr.on("data", (data) => {
                console.error(data);
            });
            pandoc.on("close", (code) => {
                console.log(`child process exited with code ${code}`);
            });
        });
    });
};
