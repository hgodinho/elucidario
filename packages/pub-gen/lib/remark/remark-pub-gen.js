import { visit } from "unist-util-visit";
import path from "path";
import fs from "fs";
import {
    // htmlTableFromJSON,
    mdGridTableFromJSON,
} from "./htmlTableFromJson.js";
import { propertiesTable } from "@elucidario/schema-doc";

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
                    const schemaTable = propertiesTable(
                        schemaData,
                        "Propriedades",
                        3
                    );
                    node.value = schemaTable;
                    node.type = "html";
                }
            }
        });
    };
}
