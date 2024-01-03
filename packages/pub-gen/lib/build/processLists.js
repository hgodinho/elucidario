import path from "path";
import { readFile, parseFile, fileExists } from "@elucidario/pkg-paths";
import { indexBodyMD } from "./processIndexFiles.js";

/**
 * Build References
 * @param {Object} args
 * @param {string} args.title
 * @param {string|boolean} args.required
 * @param {string} args.srcPath
 * @param {string} args.filePath
 * @param {string} args.distPath
 */
export async function processLists(args) {
    try {
        if (typeof args === "undefined") throw new Error("`args` is undefined");

        const {
            title,
            required,
            srcPath,
            filePath,
            distPath,
            index = true,
        } = args;

        if (typeof distPath === "undefined")
            throw new Error("`distPath` is undefined");

        if (typeof required === "undefined")
            throw new Error("`required` is undefined");

        if (typeof srcPath === "undefined")
            throw new Error("`srcPath` is undefined");

        if (typeof filePath === "undefined")
            throw new Error("`filePath` is undefined");

        const fileName = `${required}.json`;

        if (fileExists(path.resolve(srcPath, fileName))) {
            /**
             * Sort acronyms, glossary and symbols alphabetically.
             */
            const items = Object.entries(
                readFile({
                    filePath: path.resolve(srcPath, fileName),
                }).value,
            ).sort((a, b) => {
                if (a[0] < b[0]) return -1;
                if (a[0] > b[0]) return 1;
            });

            let file = {};
            if (index === true) {
                if (typeof title === "undefined")
                    throw new Error("`title` is undefined");

                file = parseFile({
                    name: filePath.split("/").pop(),
                    path: path.resolve(distPath, `${filePath}.md`),
                    value: indexBodyMD({
                        title,
                        items: items.map(([item, description]) => {
                            return `${item} - ${description};`;
                        }),
                    }),
                });
            } else if (
                typeof index === "object" &&
                index.hasOwnProperty(required)
            ) {
                file = parseFile({
                    name: filePath.split("/").pop(),
                    path: path.resolve(distPath, `${filePath}.md`),
                    value: indexBodyMD({
                        title:
                            typeof index !== "undefined"
                                ? index[required]
                                : undefined,
                        items: items.map(([item, description]) => {
                            return `${item} - ${description};`;
                        }),
                    }),
                });
            } else if (
                typeof index === "object" &&
                !index.hasOwnProperty(required)
            ) {
                throw new Error(
                    `\`${required}\` property from \`index\` is undefined`,
                );
            }

            return file;
        }
    } catch (error) {
        throw error;
    }
}
