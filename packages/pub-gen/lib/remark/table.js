import path from "path";
import fs from "fs";
import Ajv from "ajv";
import * as tableschema from "tableschema";

import { Console } from "@elucidario/pkg-console";
import { getPaths } from "../getPaths.js";
import { table as mdTable } from "@elucidario/pkg-docusaurus-md";

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

let schema = {};

if (
    fs.existsSync(
        path.resolve(
            paths.pubGen,
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
                paths.pubGen,
                "static",
                "pub-gen",
                "schemas",
                "table-schema.json"
            )
        )
    );
}

const ajv = new Ajv();
ajv.addVocabulary(["context", "notes"]);

const validate = ajv.compile(schema);

export const tableMarkdown = async (json, emptyValue = "") => {
    try {
        const valid = validate(json);
        if (!valid) {
            throw validate.errors;
        }
        const { data, title, note, ...schema } = json;

        const schemaData = await tableschema.Schema.load(schema);

        if (!schemaData.valid) throw schemaData.errors;

        const tableData = await tableschema.Table.load(data, {
            schema: schemaData.descriptor,
        });
        let rows = await tableData.read({ keyed: false });
        const headers = tableData.headers;

        rows = rows.map((row) => {
            return row.map((column) => {
                if (!column) return emptyValue;
                return column;
            });
        });

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
};
