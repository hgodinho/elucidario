import path from "path";
import { getPaths, readFile } from "@elucidario/pkg-paths";

const schemaParser = async (options) => {
    const { filePath, fileOptions, publication, lang, docxProcessor } = options;

    const schemaData = readFile({
        filePath: path.resolve(
            getPaths().publications,
            publication,
            "content",
            lang,
            filePath
        ),
        ext: "json",
    }).content;

    return await Promise.resolve(
        markdownTable(schemaData, fileOptions.emptyValue || "-")
    );
};

export default schemaParser;
