import path from "path";
import { visit } from "unist-util-visit";
import { parseNodeValue, isPubGenNodeValue } from "../utils";
import { getPaths, readFile } from "@elucidario/pkg-paths";
import parser from "parser-front-matter";
import { replaceRegexHandlebars } from "../utils";

import mermaidParser from "./mermaid/mermaidParser.js";
// import tableParser from "./table/tableParser.js";

export default function pubGenText(options) {
    const { publication, lang, style } = options;

    // default docxProcessor to pandoc while we don't implement remark-docx
    let docxProcessor = "pandoc";
    if (typeof options.docxProcessor !== "undefined")
        docxProcessor = options.docxProcessor;

    return async function transformer(tree) {
        const mermaidNodes = [];
        const tablesNodes = [];
        const schemaNodes = [];
        const codesNodes = [];
        const embedNodes = [];
        const counterNodes = [];

        visit(tree, "text", (node) => {
            if (!isPubGenNodeValue(node.value)) return;

            const { action, filePath, fileOptions } = parseNodeValue(
                node.value
            );

            /**
             * mermaid
             */
            if ("mermaid" === action) {
                mermaidNodes.push({
                    action,
                    filePath,
                    fileOptions,
                    publication,
                    lang,
                    style,
                    node,
                    docxProcessor,
                });
            }

            /**
             * Table
             */
            // if ("table" === action) {
            //     tablesNodes.push({
            //         action,
            //         filePath,
            //         fileOptions,
            //         publication,
            //         lang,
            //         style,
            //         node,
            //         docxProcessor,
            //     });
            // }

            /**
             * Schema
             */
            if ("schema" === action) {
                schemaNodes.push({
                    action,
                    filePath,
                    fileOptions,
                    publication,
                    lang,
                    style,
                    node,
                    docxProcessor,
                });
            }

            /**
             * Code
             * {{code:./src/...}}
             */
            if ("code" === action) {
                codesNodes.push({
                    action,
                    filePath,
                    fileOptions,
                    publication,
                    lang,
                    style,
                    node,
                    docxProcessor,
                });
            }

            /**
             * Embed
             * {{embed:./src/...}}
             */
            if ("embed" === action) {
                embedNodes.push({
                    action,
                    filePath,
                    fileOptions,
                    publication,
                    lang,
                    style,
                    node,
                    docxProcessor,
                });
            }

            /**
             * Counter
             * {{count:{{type}}=./src/...;legend=...}}
             */
            if ("count" === action) {
                counterNodes.push({
                    action,
                    filePath,
                    fileOptions,
                    publication,
                    lang,
                    style,
                    node,
                    docxProcessor,
                });
            }
        });

        const mermaidPromises = await Promise.all(
            mermaidNodes.map(async (options) => {
                const parsed = await mermaidParser(options);
                const { node } = options;
                node.type = "html";
                node.value = parsed;
            })
        );

        // const tablesPromises = await Promise.all(
        //     tablesNodes.map(async (options) => {
        //         const parsed = await tableParser(options);
        //         const { node } = options;
        //         node.type = "html";
        //         node.value = parsed;
        //     })
        // );

        // const schemaPromises = await Promise.all(
        //     schemaNodes.map(async (options) => {
        //         const parsed = await schemaParser(options);
        //         const { node } = options;
        //         node.type = "html";
        //         node.value = parsed;
        //     })
        // );
    };
}
