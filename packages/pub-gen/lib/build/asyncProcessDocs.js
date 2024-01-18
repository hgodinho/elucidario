import path from "path";

import { pubGenProcessor } from "../remark/pubGenProcessor.js";
import {
    asyncReadContents,
    getPaths,
    readFile,
    parseFile,
} from "@elucidario/pkg-paths";
import { listAssets, loopStylesStructure, reduceFiles } from "../utils.js";
import { processBibliography } from "./processBibliography.js";
import { processAssets } from "./processAssets.js";
import { processLists } from "./processLists.js";
import { toMD } from "@elucidario/pkg-docusaurus-md";

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
 * const processed = await asyncProcessDocs({
 *    publication,
 *    lang,
 *    type,
 *    style,
 *    pkg,
 *    assets,
 *    index,
 * });
 */
export async function asyncProcessDocs(args) {
    try {
        if (typeof args === "undefined")
            Promise.reject(new Error("`args` is undefined"));

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
            const styles = await asyncReadContents({
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
                    item.value.name === style.name && item.value.type === type,
            ).value;
        } else if (style.path) {
            styleConfig = readFile(
                path.resolve(paths.publications, publication, style.path),
            ).value;
        }

        /**
         * Read all markdown files from srcPath.
         */
        const content = await asyncReadContents({
            dirPath: srcPath,
            extensions: ["md"],
            index: false,
        });

        // console.log({ content });

        /**
         * Prepare object to nest files.
         */
        const prepared = {
            external: {},
            internal: {
                pre: content.filter((item) =>
                    item.path.includes("internal\\pre"),
                ),
                body: content.filter((item) =>
                    item.path.includes("internal\\body"),
                ),
                pos: content.filter((item) =>
                    item.path.includes("internal\\pos"),
                ),
            },
        };

        /**
         * Merge external files with internal files.
         */
        const toProcess = toMD([
            reduceFiles(prepared.internal.pre),
            reduceFiles(prepared.internal.body),
            reduceFiles(prepared.internal.pos),
        ]);

        /**
         * Process files with pubGenProcessor.
         */
        const processed = await pubGenProcessor(toProcess, {
            publication,
            lang,
            type,
            style,
            pkg,
            assets,
            assetsTitles: styleConfig.assets_titles,
            index,
        });

        /**
         * Split processed string into an array of files.
         */
        const regex = RegExp(
            /<!-- START_PUBGEN_FILE: (.*?) -->(.*?)<!-- END_PUBGEN_FILE: (.*?) -->/gs,
        );
        const files = [];
        let match;
        while ((match = regex.exec(processed)) !== null) {
            const filePath = match[1].trim().replace("content", "dist");
            const fileContent = match[2].trim();
            const { name, ext } = path.parse(filePath);
            files.push(
                parseFile({
                    name,
                    ext: ext.replace(".", ""),
                    path: filePath,
                    value: fileContent,
                }),
            );
        }

        const mapCallback = (items, key) => {
            return items
                .map((processed) => {
                    if (processed.path.includes(key)) {
                        return {
                            path: processed.path,
                            file: prepared.internal[key].find((item) => {
                                return item.path.includes(
                                    processed.path.replace("dist", "content"),
                                );
                            }),
                            processed,
                        };
                    }
                    return false;
                })
                .filter(Boolean);
        };

        const produced = {
            content: {
                external: {},
                internal: {
                    body: mapCallback(files, "body"),
                },
            },
            assets: listAssets(publication, "path"),
        };

        const errors = [];

        await loopStylesStructure(
            styleConfig.structure,
            async ({ key, value, required, title }) => {
                try {
                    /**
                     * Check if file exists in content array.
                     */
                    const found = files.find((file) => {
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

                    /**
                     * If search.length is 1, it means that the file is not nested, so we can just add it to the prepared[key].,
                     * else we need to create an array to nest the file.
                     */
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
                            if (found) {
                                acc[search[0]].push({
                                    file: content.find((file) => {
                                        return file.path.includes(
                                            path.resolve(
                                                paths.publications,
                                                publication,
                                                "content",
                                                lang,
                                                value,
                                            ),
                                        );
                                    }),
                                    path: found.path,
                                    processed: found,
                                });
                            }
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
                                                path: file.path,
                                                processed: file,
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
                                        path: listFile.path,
                                        processed: listFile,
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
                                    path: bibliography.path,
                                    processed: bibliography,
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

        if (errors.length > 0) {
            const er = new Error(errors.join("\n\n"));
            console.error(er);
            Promise.reject(er);
        }

        return produced;
    } catch (error) {
        Promise.reject(error);
    }
}
