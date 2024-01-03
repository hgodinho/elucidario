import fs from "fs";
import path from "path";
import type { GetPathsReturn } from "@elucidario/pkg-types";

export const getPaths = (): GetPathsReturn => {
    try {
        const Path = path.parse(process.cwd());

        let root = "";

        if (Path.dir.includes("packages")) {
            root = Path.dir.split("packages")[0];
        } else if (Path.dir.includes("apps")) {
            root = Path.dir.split("apps")[0];
        } else if (Path.dir.includes("publications")) {
            root = Path.dir.split("publications")[0];
        } else if (Path.dir.includes("references")) {
            root = Path.dir.split("references")[0];
        } else if (Path.dir.includes("tools")) {
            root = Path.dir.split("tools")[0];
        } else if (Path.base === "elucidario") {
            root = path.resolve(Path.dir, Path.base);
        } else {
            throw new Error("Could not find root directory");
        }

        const paths = {
            root,
            current: process.cwd(),
            packages: path.join(root, "packages"),
            apps: path.join(root, "apps"),
            publications: path.join(root, "publications"),
            references: path.join(root, "references"),
            tools: path.join(root, "tools"),
            monorepo: {
                packages: fs
                    .readdirSync(path.join(root, "packages"))
                    .map((dir) => [dir, path.join(root, "packages", dir)]),
                apps: fs
                    .readdirSync(path.join(root, "apps"))
                    .map((dir) => [dir, path.join(root, "apps", dir)]),
                publications: fs
                    .readdirSync(path.join(root, "publications"))
                    .map((dir) => [dir, path.join(root, "publications", dir)]),
                tools: fs
                    .readdirSync(path.join(root, "tools"))
                    .map((dir) => [dir, path.join(root, "tools", dir)]),
            },
        };
        return paths as GetPathsReturn;
    } catch (error) {
        console.error(error);
        return {
            root: "",
            current: "",
            packages: "",
            apps: "",
            publications: "",
            references: "",
            tools: "",
            monorepo: {
                packages: [],
                apps: [],
                publications: [],
                tools: [],
            },
        };
    }
};
