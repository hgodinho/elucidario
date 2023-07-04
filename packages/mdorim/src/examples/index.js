import fs from "fs";
import { camelCase, upperFirst } from "lodash-es";
import path from "path";

const examples = fs
    .readdirSync(path.resolve("src", "examples"))
    .map((example) => {
        const pathObject = path.parse(example);

        if (pathObject.ext === "") {
            const name = pathObject.name;
            return {
                name: upperFirst(camelCase(name)),
                data: fs
                    .readdirSync(path.resolve("src", "examples", name))
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
                                                "examples",
                                                name,
                                                file
                                            )
                                        )
                                        .toString()
                                ),
                            };
                        }
                    })
                    .reduce((acc, example) => {
                        if (example) {
                            acc[example.name] = example.data;
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
                            path.resolve("src", "examples", pathObject.base)
                        )
                        .toString()
                ),
            };
        }
    })
    .reduce((acc, example) => {
        if (example) {
            acc[example.name] = example.data;
        }
        return acc;
    }, {});

export default examples;
