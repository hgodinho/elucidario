import path from "path";
import * as unist from "@elucidario/pkg-unist";
import { parseNodeValue, isPubGenNodeValue } from "../../utils.js";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import { visit } from "unist-util-visit";
import { Console } from "@elucidario/pkg-console";

const codeParser = (treeOptions) => {
    const { publication, lang, assets, version, pkg, ...extra } = treeOptions;

    const console = new Console(pkg);

    // default docxProcessor to pandoc while we don't implement remark-docx.
    let docxProcessor = "pandoc";
    if (typeof extra.docxProcessor !== "undefined")
        docxProcessor = extra.docxProcessor;

    return (tree, file) => {
        visit(tree, "text", async (node) => {
            if (!isPubGenNodeValue(node.value)) return;

            const { action, filePath, fileOptions } = parseNodeValue(
                node.value,
            );

            if (action !== "code") return;

            const codeData = readFile(
                path.resolve(
                    getPaths().publications,
                    publication,
                    "content",
                    lang,
                    filePath,
                ),
            ).value;

            const { ext } = path.parse(filePath);

            const codeAst = unist.code(codeData, ext.replace(".", ""));

            node.type = "code";
            node.value =
                ext === ".json"
                    ? JSON.stringify(codeAst.value, null, 4)
                    : codeAst.value;
            node.lang = codeAst.lang;
            node.meta = codeAst.meta;
        });
    };
};

export default codeParser;
