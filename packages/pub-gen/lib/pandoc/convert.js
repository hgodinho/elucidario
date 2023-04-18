import { exec } from "child_process";
import path from "path";
import lodash from "lodash";
import fs from "fs";
import { readContent } from "../readContent.js";
const { kebabCase } = lodash;

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

    const pandocs = documents.map((doc) => {
        let { preset, language } = doc;
        preset = kebabCase(preset);
        language = kebabCase(language);

        const files = readContent(
            path.resolve(pubPath, "dist", language),
            ["md"],
            true
        );
        console.log("files", files);

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
