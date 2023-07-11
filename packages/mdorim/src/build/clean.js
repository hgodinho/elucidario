import fs from "fs";
import path from "path";

export const clean = async (pkg, pathName) => {
    if (!pkg) throw new Error("No package.json provided");
    fs.rmSync(path.resolve(pathName), {
        recursive: true,
        force: true,
    });
};
