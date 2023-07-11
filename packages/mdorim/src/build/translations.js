import path from "path";
import { readContents } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";
import { writeFile } from "./writeFile.js";

/**
 * Build translations
 */
export const buildTranslations = async (pkg, __dirname, outStatic) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let translations = {};
    try {
        translations = readContents({
            dirPath: path.join(__dirname, "translations"),
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
            "translations.json",
            JSON.stringify(translations, null, 4),
            pkg
        );
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
