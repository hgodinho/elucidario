import path from "path";
import { readContents } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
import { writeFile } from "./writeFile.js";

/**
 * Build mapping
 */
export const buildMapping = async (pkg, __dirname, outStatic) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let mapping = {};
    try {
        mapping = readContents({
            dirPath: path.join(__dirname, "mapping"),
            extensions: ["json"],
            index: false,
            package: pkg,
        });
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
    try {
        writeFile(
            path.resolve(outStatic),
            "mapping.json",
            JSON.stringify(mapping, null, 4),
            pkg
        );
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
