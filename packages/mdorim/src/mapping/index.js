import fs from "fs";
import path from "path";

const mapping = fs
    .readdirSync(path.resolve("src", "mapping"))
    .map((map) => {
        const pathObject = path.parse(map);
        if (pathObject.ext === ".json") {
            return JSON.parse(
                fs.readFileSync(path.resolve("src", "mapping", map)).toString()
            );
        }
    })
    .reduce((acc, map) => {
        if (map) {
            const key = Object.keys(map)[0];
            acc[key] = map[key];
        }
        return acc;
    }, {});

export default mapping;
