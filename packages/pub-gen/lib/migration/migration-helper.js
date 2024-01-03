import path from "path";

import { readFile, getPaths, createFile } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
import { pubGenConfig, cleanFalsy } from "../utils.js";

const pkg = readFile({
    filePath: path.resolve(getPaths().packages, "pub-gen", "package.json"),
}).value;
const currentVersion = pkg.config["schema-version"];

export const migrate = async (args) => {
    const console = new Console(pkg);

    const migrateToCurrent = await import(`./${currentVersion}.js`).then(
        (module) => {
            return module.default;
        },
    );

    const { publication, force } = args;

    let publications = [];
    if (publication) {
        publications.push([publication, pubGenConfig(publication)]);
    } else {
        publications = getPaths().monorepo.publications.map(([name, path]) => [
            name,
            pubGenConfig(name),
        ]);
    }

    for (let [publication, config] of publications) {
        if (config.version !== currentVersion || force === true) {
            const newConfig = await migrateToCurrent(cleanFalsy(config)).then(
                (c) => cleanFalsy(c),
            );

            createFile(
                {
                    filePath: path.resolve(
                        getPaths().publications,
                        publication,
                        "pub-gen.json",
                    ),
                    ext: "json",
                },
                newConfig.config,
            );

            console.warning({
                message: {
                    added: newConfig.added,
                    modified: newConfig.modified,
                    removed: newConfig.removed,
                },
                title: `Migrating ${publication} from ${config.version} to ${currentVersion}`,
                defaultLog: true,
            });
        }
    }
};
