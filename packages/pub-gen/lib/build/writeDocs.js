import path from "path";
import fs from "fs";

import { pubGenRemarkProcessor } from "../remark/processor.js";
import { readContents, getPaths } from "@elucidario/pkg-paths";
import { toMD, heading, list, table } from "@elucidario/pkg-docusaurus-md";

const paths = getPaths();

/**
 *  Merge MD
 * @param {string|object} content
 * @returns {string}
 */
export const mergeMd = (content) => {
    if (typeof content === "object") {
        return toMD([
            Object.entries(content).reduce((acc, [title, content]) => {
                if (typeof content === "string") {
                    return toMD([acc, content]);
                } else if (typeof content === "object") {
                    const nestedContent = mergeMd(content);
                    return toMD([acc, nestedContent]);
                } else {
                    return toMD([acc]);
                }
            }, ""),
        ]);
    }
    return toMD([content]);
};

const writeIndexFiles = async ({
    index,
    publication,
    lang,
    srcPath,
    style,
    version,
}) => {
    const build = ({
        type,
        title,
        items,
        indexFile = "table",
        paginate = true,
    }) => {
        const header = heading(1, title.toUpperCase());

        // const body = list(items, true);
        const body =
            "table" === indexFile
                ? table({
                      headers: paginate ? ["", "", ""] : ["", ""],
                      rows: items.map((item, i) => {
                          const number = i + 1;
                          return paginate ? [number, item, ""] : [number, item];
                      }),
                  })
                : list(items, true);

        const md = toMD([header, body]);

        fs.writeFileSync(
            path.resolve(
                paths.publications,
                publication,
                "dist",
                lang,
                `${type}.md`
            ),
            md
        );
    };

    // attachmentIndex
    Object.entries(index).map(async ([type, files]) => {
        if (files.length === 0) return;

        switch (type) {
            case "images":
                build({
                    type,
                    title: "Lista de imagens",
                    items: files,
                });
                break;
            case "tables":
                build({
                    type,
                    title: "Lista de tabelas",
                    items: files,
                });
                break;
            case "figures":
                build({
                    type,
                    title: "Lista de figuras",
                    items: files,
                });
                break;
            case "charts":
                build({
                    type,
                    title: "Lista de quadros",
                    items: files,
                });
                break;
        }
    });

    // acronyms and abbreviations
    if (fs.existsSync(path.resolve(srcPath, "acronyms.json"))) {
        const acronyms = JSON.parse(
            fs.readFileSync(path.resolve(srcPath, "acronyms.json"))
        );
        const sortedAcronyms = Object.entries(acronyms).sort((a, b) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
        });
        build({
            type: "acronyms",
            title: "Lista de siglas e abreviaturas",
            items: sortedAcronyms.map(([acronym, description], i) => {
                if (i === sortedAcronyms.length - 1) {
                    return `${acronym} - ${description}.`;
                } else {
                    return `${acronym} - ${description};`;
                }
            }),
            indexFile: "table",
            paginate: false,
        });
    } else {
        console.log("acronyms.json does not exist");
    }
};

/**
 * Write Docs
 * @param {Object} args
 * @param {string} args.publication
 * @param {string} args.srcPath
 * @param {string} args.distPath
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.version
 * @param {Object} args.attachmentIndex
 * @returns {Promise<Array<Object>>}
 */
export const writeDocs = async ({
    publication,
    lang,
    style,
    version,
    attachmentIndex,
    srcPath,
    distPath,
}) => {
    // Cria documentação
    const mdContent = readContents({
        dirPath: srcPath,
        extensions: "md",
        log: false,
    });

    try {
        return await Promise.all(
            Object.entries(mdContent).map(async ([name, content]) => {
                // If content is an object, it's a multi-file content, so we need to join it
                let Path = path.resolve(srcPath);
                content = mergeMd(content);
                const newFile = await pubGenRemarkProcessor(content, {
                    pubGen: {
                        publication,
                        lang,
                        style,
                        path: Path,
                        index: attachmentIndex,
                        distPath: path.resolve(
                            paths.publications,
                            publication,
                            "files",
                            "generated",
                            version
                        ),
                    },
                });
                fs.writeFileSync(
                    path.resolve(distPath, lang, `${name}.md`),
                    newFile.value
                );

                return {
                    type: "md",
                    when: new Date().toLocaleString(),
                };
            }),

            writeIndexFiles({
                index: attachmentIndex,
                publication,
                lang,
                srcPath,
                style,
                version,
            })
        );
    } catch (error) {
        throw new Error(`error writing docs at writeDocs: ${error}`);
    }
};
