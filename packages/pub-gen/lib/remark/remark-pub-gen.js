import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";

import {
    // htmlTableFromJSON,
    mdGridTableFromJSON,
} from "./htmlTableFromJson.js";

import { entityPage } from "@elucidario/pkg-schema-doc";

import { toMD } from "@elucidario/pkg-docusaurus-md";

import { getPaths } from "../getPaths.js";
const paths = getPaths();

import { engine } from "../reference/csl-engine.js";

export default function remarkPubGen(options) {
    return async function transformer(tree) {
        visit(tree, "text", (node) => {
            if (node.value.startsWith("{{") && node.value.endsWith("}}")) {
                const value = node.value.replace("{{", "").replace("}}", "");
                /**
                 * Table
                 */
                if (value.startsWith("table")) {
                    const tableName = value.replace("table:", "");
                    const tableData = JSON.parse(
                        fs.readFileSync(path.resolve(options.path, tableName))
                    );
                    const tableMd = mdGridTableFromJSON(tableData);
                    // const tableHtml = htmlTableFromJSON(tableData);

                    console.log(tableMd);

                    node.value = tableMd;
                    node.type = "html";
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

                    // if (schemaData.properties) {
                    //     schemaTable = propertiesTable(
                    //         schemaData,
                    //         schemaData.title,
                    //         options.startLevel || 3,
                    //         options.language
                    //     );
                    // }
                    // if (schemaData.definitions) {
                    //     schemaTable = metadata(
                    //         schemaData.title,
                    //         schemaData,
                    //         true,
                    //         options.startLevel || 3,
                    //         options.language
                    //     );
                    // }
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
                        .split(",")
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

        if (!options.publication) return;

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

        visit(tree, "cite", (node) => {
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
                    "html"
                );

                node.type = "text";
                node.value = citations;
            } catch (error) {
                console.log(error);
            }
        });

        // /** @type {Array<Promise<import("@apidevtools/json-schema-ref-parser/dist/lib/types/index.js").JSONSchema>>} */
        // const promises = [];
        // for (const node of nodes) {
        //     const value = node.value.replace("{{", "").replace("}}", "");
        //     const schemaName = value.replace("json-schema:", "");
        //     const schemaData = JSON.parse(
        //         fs.readFileSync(path.resolve(options.path, schemaName))
        //     );
        //     promises.push(await resolveSchema(schemaData));
        // }

        // const resolved = await Promise.all(promises);
        // for (const [index, node] of resolved.entries()) {
        //     let schemaTable = {};

        //     if (resolved[index].properties) {
        //         schemaTable = propertiesTable(
        //             resolved[index],
        //             resolved[index].title,
        //             3
        //         );
        //     }
        //     if (resolved[index].definitions) {
        //         schemaTable = metadata(
        //             resolved[index].title,
        //             resolved[index],
        //             true,
        //             3
        //         );
        //     }
        //     node.value = schemaTable;
        //     node.type = "html";
        //     console.log({ node });
        // }
    };
}
