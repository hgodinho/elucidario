import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";

import {
    // htmlTableFromJSON,
    mdGridTableFromJSON,
} from "./htmlTableFromJson.js";

import { entityPage } from "@elucidario/pkg-schema-doc";

import { toMD } from "@elucidario/pkg-docusaurus-md";

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
                    schemaTable = entityPage(schemaData, "pt-BR");

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
