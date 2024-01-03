import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";
import parser from "parser-front-matter";

import { entityPage } from "@elucidario/pkg-schema-doc";
import { toMD, bold, codeBlock } from "@elucidario/pkg-docusaurus-md";

import { getPaths, readFile } from "@elucidario/pkg-paths";
import markdownTable from "./table/markdownTable.js";

const pkg = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json"),
).value;

import { Console } from "@elucidario/pkg-console";

const console = new Console(pkg);

import { engine } from "../reference/csl-engine.js";
import { replaceRegexHandlebars } from "../utils.js";

/**
 * Parse Value
 *
 * @param {string} value
 * @returns {Object}
 */
export const parseValue = (value) => {
    const [action, optionsString] = value.split(":");
    const [filePath, ...fileOptions] = optionsString.split(";");

    const options = {};
    for (let option of fileOptions) {
        const [key, value] = option.split("=");
        options[key] = value;
    }

    return {
        action,
        optionsString,
        filePath,
        fileOptions: options,
    };
};

export default function remarkPubGen(options) {
    return async function transformer(tree) {
        const tables = [];
        const labels = {
            images: "Imagem",
            tables: "Tabela",
            figures: "Figura",
            charts: "Quadro",
        };

        // push and return the length of the array
        const pushToIndex = (index, type, value) => {
            index[type].push(value);
            return index[type].length;
        };

        const counter = (index, path, options) => {
            const length = pushToIndex(index, path, options.legend);
            return `${labels[path]} ${length}: ${options.legend}`;
        };

        visit(tree, "text", (node) => {
            if (node.value.startsWith("{{") && node.value.endsWith("}}")) {
                const value = node.value.replace("{{", "").replace("}}", "");
                const { action, filePath, fileOptions } = parseValue(value);

                /**
                 * Table
                 */
                if ("table" === action) {
                    const { filePath } = parseValue(value);

                    const tableData = JSON.parse(
                        fs.readFileSync(path.resolve(options.path, filePath)),
                    );

                    if (tableData.title.startsWith("{{")) {
                        const value = tableData.title
                            .replace("{{", "")
                            .replace("}}", "");
                        const parsed = parseValue(value);

                        if ("count" === parsed.action) {
                            tableData.title = counter(
                                options.index,
                                parsed.filePath,
                                parsed.fileOptions,
                            );
                        }
                    }
                    tables.push({ node, value, tableData });
                }

                /**
                 * Schema
                 */
                if ("json-schema" === action) {
                    try {
                        let schemaData = {};
                        try {
                            schemaData = JSON.parse(
                                fs.readFileSync(
                                    path.resolve(options.path, filePath),
                                ),
                            );
                        } catch (error) {
                            throw new Error(
                                `Error reading schema in ${filePath} ${error.message}`,
                            );
                        }

                        let schemaTable = {};
                        try {
                            schemaTable = entityPage(schemaData, "pt-BR");
                        } catch (error) {
                            throw new Error(
                                `Error generation entityPage in ${filePath} ${error.message}`,
                            );
                        }

                        node.value = schemaTable;
                        node.type = "html";
                    } catch (err) {
                        console.log({ err }, { defaultLog: true });
                    }
                }

                /**
                 * Status
                 */
                if ("status" === action) {
                    const status = value
                        .replace("status:", "")
                        .split(";")
                        .map((s) => s.replace('"', "").replace('"', ""));

                    const statusTable = toMD(
                        [`:::${status[0]} ${status[1]}`, status[2], ":::"],
                        "\n\n",
                    );
                    node.value = statusTable;
                    node.type = "html";
                }

                /**
                 * mermaid
                 */
                if ("mermaid" === action) {
                    const mermaidData = fs
                        .readFileSync(path.resolve(options.path, filePath))
                        .toString();

                    let { data, content } = parser.parseSync(mermaidData);
                    content = replaceRegexHandlebars(content, fileOptions);

                    const {
                        filename,
                        source,
                        title,
                        width,
                        theme,
                        background,
                        format,
                        type,
                    } = data;

                    let mermaidOptions = "{.mermaid";
                    if (filename) mermaidOptions += ` filename="${filename}"`;
                    if (options.distPath)
                        mermaidOptions += ` loc="${options.distPath}"`;
                    if (width) mermaidOptions += ` width=${width}`;
                    if (theme) mermaidOptions += ` theme=${theme}`;
                    if (background)
                        mermaidOptions += ` background=${background}`;
                    if (format) mermaidOptions += ` format=${format}`;

                    mermaidOptions += "}";

                    let label = "";
                    if (title.startsWith("{{")) {
                        const value = title.replace("{{", "").replace("}}", "");
                        const parsed = parseValue(value);
                        if ("count" === parsed.action) {
                            label = counter(
                                options.index,
                                parsed.filePath,
                                parsed.fileOptions,
                            );
                        }
                    } else {
                        label = title;
                    }
                    const mermaidContent =
                        type !== "mindmap"
                            ? toMD([
                                  bold(
                                      replaceRegexHandlebars(
                                          label,
                                          fileOptions,
                                      ),
                                  ),
                                  content.replace("mermaid", mermaidOptions),
                                  source || "",
                              ])
                            : toMD([
                                  bold(
                                      replaceRegexHandlebars(
                                          label,
                                          fileOptions,
                                      ),
                                  ),
                                  content,
                                  source || "",
                              ]);

                    node.value = mermaidContent;
                    node.type = "html";
                }

                /**
                 * Code
                 * {{code:./src/...}}
                 */
                if ("code" === action) {
                    const language =
                        path.parse(filePath).ext.replace(".", "") || "js";

                    const codeData = fs
                        .readFileSync(path.resolve(options.path, filePath))
                        .toString();

                    const codeContent = codeBlock(codeData, language);

                    node.value = codeContent;
                    node.type = "html";
                }

                /**
                 * Embed
                 * {{embed:./src/...}}
                 */
                if ("embed" === action) {
                    const embedData = fs
                        .readFileSync(path.resolve(options.path, filePath))
                        .toString();
                    // const language =
                    //     path.parse(filePath).ext.replace(".", "") || "html";
                    // const embedData = codeBlock(data, `{=${language}}`);

                    const embedContent = toMD([embedData]);

                    node.value = embedContent;
                    node.type = "html";
                }

                /**
                 * Counter
                 * {{count:{{type}}=./src/...;legend=...}}
                 */
                if ("count" === action) {
                    node.value = counter(options.index, filePath, fileOptions);
                }
            }
        });

        // parse tables
        const promises = tables.map(async ({ node, value, tableData }) => {
            const tableMd = await markdownTable(tableData, "-").then(
                (md) => md,
            );
            node.value = tableMd;
            node.type = "html";
        });
        await Promise.all(promises);

        // return early if no publication is defined
        if (!options.publication) return;

        visit(tree, "cite", (node) => {
            const references = JSON.parse(
                fs.readFileSync(
                    path.resolve(
                        getPaths().publications,
                        options.publication,
                        "references",
                        "index.json",
                    ),
                ),
            )
                .items.map((item) => {
                    let refPath = item.path.replace("<references>/", "");
                    refPath = path.resolve(getPaths().references, refPath);
                    return JSON.parse(fs.readFileSync(refPath));
                })
                .filter((item) => item);

            const citeproc = engine(references, options.lang, options.style);

            try {
                const ids = node.data.citeItems.map((item) => item.key);

                const citations = citeproc.previewCitationCluster(
                    {
                        properties: {
                            noteIndex: 1,
                        },
                        citationItems: references.filter((ref) => {
                            return ids.includes(ref.id);
                        }),
                        citeItems: node.data.citeItems.map((item) => {
                            const citeItem = {
                                id: item.key,
                                ...item,
                            };
                            delete citeItem.key;
                            return citeItem;
                        }),
                    },
                    [],
                    [],
                    "html",
                );

                node.type = "text";
                node.value = citations;
            } catch (error) {
                console.log(error);
            }
        });

        visit(tree, "image", (node) => {
            if (node.alt.startsWith("{{")) {
                const value = node.alt.replace("{{", "").replace("}}", "");
                const { action, filePath, fileOptions } = parseValue(value);

                if ("count" === action) {
                    node.alt = counter(options.index, filePath, fileOptions);
                }
            }
        });
    };
}
