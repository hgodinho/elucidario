import { exec } from "child_process";
import path from "path";
import lodash from "lodash-es";
import fs from "fs";
import { readContents } from "@elucidario/pkg-paths";
const { kebabCase } = lodash;

import { getPaths } from "../getPaths.js";

import { Console } from "@elucidario/pkg-console";

const paths = getPaths();

export const convert = async (args) => {
    const { publication, output, title } = args;
    let { ext } = args;

    try {
        if (!publication) {
            throw new Error(
                "Publication not specified, pass --publication or -p argument"
            );
        }
        const packageJson = JSON.parse(
            fs.readFileSync(
                path.resolve(paths.publications, publication, "package.json")
            )
        );

        const console = new Console(packageJson);

        console.log(
            { args },
            {
                defaultLog: true,
                title: "Running pandoc",
            }
        );

        const pubPath = path.resolve(paths.publications, publication);

        const pubGenJson = JSON.parse(
            fs.readFileSync(path.resolve(pubPath, "pub-gen.json"))
        );

        const pandocs = pubGenJson.publications.map((publication) => {
            const name = kebabCase(publication.title);

            let files = [];
            try {
                files = readContents({
                    dirPath: path.resolve(
                        pubPath,
                        "dist",
                        publication.language
                    ),
                    returnType: "path",
                    extensions: "md",
                    names: true,
                });
            } catch (error) {
                console.log({ error }, { type: "error", defaultLog: true });
                return error;
            }

            const docTitle = title
                ? kebabCase(title)
                : `${publication.language}-${name}`;

            ext = ext ?? "docx";

            const outputDir =
                output ??
                path.resolve(
                    pubPath,
                    "files",
                    "generated",
                    packageJson.version
                );

            if (!fs.existsSync(outputDir))
                fs.mkdirSync(outputDir, { recursive: true });

            const outputFile = path.resolve(outputDir, `${docTitle}.${ext}`);

            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

            const pandocArgs = [
                "--from=markdown+grid_tables+rebase_relative_paths",
                `--to=${ext}`,
                `-F mermaid-filter.cmd`,
                `--output=${outputFile}`,
                `--reference-doc="${path.resolve(
                    paths.pubGen,
                    "template",
                    "docx",
                    "abnt.docx"
                )}"`,
                ...Object.values(files).map((file) => file),
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
                    console.log(data, {
                        defaultLog: true,
                    });
                });
                pandoc.stderr.on("data", (data) => {
                    console.log(data, {
                        defaultLog: true,
                        type: "error",
                        title: "Error",
                    });
                });
                pandoc.on("close", (code) => {
                    let type = "success";
                    if (code !== 0) type = "error";
                    console.log(`child process exited with code ${code}`, {
                        type,
                    });
                });
            });
        });
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
    }
};
