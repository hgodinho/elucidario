import path from "path";
import { readContents, createFile } from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";

/**
 * Build examples
 */
export const buildExamples = async (pkg, __dirname, outStatic) => {
    if (!pkg) throw new Error("No package.json provided");
    const console = new Console(pkg);
    let examples = [];
    try {
        examples = readContents({
            dirPath: path.join(__dirname, "examples"),
            extensions: ["json"],
            index: false,
            package: pkg,
        });
    } catch (err) {
        throw new Error(err);
    }
    try {
        examples.map((example) => {
            createFile(
                {
                    filePath: example.path.replace("src", "static/mdorim"),
                    ext: "json",
                },
                example.value,
            );
        });
    } catch (err) {
        console.error({ message: err, defaultLog: true, title: "Error" });
        throw new Error(err);
    }
};
