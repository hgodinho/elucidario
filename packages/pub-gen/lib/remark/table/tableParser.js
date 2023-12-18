import path from "path";
import { visit } from "unist-util-visit";
import { parseNodeValue, isPubGenNodeValue } from "../../utils.js";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import * as unist from "@elucidario/pkg-unist";
import * as tableschema from "tableschema";
import { SchemaValidator } from "@elucidario/pkg-schema-validator";
import { Console } from "@elucidario/pkg-console";

function tableParser(treeOptions) {
    const { publication, lang, assets, version, pkg, ...extra } = treeOptions;

    const console = new Console(pkg);

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
    ).content;

    return (tree, file) => {
        visit(tree, "text", async (node) => {
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
            ).content;

            const valid = schemaValidator.validate({
                schema: tableSchema,
                data: tableFile,
            });

            if (!valid) {
                console.error(schemaValidator.getErrors());
                throw schemaValidator.getErrors();
            }

            const { data, title, note, fields } = tableFile;

            const tableAst = [
                title ? unist.bold([unist.text(title)]) : false,
                title ? unist.breakNode() : false,
                title ? unist.breakNode() : false,
                unist.table(
                    "left",
                    data.map((row) => {
                        return unist.tableRow(
                            row.map((cell) => {
                                return unist.tableCell([unist.text(cell)]);
                            }),
                        );
                    }),
                ),
                note ? unist.breakNode() : false,
                note ? unist.breakNode() : false,
                note
                    ? unist.paragraph([
                          unist.bold([unist.text(note.label)]),
                          unist.text(": "),
                          unist.text(note.content),
                      ])
                    : false,
                unist.breakNode(),
                unist.breakNode(),
            ].filter(Boolean);

            node.type = "paragraph";
            node.children = tableAst;

            delete node.value;
        });
    };
}

export default tableParser;
