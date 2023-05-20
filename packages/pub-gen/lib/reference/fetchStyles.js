import path from "path";
import fs from "fs";
import { Octokit } from "octokit";
import axios from "axios";

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

export const fetchStyles = async (styles) => {
    console.log(styles, {
        defaultLog: true,
        type: "info",
        title: "Fetching Styles...",
    });

    const cslStyles = styles.filter((style) => {
        const stylePath = path.resolve(
            paths.pubGen,
            "cache",
            "styles",
            `${style}.csl`
        );
        if (!fs.existsSync(stylePath)) {
            console.log(
                `Style ${style} not found in cache. Fetching from GitHub...`
            );
            return true;
        }
        console.log(`Style ${style} found in cache.`);
        return false;
    });

    const xmlStyles = await Promise.all(
        cslStyles.map(async (style) => {
            const octokit = new Octokit({ auth: token });

            try {
                return octokit.rest.search
                    .code({
                        q: `repo:citation-style-language/styles+filename:${style}.csl`,
                    })
                    .then(async (response) => {
                        const searchResponse = response.data.items[0];

                        return octokit
                            .request(
                                "GET /repos/{owner}/{repo}/contents/{path}",
                                {
                                    owner: "citation-style-language",
                                    repo: "styles",
                                    path: searchResponse.name,
                                }
                            )
                            .then(async (response) => {
                                const xmlFile = response.data;

                                return await axios
                                    .get(xmlFile.download_url)
                                    .then((res) => {
                                        const content = res.data;
                                        return {
                                            [`${style}.csl`]: content,
                                        };
                                    })
                                    .catch((error) => {
                                        throw error;
                                    });
                            })
                            .catch((error) => {
                                throw error;
                            });
                    })
                    .catch((error) => {
                        throw error;
                    });
            } catch (error) {
                console.log({ error }, { defaultLog: true, type: "error" });
            }
        })
    );

    const xlmFiles = xmlStyles.reduce((acc, locale) => {
        return { ...acc, ...locale };
    }, {});

    Object.entries(xlmFiles).forEach(([key, value]) => {
        if (!fs.existsSync(path.resolve(paths.pubGen, "cache", "styles")))
            fs.mkdirSync(path.resolve(paths.pubGen, "cache", "styles"), {
                recursive: true,
            });
        fs.writeFileSync(
            path.resolve(paths.pubGen, "cache", "styles", key),
            value
        );
    });
};

fetchStyles(["universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt"]);
