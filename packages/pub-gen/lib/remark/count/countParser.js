import * as unist from "@elucidario/pkg-unist";
import { parseNodeValue, isPubGenNodeValue, mdToMdast } from "../../utils.js";
import { visit } from "unist-util-visit";
import { Console } from "@elucidario/pkg-console";

const countParser = (treeOptions) => {
    const { publication, lang, assets, assetsTitles, version, pkg, ...extra } =
        treeOptions;

    const console = new Console(pkg);

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
                `${assetsTitles[type]} ${assets[type].length}: `,
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
