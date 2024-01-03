import path from "path";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import { toMD } from "@elucidario/pkg-docusaurus-md";
import inquirer from "inquirer";
import { Console } from "@elucidario/pkg-console";
import { kebabCase } from "lodash-es";
import { fromMarkdown } from "mdast-util-from-markdown";

const pkg = readFile({
    filePath: path.resolve(getPaths().packages, "pub-gen", "package.json"),
}).value;

/**
 * Get publication config
 * @param {string} publication
 * @returns {Object}
 * @throws {Error}
 */
export function pubGenConfig(publication) {
    try {
        return readFile({
            filePath: path.resolve(
                getPaths().publications,
                publication,
                "pub-gen.json",
            ),
            ext: "json",
        }).value;
    } catch (error) {
        throw new Error(
            `Não foi possível encontrar o pub-gen.json da publicação ${publication}: ${error}`,
        );
    }
}

/**
 * Get publication package.json
 * @param {string} publication
 * @returns {Object}
 * @throws {Error}
 */
export function packageJson(publication) {
    try {
        return readFile({
            filePath: path.resolve(
                getPaths().publications,
                publication,
                "package.json",
            ),
            ext: "json",
        }).value;
    } catch (error) {
        throw new Error(
            `Não foi possível encontrar o package.json da publicação ${publication}: ${error}`,
        );
    }
}

/**
 * Get reference index of a publication
 *
 * @param {string} publication
 * @returns {Object}
 * @throws {Error}
 */
export function referenceIndex(publication) {
    try {
        return readFile({
            filePath: path.resolve(
                getPaths().publications,
                publication,
                "references",
                "index.json",
            ),
            ext: "json",
        }).value;
    } catch (error) {
        throw new Error(
            `Não foi possível encontrar o index das referências da publicação ${publication}: ${error}`,
        );
    }
}

/**
 * Get references of a publication
 *
 * @param {string} publication
 * @returns {Array}
 * @throws {Error}
 */
export function referencesFrom(publication) {
    try {
        return referenceIndex(publication).items.map((item) => {
            return readFile({
                filePath: path.resolve(
                    getPaths().references,
                    item.path.replace("<references>/", ""),
                ),
                ext: "json",
            }).value;
        });
    } catch (error) {
        throw new Error(
            `Não foi possível encontrar as referências da publicação ${publication}: ${error}`,
        );
    }
}

/**
 * Generate a debounced function
 *
 * @param {function} func
 * @param {number} delay
 * @returns {function}
 */
export async function debounce(func, delay) {
    let timeoutId;
    return async (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            await func(...args);
        }, delay);
    };
}

/**
 * Clean falsy values from objects
 *
 * @param {object} obj
 * @returns {object}
 */
export function cleanFalsy(obj) {
    return Object.fromEntries(
        Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                if (
                    typeof value === "object" &&
                    !Array.isArray(value) &&
                    Object.keys(value).length > 0
                ) {
                    value = cleanFalsy(value);
                    acc.push([key, value]);
                } else if (Array.isArray(value) && value.length) {
                    value = value.map((item) => {
                        if (typeof item === "object") {
                            return cleanFalsy(item);
                        }
                        return item;
                    });
                    acc.push([key, value]);
                } else if (typeof value === "string" && value.length) {
                    value = value.trim();
                    acc.push([key, value]);
                } else if (typeof value === "boolean" || value === 0) {
                    acc.push([key, value]);
                } else {
                    return acc;
                }
            }
            return acc;
        }, []),
    );
}

/**
 * Get publication package name
 *
 * @param {string} publication
 * @returns {string}
 */
export const publicationPkgName = (publication) =>
    `@elucidario/pub-${kebabCase(publication.trim())}`;

/**
 * Create a inquirer callback
 *
 * @param {string} title
 * @param {object} prompt
 * @param {function} callback
 * @returns {object}
 *
 * @example
 * const answers = async () => await makeInquirer({
 *    title: "Adding licenses...",
 *    prompt: pubGenPrompt("addLicense"),
 * });
 */
export async function makeInquirer({
    title,
    prompt,
    callback,
    publication,
    type = "info",
}) {
    let packageJSON = {};
    try {
        packageJSON = packageJson(publication);
    } catch (error) {
        packageJSON = pkg;
    }
    const console = new Console(packageJSON);
    console.log(title, { type });
    if (typeof callback === "undefined") {
        callback = async (answers) => {
            return cleanFalsy(answers);
        };
    }
    return await inquirer.prompt(prompt).then(callback);
}

/**
 * Creates the README.md file for the publication
 *
 * @param {string} name | name of the publication
 * @param {Object} answers | package.json of the publication
 * @param {string} answers.description | description of the publication
 *
 * @returns | README.md as string (needs to be saved)
 */
export function createREADME(name, answers) {
    return toMD([
        `# \`${publicationPkgName(name)}\`\n`,
        `> Publicação gerada com [pub-gen](https://elucidario.art/pub-gen)`,
        answers.description,
    ]);
}

/**
 * Creates the .gitignore file for the publication
 *
 * @returns | .gitignore as string (needs to be saved)
 */
export function createGitignore(files = []) {
    return [
        "node_modules",
        "credentials.json",
        "token.json",
        "dist",
        "~$*.*",
        ...files,
    ].join("\n");
}

/**
 * Creates the pub-gen.json file for the publication
 * use for current version schema
 *
 * @see package.json->config.schema-version for current version
 * @see packages/pub-gen/static/pub-gen/schemas/pub-gen-schema.json for schema
 *
 * @param {string} name | name of the publication
 * @param {Object} answers | answers from the prompt
 *
 * @returns | pub-gen.json as object (needs to be stringified to be saved)
 */
