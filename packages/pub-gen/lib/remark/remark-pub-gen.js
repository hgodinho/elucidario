import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";

import {
    // htmlTableFromJSON,
    mdGridTableFromJSON,
} from "./htmlTableFromJson.js";

import { propertiesTable, entityTable, metadata } from "@elucidario/schema-doc";

import { toMD } from "@elucidario/docusaurus-md";

export default function remarkPubGen(options) {
    return function transformer(tree, file) {
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
                    if (schemaData.properties) {
                        schemaTable = propertiesTable(
                            schemaData,
                            schemaData.title,
                            3
                        );
                    }
                    if (schemaData.definitions) {
                        schemaTable = metadata(
                            schemaData.title,
                            schemaData,
                            true,
                            3
                        );
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
    };
}
