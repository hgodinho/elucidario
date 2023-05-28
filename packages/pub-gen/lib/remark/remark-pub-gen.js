import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";

import { entityPage } from "@elucidario/pkg-schema-doc";
import { toMD } from "@elucidario/pkg-docusaurus-md";

import { getPaths } from "../getPaths.js";
import { tableMarkdown } from "./table.js";

const paths = getPaths();

import { engine } from "../reference/csl-engine.js";

export default function remarkPubGen(options) {
    return async function transformer(tree) {
        const tables = [];

        visit(tree, "text", (node) => {
            if (node.value.startsWith("{{") && node.value.endsWith("}}")) {
                const value = node.value.replace("{{", "").replace("}}", "");

                /**
                 * Table
                 */
                if (value.startsWith("table")) {
                    tables.push({ node, value });
                }

                /**
                 * Schema
                 */
                if (value.startsWith("json-schema")) {
                    const schemaName = value.replace("json-schema:", "");
                    const schemaData = JSON.parse(
                        fs.readFileSync(path.resolve(options.path, schemaName))
                    );
                    let schemaTable = {};

                    try {
                        schemaTable = entityPage(schemaData, "pt-BR");
                    } catch (error) {
                        console.log(error);
                    }

                    node.value = schemaTable;
                    node.type = "html";
                }

                /**
                 * Status
                 */
                if (value.startsWith("status")) {
                    const status = value
                        .replace("status:", "")
                        .split(";")
                        .map((s) => s.replace('"', "").replace('"', ""));
                    const statusTable = toMD(
                        [`:::${status[0]} ${status[1]}`, status[2], ":::"],
                        "\n\n"
                    );
                    node.value = statusTable;
                    node.type = "html";
                }
            }
        });

        // parse tables
        const promises = tables.map(async ({ node, value }) => {
            const tablePath = value.replace("table:", "");
            const tableData = JSON.parse(
                fs.readFileSync(path.resolve(options.path, tablePath))
            );
            const tableMd = await tableMarkdown(tableData, "-").then(
                (md) => md
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
                        paths.publications,
                        options.publication,
                        "references",
                        "index.json"
                    )
                )
            )
                .items.map((item) => {
                    let refPath = item.path.replace("<references>/", "");
                    refPath = path.resolve(paths.references, refPath);
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
                                locator: item.suffix,
                                ...item,
                            };
                            delete citeItem.key;
                            return citeItem;
                        }),
                    },
                    [],
                    [],
                    "html"
                );

                node.type = "text";
                node.value = citations;
            } catch (error) {
                console.log(error);
            }
        });
    };
}
