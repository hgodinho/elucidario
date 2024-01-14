import path from "path";
import { visit } from "unist-util-visit";
import {
    parseNodeValue,
    isPubGenNodeValue,
    mdToMdast,
    hasCitation,
    legendAst,
} from "../../utils.js";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import * as unist from "@elucidario/pkg-unist";
import { SchemaValidator } from "@elucidario/pkg-schema-validator";

function tableParser(treeOptions) {
    const { publication, lang, assets, version, ...extra } = treeOptions;

    // default docxProcessor to pandoc while we don't implement remark-docx
    let docxProcessor = "pandoc";
    if (typeof extra.docxProcessor !== "undefined")
        docxProcessor = extra.docxProcessor;

    const schemaValidator = new SchemaValidator();

    const tableSchema = readFile(
        path.resolve(
            getPaths().packages,
            "pub-gen",
            "static",
            "pub-gen",
            "schemas",
            "table-schema.json",
        ),
    ).value;

    return (tree, file) => {
        const parsed = [];

        visit(tree, "text", async (node, index, parent) => {
            if (!isPubGenNodeValue(node.value)) return;

            const { action, filePath, fileOptions, options, type } =
                parseNodeValue(node.value);

            if (action !== "table") return;

            const tableFile = readFile(
                path.resolve(
                    getPaths().publications,
                    publication,
                    "content",
                    lang,
                    filePath,
                ),
            ).value;

            const valid = schemaValidator.validate({
                schema: tableSchema,
                data: tableFile,
            });

            if (!valid) {
                console.error(schemaValidator.getErrors());
                throw schemaValidator.getErrors();
            }

            const { data, title, note, fields } = tableFile;

            const tableAst = unist.table(
                "left",
                data.map((row) => {
                    return unist.tableRow(
                        row.map((cell) => {
                            return unist.tableCell(mdToMdast(cell));
                        }),
                    );
                }),
            );

            node.type = tableAst.type;
            node.children = tableAst.children;
            node.align = tableAst.align;
            delete node.value;

            parsed.push({
                node,
                parent,
                index,
                title,
                note,
                fields,
            });
        });

        try {
            parsed.map(({ node, parent, index, title, note, fields }) => {
                const parentIndex = tree.children.findIndex(
                    (child) =>
                        child.hasOwnProperty("position") &&
                        parent.hasOwnProperty("position") &&
                        child.position.start.line ===
                            parent.position.start.line,
                );

                if (typeof title !== "undefined") {
                    tree.children.splice(
                        parentIndex,
                        0,
                        unist.paragraph([unist.text(title)]),
                    );
                }

                if (typeof note !== "undefined") {
                    tree.children.splice(
                        parentIndex + 2,
                        0,
                        unist.paragraph([
                            unist.text(note.label),
                            unist.text(": "),
                            ...legendAst(note.content),
                        ]),
                    );
                }
            });
        } catch (e) {
            console.error(e);
        }
    };
}

export default tableParser;
