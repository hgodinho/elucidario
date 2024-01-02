import path from "path";

import { pubGenProcessor } from "../remark/pubGenProcessor.js";
import {
    readContents,
    getPaths,
    dirExists,
    readFile,
} from "@elucidario/pkg-paths";
import { loopStylesStructure } from "../utils.js";
import { merge } from "lodash-es";
import { processBibliography } from "./processBibliography.js";
import { processAssets } from "./processAssets.js";
import { processLists } from "./processLists.js";

const paths = getPaths();

/**
 * Process Docs
 * @param {Record<string, any>} args - Arguments
 * @param {string} args.publication - Publication name
 * @param {string} args.type - Publication type
 * @param {string} args.lang - Publication language
 * @param {string} args.style - Publication style
 * @param {string} args.pkg - Publication package.json
 * @param {Record<string, any>} args.assets - Publication assets
 * @param {Record<string, any> | boolean} args.index - Publication index
 * @returns {Promise<Array<Record<string, any>>>}
 *
 * @example
 * const processed = await processDocs({
 *    publication,
 *    lang,
 *    type,
 *    style,
 *    pkg,
 *    assets,
 *    index,
 * });
 */
export const processDocs = async (args) => {
    try {
        if (typeof args === "undefined") throw new Error("`args` is undefined");

        const {
            publication,
            lang,
            type,
            style,
            pkg,
            assets,
            index = true,
        } = args;

        if (typeof publication === "undefined")
            throw new Error("`publication` is undefined");

        if (typeof lang === "undefined") throw new Error("`lang` is undefined");

        if (typeof type === "undefined") throw new Error("`type` is undefined");

        if (typeof style === "undefined")
            throw new Error("`style` is undefined");

        if (style.hasOwnProperty("csl") === false)
            throw new Error("`csl` property from `style` is undefined");

        const srcPath = path.resolve(
            paths.publications,
            publication,
            "content",
            lang,
        );
        const distPath = path.resolve(
            paths.publications,
            publication,
            "dist",
            lang,
        );

        // select styleConfig as per style defined in pub-gen.json documents array.
        // if style.path is defined, use that path, that has origin at publication root.
        // if style.name is defined, use that name, and get the styleConfig from default path.
        let styleConfig;
        if (style.name) {
            const styles = readContents({
                dirPath: path.resolve(
                    paths.packages,
                    "pub-gen",
                    "lib",
                    "styles",
                ),
                extensions: ["json"],
                index: false,
            });

            styleConfig = styles.find(
                (item) =>
                    item.content.name === style.name &&
                    item.content.type === type,
            ).content;
        } else if (style.path) {
            styleConfig = readFile(
                path.resolve(paths.publications, publication, style.path),
            ).content;
        }

        const content = readContents({
            dirPath: srcPath,
            extensions: ["md"],
            index: false,
        });

        const produced = {
            content: {},
            assets: {},
        };

        /**
         * Assets.
         */
        const assetsExtensions = ["png", "jpg", "jpeg", "gif", "svg", "ico"];
        if (
            dirExists(
                path.resolve(
                    paths.publications,
                    publication,
                    "files",
                    "static",
                ),
            )
        ) {
            produced.assets.static = readContents({
                dirPath: path.resolve(
                    paths.publications,
                    publication,
                    "files",
                    "static",
                ),
                returnType: "path",
                extensions: assetsExtensions,
                index: false,
            });
        }
        if (
            dirExists(
                path.resolve(
                    paths.publications,
                    publication,
                    "files",
                    "generated",
                ),
            )
        ) {
            produced.assets.dynamic = readContents({
                dirPath: path.resolve(
                    paths.publications,
                    publication,
                    "files",
                    "generated",
                ),
                returnType: "path",
                extensions: assetsExtensions,
                index: false,
            });
        }

        /**
         *  Step Processor Function
         *
         * @param {Object} file
         */
        const stepProcessor = async (file) => {
            const filePath = file.path.replace("content", "dist");
            const processed = {
                file,
                processed: {},
                path: filePath,
            };
            try {
                processed.processed = await pubGenProcessor(file.content, {
                    publication,
                    lang,
                    style,
                    assets,
                    assetsTitles: styleConfig.assets_titles,
                    pkg,
                });
            } catch (error) {
                if (error.message === "No content provided.") {
                    processed.processed = merge({}, file, {
                        path: filePath,
                    });
                } else {
                    throw new Error(error);
                }
            }
            return processed;
        };

        /**
         * Process Content Files.
         */
        const processed = await Promise.all(
            content.map(async (file) => {
                return await stepProcessor(file);
            }),
        ).then((files) => files);

        const bodyFiles = processed
            .map((file) => {
                if (file.path.includes("body")) {
                    return [
                        file.path
                            // replace distPath
                            .replace(`${distPath}\\`, "")
                            // transform in array
                            .split("\\")
                            // remove .md extension from last item
                            .map((item, index, array) => {
                                if (index === array.length - 1) {
                                    return item.replace(".md", "");
                                }
                                return item;
                            })
                            // join back to string
                            .join("/"),
                        true,
                    ];
                }
                return false;
            })
            .filter(Boolean);

        if (produced.content.hasOwnProperty("internal") === false) {
            produced.content.internal = {};
        }
        produced.content.internal.body = bodyFiles.map((bodyFile) => {
            try {
                /**
                 * Check if file exists in content array.
                 */
                return processed.find((processFile) => {
                    return processFile.path.includes(
                        path.resolve(
                            paths.publications,
                            publication,
                            "dist",
                            lang,
                            bodyFile[0],
                        ),
                    );
                });
            } catch (error) {
                throw new Error(error);
            }
        });

        /**
         * Process Index and Required Files.
         *
         * Loop through styleConfig.structure and process each file.
         *
         * @see lib/utils.js loopStylesStructure
         */
        const errors = [];
        await loopStylesStructure(
            styleConfig.structure,
            async ({ key, value, required, title }) => {
                try {
                    /**
                     * Check if file exists in content array.
                     */
                    const found = processed.find((file) => {
                        return file.path.includes(
                            path.resolve(
                                paths.publications,
                                publication,
                                "dist",
                                lang,
                                value,
                            ),
                        );
                    });

                    const search = value.replace(`${key}/`, "").split("/");

                    /**
                     * If file is not found, check if it is a required file and if it is a body file
                     * (actual content of publication, textual elements in ABNT).
                     *
                     * If it is a required file, throw an error.
                     *
                     * If it is not a required file, continue.
                     *
                     * We ignore body files because it is not possible to know if they are required or not.
                     * And if we follow the style structure, such as ABNT, we will be forced and limited to a structure of three files:
                     * - introdução
                     * - desenvolvimento
                     * - conclusão
                     * we want a more flexible structure, where the user can create any number of files and nest them as they wish.
                     */
                    if (!found && required === true && search[0] !== "body") {
                        throw new Error(
                            `Required file ${value} not found in ${publication}/${lang}`,
                        );
                    }
                    if (search[0] === "body") {
                        return;
                    }

                    if (produced.content.hasOwnProperty(key) === false) {
                        produced.content[key] = {};
                    }

                    search.reduce((acc, item, index) => {
                        if (
                            index === search.length - 1 &&
                            search.length === 1
                        ) {
                            acc[item] = found;
                        } else if (
                            index === search.length - 1 &&
                            search.length !== 1
                        ) {
                            acc[search[0]].push(found);
                        } else {
                            if (!acc.hasOwnProperty(item)) {
                                acc[item] = [];
                            }
                        }
                        return acc;
                    }, produced.content[key]);

                    /**
                     * Check if required is one of the possible types defined at
                     * lib/schema/style-schema.json#/definitions/page_required/oneOf/[2]/enum
                     * and if typeof index is different than boolean.
                     */
                    if (typeof required === "string" && "auto" !== required) {
                        switch (required) {
                            case "assets":
                                try {
                                    const assetsFiles = await processAssets({
                                        publication,
                                        lang,
                                        style,
                                        index,
                                        assets,
                                        required,
                                        title,
                                        filePath: value,
                                        distPath,
                                    });
                                    produced.content[key][search[0]].push(
                                        ...assetsFiles.map((file) => {
                                            return {
                                                file: null,
                                                processed: file,
                                                path: file.path,
                                            };
                                        }),
                                    );
                                } catch (error) {
                                    throw error;
                                }

                                break;

                            case "acronyms":
                            case "glossary":
                            case "symbols":
                                const listFile = await processLists({
                                    index,
                                    assets,
                                    title,
                                    required,
                                    srcPath,
                                    filePath: value,
                                    distPath,
                                });
                                if (listFile) {
                                    produced.content[key][search[0]].push({
                                        file: null,
                                        processed: listFile,
                                        path: listFile.path,
                                    });
                                }
                                break;

                            case "bibliography":
                                const bibliography = await processBibliography({
                                    publication,
                                    lang,
                                    style,
                                    index,
                                    title,
                                    filePath: value,
                                });

                                produced.content[key][search[0]].push({
                                    file: null,
                                    processed: bibliography,
                                    path: bibliography.path,
                                });

                                break;

                            case "summary":
                                break;

                            default:
                                throw new Error(
                                    `Unknown required value: ${required}`,
                                );
                        }
                    }
                    /**
                     * remove empty values from produced.content[key][search[0]]
                     */
                    if (Array.isArray(produced.content[key][search[0]])) {
                        produced.content[key][search[0]] =
                            produced.content[key][search[0]].filter(Boolean);
                    }
                } catch (error) {
                    errors.push(new Error(error));
                }
            },
        );

        if (errors.length) {
            throw new Error(errors.join("\n"));
        }

        return produced;
    } catch (error) {
        throw new Error(error);
    }
};
