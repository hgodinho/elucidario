import path from "path";
import { readContents, createFile } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";

/**
 * Build translations
 */
export const buildTranslations = async (pkg, __dirname, mdorimStatic) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let translations = {};
    try {
        const translationsFiles = readContents({
            dirPath: path.join(__dirname, "translations"),
            extensions: ["json"],
            index: false,
            package: pkg,
        });
        translationsFiles.forEach((translation) => {
            translations[translation.name] = translation.value;
        });
        createFile(
            {
                filePath: path.resolve(mdorimStatic, "translations.json"),
                ext: "json",
            },
            translations,
        );
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
