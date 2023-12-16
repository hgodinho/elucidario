import path from "path";
import * as unist from "@elucidario/pkg-unist";
import { parseNodeValue, isPubGenNodeValue, mdToMdast } from "../../utils";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import { visit } from "unist-util-visit";
import { Console } from "@elucidario/pkg-console";

const countParser = (treeOptions) => {
    const { publication, lang, assets, version, pkg, ...extra } = treeOptions;

    const console = new Console(pkg);

    // default docxProcessor to pandoc while we don't implement remark-docx.
    let docxProcessor = "pandoc";
    if (typeof extra.docxProcessor !== "undefined")
        docxProcessor = extra.docxProcessor;

    const labels = {
        images: "Imagem",
        tables: "Tabela",
        figures: "Figura",
        charts: "Quadro",
    };

    return (tree, file) => {
        visit(tree, "text", async (node) => {
            if (!isPubGenNodeValue(node.value)) return;

            const { action, type, options } = parseNodeValue(node.value);

            if (action !== "count") return;

            if (assets.hasOwnProperty(type) === false) assets[type] = [];
            assets[type].push(options.legend);

            const paragraph = mdToMdast(options.legend, { reduce: true });

            // insert prefix on first position of children.
            const prefix = unist.text(
                `${labels[type]} ${assets[type].length}: `,
            );
            if (!paragraph[0].hasOwnProperty("children")) {
                paragraph.unshift(prefix);
            } else {
                paragraph[0].children.unshift(prefix);
            }
            node.type = "paragraph";
            node.children = paragraph;
        });
    };
};

export default countParser;
