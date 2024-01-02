import path from "path";
import fs from "fs";
import { Octokit } from "octokit";

import { Console } from "@elucidario/pkg-console";

import { getPaths, readFile } from "@elucidario/pkg-paths";

const packageJson = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json"),
).content;

const console = new Console(packageJson);

const token = readFile({
    filePath: path.resolve(getPaths().packages, "pub-gen", ".gh-token"),
    ext: "json",
}).content;

export const fetchSearchStyles = async (styles) => {
    console.warning(`Searching for '${styles.join(", ")}' styles...`);

    const octokit = new Octokit({ auth: token.token });

    try {
        return octokit.rest.search
            .code({
                q: `repo:citation-style-language/styles ${styles.join(",")}`,
            })
            .then(async (response) => {
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
    }
};
