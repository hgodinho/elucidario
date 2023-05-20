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

export const fetchLocales = async (lang) => {
    console.log(lang, {
        defaultLog: true,
        type: "info",
        title: "Fetching locales...",
    });

    const locales = lang.filter((locale) => {
        const localePath = path.resolve(
            paths.pubGen,
            "cache",
            "locales",
            `locales-${locale}.xml`
        );
        if (!fs.existsSync(localePath)) {
            console.log(
                `Locale ${locale} not found in cache. Fetching from GitHub...`
            );
            return true;
        }
        console.log(`Locale ${locale} found in cache.`);
        return false;
    });

    const xmlLocales = await Promise.all(
        locales.map(async (locale) => {
            const octokit = new Octokit({ auth: token });

            try {
                return octokit.rest.search
                    .code({
                        q: `repo:citation-style-language/locales+filename:locales-${locale}.xml`,
                    })
                    .then(async (response) => {
                        const searchResponse = response.data.items[0];

                        return octokit
                            .request(
                                "GET /repos/{owner}/{repo}/contents/{path}",
                                {
                                    owner: "citation-style-language",
                                    repo: "locales",
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
                                            [`locales-${locale}.xml`]: content,
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

    const xmlFiles = xmlLocales.reduce((acc, locale) => {
        return { ...acc, ...locale };
    }, {});

    Object.entries(xmlFiles).forEach(([key, value]) => {
        if (!fs.existsSync(path.resolve(paths.pubGen, "cache", "locales")))
            fs.mkdirSync(path.resolve(paths.pubGen, "cache", "locales"), {
                recursive: true,
            });
        fs.writeFileSync(
            path.resolve(paths.pubGen, "cache", "locales", key),
            value
        );
    });
};
