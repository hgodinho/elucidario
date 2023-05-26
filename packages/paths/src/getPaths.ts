import fs from "fs";
import path from "path";
import type { GetPathsReturn } from '@elucidario/pkg-types'

export const getPaths = (): GetPathsReturn => {
    try {
        const Path = path.parse(process.cwd());

        let root = '';

        if (Path.dir.includes("packages")) {
            root = Path.dir.split("packages")[0];
        } else if (Path.dir.includes("apps")) {
            root = Path.dir.split("apps")[0];
        } else if (Path.dir.includes("publications")) {
            root = Path.dir.split("publications")[0];
        } else if (Path.dir.includes("references")) {
            root = Path.dir.split("references")[0];
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
            monorepo: {
                packages: fs.readdirSync(path.join(root, "packages")).map((dir) => [dir, path.join(root, "packages", dir)]),
                apps: fs.readdirSync(path.join(root, "apps")).map((dir) => [dir, path.join(root, "apps", dir)]),
                publications: fs.readdirSync(path.join(root, "publications")).map((dir) => [dir, path.join(root, "publications", dir)]),
            }
        }
        return paths as GetPathsReturn;
    } catch (error) {
        console.error(error);
        return {
            root: '',
            current: '',
            packages: '',
            apps: '',
            publications: '',
            references: '',
            monorepo: {
                packages: [],
                apps: [],
                publications: [],
            }
        }
    }
};