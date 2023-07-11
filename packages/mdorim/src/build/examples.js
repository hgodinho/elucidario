import path from "path";
import { readContents } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
import { writeFile } from "./writeFile.js";

/**
 * Build examples
 */
export const buildExamples = async (pkg, __dirname, outStatic) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let examples = {};
    try {
        examples = readContents({
            dirPath: path.join(__dirname, "examples"),
            extensions: ["json"],
            index: false,
            package: pkg,
        });
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
    try {
        Object.entries(examples).map(([folderName, files]) => {
            Object.entries(files).map(([fileName, file]) => {
                writeFile(
                    path.resolve(outStatic, "examples", folderName),
                    `${fileName}.json`,
                    JSON.stringify(file, null, 4),
                    pkg
                );
            });
        });
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
