import path from "path";
import * as unist from "@elucidario/pkg-unist";
import { parseNodeValue, isPubGenNodeValue, mdToMdast } from "../../utils";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import parser from "parser-front-matter";
import { visit } from "unist-util-visit";
import { Console } from "@elucidario/pkg-console";

const mermaidParser = (treeOptions) => {
    const { publication, lang, assets, version, pkg, ...extra } = treeOptions;

    // default docxProcessor to pandoc while we don't implement remark-docx.
    let docxProcessor = "pandoc";
    if (typeof extra.docxProcessor !== "undefined")
        docxProcessor = extra.docxProcessor;

    const console = new Console(pkg);

    return (tree, file) => {
        const parsed = [];

        visit(tree, "text", async (node, index, parent) => {
            if (!isPubGenNodeValue(node.value)) return;

            const { action, filePath, fileOptions } = parseNodeValue(
                node.value,
            );

            if (action !== "mermaid") return;

            const mermaidData = readFile({
                filePath: path.resolve(
                    getPaths().publications,
                    publication,
                    "content",
                    lang,
                    filePath,
                ),
                ext: "md",
            }).content;

            let { data, content } = parser.parseSync(mermaidData);

            let {
                filename,
                source,
                title,
                width,
                theme,
                background,
                format,
                type,
            } = data;

            const mermaidOptions = {
                filename,
                loc: JSON.stringify(
                    path.resolve(
                        getPaths().publications,
                        publication,
                        "files",
                        "generated",
                    ),
                ),
                width,
                theme,
                background,
                format,
            };

            let pandocOptions = "{.mermaid ";
            pandocOptions += Object.keys(mermaidOptions)
                .map((key) =>
                    typeof mermaidOptions[key] !== "undefined"
                        ? `${key}=${mermaidOptions[key]}`
                        : false,
                )
                .filter(Boolean)
                .join(" ");
            pandocOptions += "}";

            content = content
                .replace(/```mermaid\r\n/, "")
                .replace(/```\r\n/, "")
                .trim();

            const codeAst = unist.code(
                content,
                docxProcessor === "pandoc" ? pandocOptions : "mermaid",
            );

            node.type = "code";
            node.value = codeAst.value;
            node.lang = codeAst.lang;

            parsed.push({
                node,
                parent,
                index,
                title,
                source,
            });
        });

        parsed.forEach((el) => {
            // find index of el.parent in tree
            const parentIndex = tree.children.findIndex(
                (child) =>
                    child.position.start.line === el.parent.position.start.line,
            );

            // insert title node before el.node in tree.
            tree.children.splice(
                parentIndex,
                0,
                unist.paragraph(mdToMdast(el.title, { reduce: true })),
            );

            // insert source node after el.node in tree.
            tree.children.splice(
                parentIndex + 2,
                0,
                unist.paragraph(mdToMdast(el.source, { reduce: true })),
            );
        });
    };
};

export default mermaidParser;
