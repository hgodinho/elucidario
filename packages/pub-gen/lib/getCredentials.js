import path from "path";
import { Console } from "@elucidario/pkg-console";

import { getPaths, readFile } from "@elucidario/pkg-paths";

const paths = getPaths();

export const getCredentials = (publication = undefined) => {
    let rootPath = paths.root;
    const pkg = readFile(
        path.resolve(paths.publications, publication, "package.json"),
    );
    const console = new Console(pkg);

    if (publication) {
        rootPath = path.resolve(rootPath, "publications", publication);
    }

    try {
        console.info(`Trying to read credentials.json from ${rootPath}`);
        // const credentials = JSON.parse(
        //     fs.readFileSync(path.resolve(rootPath, "credentials.json")),
        // );
        const credentials = readFile(
            path.resolve(rootPath, "credentials.json"),
        ).content;
        console.success("Credentials found!");
        return credentials.installed;
    } catch (error) {
        console.error("Credentials not found");
        return error;
    }
};
