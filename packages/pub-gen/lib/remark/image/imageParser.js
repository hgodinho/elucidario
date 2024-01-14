import path from "path";
import { hasHandlebars } from "../../utils.js";
import { getPaths } from "@elucidario/pkg-paths";
import { visit } from "unist-util-visit";
import { Console } from "@elucidario/pkg-console";

const imageParser = (treeOptions) => {
    const { publication, lang, assets, version, pkg, ...extra } = treeOptions;

    const console = new Console(pkg);

    // default docxProcessor to pandoc while we don't implement remark-docx.
    let docxProcessor = "pandoc";
    if (typeof extra.docxProcessor !== "undefined")
        docxProcessor = extra.docxProcessor;

    return (tree, file) => {
        visit(tree, "image", (node) => {
            if (hasHandlebars(node.url)) {
                const handle = node.url.match(/{{(.*)}}/)[1];
                const url = path.resolve(
                    getPaths().publications,
                    publication,
                    "files",
                    handle,
                    node.url
                        .split("/")
                        .filter((part) => !part.includes(handle))
                        .join("/"),
                );
                node.url = url;
            }
        });
    };
};

export default imageParser;
