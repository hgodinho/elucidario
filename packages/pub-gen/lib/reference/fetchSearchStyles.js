import path from "path";
import fs from "fs";
import { Octokit } from "octokit";

import { Console } from "@elucidario/pkg-console";

import { getPaths } from "../getPaths.js";
const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);
const token = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, ".gh-token"))
).token;

export const fetchSearchStyles = async (styles) => {
    console.log(styles, {
        defaultLog: true,
        type: "info",
        title: "Searching Styles...",
    });

    const octokit = new Octokit({ auth: token });

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