export function createPubGenJson(name, answers) {
    const { keywords, ...rest } = answers;
    const version = pkg.config["schema-version"];
    return cleanFalsy({
        $schema:
            "node_modules/@elucidario/pkg-pub-gen/static/pub-gen/schemas/pub-gen-schema.json",
        version,
        profile: "data-package",
        id: `https://elucidario.art/publicacoes/${name.trim()}`,
        ...rest,
        keywords:
            typeof keywords !== "undefined"
                ? keywords.split(/[;,]/).map((k) => k.trim())
                : undefined,
        created: new Date().toISOString(),
    });
}

/**
 * Creates the package.json file for the publication
 * @param {string} name | name of the publication
 * @returns | package.json
 */
export function createPackageJson(name) {
    const pubName = kebabCase(name.trim());
    return {
        name: publicationPkgName(name),
        version: "0.1.0",
        main: "README.md",
        private: true,
        scripts: {
            "add-author": `pub-gen add-author -p ${pubName}`,
            authenticate: `pub-gen authenticate -p ${pubName}`,
            build: `pnpm clean && pub-gen build -p ${pubName}`,
            clean: "rm -rf dist/*",
            convert: `pub-gen convert -p ${pubName}`,
            "ref-add": `pub-gen reference add -p ${pubName}`,
            "ref-search": `pub-gen reference search -p ${pubName}`,
            "version-up": `pub-gen version -p ${pubName}`,
        },
        devDependencies: {
            "@elucidario/pkg-pub-gen": "workspace:^",
        },
    };
}

/**
 * Parse node value
 *
 * @param {Object} node
 * @returns {Object}
 */
export function parseNodeValue(value) {
    const [action, optionsString] = value
        .replace("{{", "")
        .replace("}}", "")
        .split(":");

    const [filePath, ...fileOptions] = optionsString.split(";");

    const options = {};
    for (let option of fileOptions) {
        const [key, value] = option.split("=");
        options[key] = value;
    }

    if (action === "count") {
        return {
            action,
            optionsString,
            type: filePath,
            options,
        };
    }

    return {
        action,
        optionsString,
        filePath,
        fileOptions: options,
    };
}

/**
 *  Check if node value is a pub-gen node value ({{...}})
 * @param {string} value | node value
 * @returns | true if node value is a pub-gen node value ({{...}}), false otherwise
 */
export function isPubGenNodeValue(value) {
    return value.startsWith("{{") && value.endsWith("}}");
}

/**
 * Replace Regex Handlebars
 *
 * @param {string} text
 * @param {Object} options
 * @returns {string}
 */
export function replaceRegexHandlebars(text, options) {
    if (!text) return null;
    const regex = /{{(.*?)}}/g;
    const replacedText = text.replace(regex, (match, group) => {
        const replacement = options[group.trim()] || "";
        return replacement;
    });

    return replacedText;
}

/**
 *
 * @param {string} md | Markdown string
 * @param {object} options | options for parser
 * @param {boolean} options.reduce | reduce mdast tree
 * @returns
 */
export function mdToMdast(md, options = undefined) {
    if (typeof options === "undefined" || !options.reduce)
        return fromMarkdown(md);

    return fromMarkdown(md).children.reduce((acc, node) => {
        switch (node.type) {
            case "root":
            case "paragraph":
                acc = node.children;
                break;
        }
        return acc;
    }, []);
}

/**
 * Flatten style structure files
 * @param {object} data
 * @param {array} exclude
 * @param {array} paths
 * @returns {array}
 */
export function flattenStyleStructureFiles(data, exclude = [], paths = []) {
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string" && value.endsWith(".md")) {
            paths.push(value);
        } else if (Array.isArray(value)) {
            for (const [name, include] of value) {
                if (
                    include &&
                    !exclude.includes(name) &&
                    !exclude.includes(key)
                ) {
                    paths.push(`${key}/${name}.md`);
                }
            }
        } else if (typeof value === "object") {
            flattenStyleStructureFiles(value, exclude, paths); // Recursively traverse
        }
    }
    return paths;
}

/**
 * Loop through style structure
 * @param {object} structure
 * @param {function} callback
 * @param {string} prefix
 * @returns {array}
 */
export async function loopStylesStructure(structure, callback, prefix = "") {
    for (const [key, value, title] of Object.entries(structure)) {
        if (typeof value === "string") {
            await callback({
                key: prefix ? prefix : key,
                value,
                title,
            });
        } else if (Array.isArray(value)) {
            for (const [name, required, title] of value) {
                await callback({
                    key: prefix ? prefix : key,
                    value: `${prefix ? `${prefix}/` : ""}${key}/${name}`,
                    required,
                    title,
                });
            }
        } else if (typeof value === "object") {
            await loopStylesStructure(value, callback, key); // Recursively traverse
        }
    }
}

/**
 * Process files
 * @param {object} obj
 * @param {function} callback
 * @returns {object}
 */
export function processFiles(obj, callback) {
    if (Array.isArray(obj)) {
        return obj.map((item) => processFiles(item, callback));
    } else if (typeof obj === "object") {
        if (
            obj.hasOwnProperty("file") &&
            obj.hasOwnProperty("path") &&
            obj.hasOwnProperty("processed")
        ) {
            return callback(obj);
        } else {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => {
                    return [key, processFiles(value, callback)];
                }),
            );
        }
    } else {
        return obj;
    }
}
