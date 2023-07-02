import fs from "fs";
import { camelCase, upperFirst } from "lodash-es";
import path from "path";

const schemas = fs
    .readdirSync(path.resolve("src", "schemas"))
    .map((schema) => {
        const pathObject = path.parse(schema);

        if (pathObject.ext === "") {
            const name = pathObject.name;

            return {
                name: upperFirst(camelCase(name)),
                data: fs
                    .readdirSync(path.resolve("src", "schemas", name))
                    .map((file) => {
                        const pathObject = path.parse(file);
                        if (pathObject.ext === ".json") {
                            return {
                                name: upperFirst(camelCase(pathObject.name)),
                                data: JSON.parse(
                                    fs
                                        .readFileSync(
                                            path.resolve(
                                                "src",
                                                "schemas",
                                                name,
                                                file
                                            )
                                        )
                                        .toString()
                                ),
                            };
                        }
                    })
                    .reduce((acc, schema) => {
                        if (schema) {
                            acc[schema.name] = schema.data;
                        }
                        return acc;
                    }, {}),
            };
        }

        if (pathObject.ext === ".json") {
            return {
                name: upperFirst(camelCase(pathObject.name)),
                data: JSON.parse(
                    fs
                        .readFileSync(
                            path.resolve("src", "schemas", pathObject.base)
                        )
                        .toString()
                ),
            };
        }
    })
    .reduce((acc, schema) => {
        if (schema) {
            acc[schema.name] = schema.data;
        }
        return acc;
    }, {});

export default schemas;
