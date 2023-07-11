import fs from "fs";
import path from "path";
import { Console } from "@elucidario/pkg-console";

export const writeFile = (pathDir, name, file, pkg) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    if (!fs.existsSync(path.resolve(pathDir))) {
        fs.mkdirSync(path.resolve(pathDir), {
            recursive: true,
        });
    }
    const fileName = path.resolve(pathDir, name);
    fs.writeFile(fileName, file, (err) => {
        if (err)
            console.log(`There was an error: ${err}`, {
                type: "error",
                defaultLog: true,
            });
    });
    console.log(`Built: ${fileName}`, {
        type: "success",
        title: "File built",
    });
};
