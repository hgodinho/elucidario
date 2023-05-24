import fs from "fs";
import path from "path";

import { getPaths } from "../getPaths.js";
const paths = getPaths();

export const generateSearchIndex = async () => {
    const schema = JSON.parse(
        fs.readFileSync(
            path.resolve(
                paths.pubGen,
                "static",
                "pub-gen",
                "schema",
                "reference-schema.json"
            )
        )
    );

    const nameVariable = Object.keys(
        schema.definitions["name-variable"].anyOf[0].properties
    ).map((prop) => {
        return `"${prop}"`;
    });

    const dateVariable = Object.keys(
        schema.definitions["date-variable"].anyOf[0].properties
    ).map((prop) => {
        return `"${prop}"`;
    });

    const exclude = ["_create", "_update"];

    const index = Object.entries(schema.properties).map(([key, value]) => {
        if (exclude.includes(key)) return false;
        switch (value.type) {
            case "string":
                return `search.addIndex("${key}");`;

            case "array":
                if ("$ref" in value.items) {
                    if (value.items.$ref.includes("name-variable")) {
                        return `search.addIndex(["${key}",[],${nameVariable.join(
                            ","
                        )}]);`;
                    }
                }

            case "object":
                if ("$ref" in value) {
                    if (value.$ref.includes("date-variable")) {
                        return `search.addIndex(["${key}", ${dateVariable.join(
                            ","
                        )}]);`;
                    }
                }

            default:
                return `search.addIndex("${key}");`;
        }
    });

    fs.writeFileSync(
        path.resolve(paths.pubGen, "searchIndex.js"),
        index.filter((i) => i).join("\n")
    );
};
