import path from "path";
import fs from "fs";
import * as tableschema from "tableschema";

import { Console } from "@elucidario/pkg-console";
import { getPaths } from "@elucidario/pkg-paths";
import { table as mdTable } from "@elucidario/pkg-docusaurus-md";

import { SchemaValidator } from "@elucidario/pkg-schema-validator";

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.packages, "pub-gen", "package.json"))
);
const console = new Console(packageJson);

async function markdownTable(json, emptyValue = "") {
    try {
        const schemaValidator = new SchemaValidator();

        // default schema
        let schema = {};
        if (
            fs.existsSync(
                path.resolve(
                    paths.packages,
                    "pub-gen",
                    "static",
                    "pub-gen",
                    "schemas",
                    "table-schema.json"
                )
            )
        ) {
            schema = JSON.parse(
                fs.readFileSync(
                    path.resolve(
                        paths.packages,
                        "pub-gen",
                        "static",
                        "pub-gen",
                        "schemas",
                        "table-schema.json"
                    )
                )
            );
        }

        const valid = schemaValidator.validate({
            schema: schema,
            data: json,
        });

        if (!valid) {
            throw schemaValidator.getErrors();
        }

        const { data, title, note, ...jsonSchema } = json;

        const schemaData = await tableschema.Schema.load(jsonSchema).then(
            (schema) => schema
        );

        if (!schemaData.valid) throw schemaData.errors;

        const tableData = await tableschema.Table.load(data, {
            schema: schemaData.descriptor,
        });

        const rows = await tableData.read({ keyed: false }).then((rows) => {
            return rows.map((row) => {
                return row.map((column) => {
                    if (!column) return emptyValue;
                    return column;
                });
            });
        });

        const headers = tableData.headers;

        return mdTable({
            title,
            headers,
            rows,
            note,
        });
    } catch (error) {
        console.log(
            { title: json.title, error },
            {
                defaultLog: true,
                title: "Table error!",
                type: "error",
            }
        );
    }
}

export default markdownTable;
