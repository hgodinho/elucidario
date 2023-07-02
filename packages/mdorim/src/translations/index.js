import fs from "fs";
import path from "path";

const translations = fs
    .readdirSync(path.resolve("src", "translations"))
    .map((translation) => {
        const pathObject = path.parse(translation);
        if (pathObject.ext === ".json") {
            return JSON.parse(
                fs
                    .readFileSync(
                        path.resolve("src", "translations", translation)
                    )
                    .toString()
            );
        }
    })
    .reduce((acc, translation) => {
        if (translation) {
            const key = Object.keys(translation)[0];
            acc[key] = translation[key];
        }
        return acc;
    }, {});

export default translations;
