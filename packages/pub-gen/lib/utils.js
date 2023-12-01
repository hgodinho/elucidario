import path from "path";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import { toMD } from "@elucidario/pkg-docusaurus-md";
import inquirer from "inquirer";
import { Console } from "@elucidario/pkg-console";
import { kebabCase } from "lodash-es";

const pkg = readFile({
    filePath: path.resolve(getPaths().packages, "pub-gen", "package.json"),
}).content;

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
                "pub-gen.json"
            ),
            ext: "json",
        }).content;
    } catch (error) {
        throw new Error(
            `Não foi possível encontrar o pub-gen.json da publicação ${publication}: ${error}`
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
                "package.json"
            ),
            ext: "json",
        }).content;
    } catch (error) {
        throw new Error(
            `Não foi possível encontrar o package.json da publicação ${publication}: ${error}`
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
export const debounce = async (func, delay) => {
    let timeoutId;
    return async (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            await func(...args);
        }, delay);
    };
};

/**
 * Clean falsy values from objects
 *
 * @param {object} obj
 * @returns {object}
 */
export const cleanFalsy = (obj) => {
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
        }, [])
    );
};

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
export const makeInquirer = async ({
    title,
    prompt,
    callback,
    publication,
}) => {
    let packageJSON = {};
    try {
        packageJSON = packageJson(publication);
    } catch (error) {
        packageJSON = pkg;
    }
    const console = new Console(packageJSON);
    console.log(title);
    if (typeof callback === "undefined") {
        callback = async (answers) => {
            return cleanFalsy(answers);
        };
    }
    return await inquirer.prompt(prompt).then(callback);
};

/**
 * Creates the README.md file for the publication
 *
 * @param {string} name | name of the publication
 * @param {Object} answers | package.json of the publication
 * @param {string} answers.description | description of the publication
 *
 * @returns | README.md as string (needs to be saved)
 */
export const createREADME = (name, answers) => {
    return toMD([
        `# \`${publicationPkgName(name)}\`\n`,
        `> Publicação gerada com [pub-gen](https://elucidario.art/pub-gen)`,
        answers.description,
    ]);
};

/**
 * Creates the .gitignore file for the publication
 *
 * @returns | .gitignore as string (needs to be saved)
 */
export const createGitignore = (files = []) => {
    return [
        "node_modules",
        "credentials.json",
        "token.json",
        "dist",
        "~$*.*",
        ...files,
    ].join("\n");
};

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
export const createPubGenJson = (name, answers) => {
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
};

/**
 * Creates the package.json file for the publication
 * @param {string} name | name of the publication
 * @returns | package.json
 */
export const createPackageJson = (name) => {
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
};
