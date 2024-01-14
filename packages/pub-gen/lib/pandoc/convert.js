import { exec } from "child_process";
import path from "path";
import lodash from "lodash-es";
import fs from "fs";
import { createDir } from "@elucidario/pkg-paths";
const { kebabCase } = lodash;
import { filesFromManifest, packageJson, pubGenConfig } from "../utils.js";

import { getPaths } from "../getPaths.js";

import { Console } from "@elucidario/pkg-console";

const paths = getPaths();

export const convert = async (args) => {
    const { publication, output, title } = args;
    let { ext } = args;

    try {
        if (!publication) {
            throw new Error(
                "Publication not specified, pass --publication or -p argument",
            );
        }
        const pkg = packageJson(publication);

        const console = new Console(pkg);

        console.log(
            { args },
            {
                defaultLog: true,
                title: "Running pandoc",
            },
        );

        const pubPath = path.resolve(paths.publications, publication);

        const pubGenJson = pubGenConfig(publication);

        const pandocs = pubGenJson.documents.map(({ language, title }) => {
            const name = kebabCase(title);

            let files = [];
            try {
                files = filesFromManifest(publication, language);
            } catch (error) {
                console.log({ error }, { type: "error", defaultLog: true });
                return error;
            }

            const docTitle = title
                ? kebabCase(title)
                : `${pkg.version}-${language}-${name}`;

            ext = ext ?? "docx";

            const outputDir =
                output ??
                path.resolve(
                    pubPath,
                    "files",
                    "generated",
                    pkg.version,
                    language,
                );

            createDir(outputDir);
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
                    "abnt.docx",
                )}"`,
                ...files.map((file) => file.path).filter((file) => file !== ""),
            ];

            console.log({
                outputFile,
                pandocArgs,
            });

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
                    console.log(new Error(data), {
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
        console.log(error, { defaultLog: true, type: "error" });
    }
};
