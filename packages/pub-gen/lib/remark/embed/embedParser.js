import path from "path";
import { parseNodeValue, isPubGenNodeValue } from "../../utils.js";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import { visit } from "unist-util-visit";
import { Console } from "@elucidario/pkg-console";

const embedParser = (treeOptions) => {
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

            if (action !== "embed") return;

            const embedData = readFile(
                path.resolve(
                    getPaths().publications,
                    publication,
                    "content",
                    lang,
                    filePath,
                ),
            ).value;

            node.type = "html";
            node.value = embedData;
        });
    };
};

export default embedParser;
