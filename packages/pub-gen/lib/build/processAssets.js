import path from "path";
import { parseFile, readFile, getPaths } from "@elucidario/pkg-paths";
import { indexBodyMD } from "./processIndexFiles.js";
import { Console } from "@elucidario/pkg-console";

/**
 * Build References
 * @param {Object} args
 * @param {string} args.distPath
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.publication
 * @param {Console} args.console
 * @param {string} args.version
 */
export async function processAssets(args) {
    try {
        if (typeof args === "undefined") throw new Error("`args` is undefined");

        const {
            publication,
            lang,
            style,
            index = true,
            assets,
            title,
            required,
            filePath,
            distPath,
        } = args;

        if (typeof assets === "undefined")
            throw new Error("`assets` is undefined");
        if (typeof required === "undefined")
            throw new Error("`required` is undefined");
        if (required !== "assets")
            throw new Error(
                "Doing it wrong: `required` is different from `assets`",
            );
        if (typeof distPath === "undefined")
            throw new Error("`distPath` is undefined");

        if (index === true) {
            if (typeof title === "undefined")
                throw new Error("`title` is undefined");

            if (Array.isArray(title) === false)
                throw new Error("`title` is not an array");
            /**
             * If index is true, use the default titles defined at styleConfig.structure and recall processAssets.
             *
             * The titles are the third element of the structure_tuple defined at
             * lib/schema/style-schema.json#/definitions/structure_tuple
             * that can be of type string (the page title) or array of tuples
             * consisting of the following elements:
             * [0] - string - page name
             * [1] - string - page title
             * used when the filePath have the template `{*}`. @see const name in case "object" bellow.
             */
            const titleIndex = {
                [required]: title.reduce((acc, item) => {
                    acc[item[0]] = item[1];
                    return acc;
                }, {}),
            };
            return processAssets({
                publication,
                lang,
                style,
                index: titleIndex,
                assets,
                title,
                required,
                filePath,
                distPath,
            });
        } else if (
            typeof index === "object" &&
            index.hasOwnProperty(required)
        ) {
            switch (typeof index[required]) {
                case "string":
                    if (assets.hasOwnProperty(required)) {
                        const file = parseFile({
                            name: filePath.split("/").pop(),
                            path: path.resolve(distPath, `${filePath}.md`),
                            content: indexBodyMD({
                                title: index[required],
                                items: assets[required],
                            }),
                        });

                        return [file];
                    }
                    break;

                case "object":
                    if (Array.isArray(index[required]) === false) {
                        const files = Object.entries(assets)
                            .map(([type, items]) => {
                                if (items.length === 0) return false;

                                const name = filePath.includes("{*}")
                                    ? filePath.replace("{*}", type)
                                    : filePath;

                                const file = parseFile({
                                    name: name.split("/").pop(),
                                    path: path.resolve(distPath, `${name}.md`),
                                    content: indexBodyMD({
                                        title: index[required].hasOwnProperty(
                                            type,
                                        )
                                            ? index[required][type]
                                            : "",
                                        items,
                                    }),
                                });

                                return file;
                            })
                            .filter(Boolean);
                        return files;
                    }
                    break;

                default:
                    throw new Error(
                        `Invalid index[${required}] type: ${typeof index[
                            required
                        ]}`,
                    );
            }
        } else {
            console.log({
                publication,
                lang,
                style,
                index,
                assets,
                title,
                required,
                filePath,
                distPath,
            });
        }
    } catch (error) {
        throw error;
    }
}
