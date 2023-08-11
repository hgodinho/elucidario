import path from "path";
import fs from "fs";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { isEmpty } from "lodash-es";

import { Console } from "@elucidario/pkg-console";
import { readContents, build } from "@elucidario/pkg-paths";

import { getPaths } from "./getPaths.js";
import { pubGenRemarkProcessor } from "./remark/processor.js";
import { engine } from "./reference/csl-engine.js";
import { toMD } from "@elucidario/pkg-docusaurus-md";

const paths = getPaths();

/**
 * Write Image
 * @param {Object} args
 * @param {string} args.srcPath
 * @param {string} args.publication
 * @param {string} args.lang
 * @param {Console} args.console
 */
const writeImage = async ({ srcPath, publication, lang, console }) => {
    if (isEmpty(srcPath) || typeof srcPath === "object") return;
    try {
        const imagePath = path.parse(srcPath);
        const distPath = path.resolve(
            paths.publications,
            publication,
            "dist",
            lang,
            imagePath.base
        );
        fs.copyFileSync(srcPath, distPath);
        console.log(
            {
                type: "img",
                when: new Date().toLocaleString(),
            },
            {
                defaultLog: true,
                title: `Image ${imagePath.base} copied!`,
                type: "success",
            }
        );
    } catch (error) {
        throw new Error(`error writing image at writeImage: ${error}`);
    }
};

/**
 * Write Images
 * @param {Object} args
 * @param {string} args.srcPath
 * @param {string} args.publication
 * @param {string} args.lang
 * @param {Console} args.console
 * @returns {Promise<Array<Object>>}
 */
const writeImages = async ({ srcPath, publication, lang, console }) => {
    const imageContent = readContents({
        dirPath: srcPath,
        index: false,
        returnType: "path",
        extensions: ["png", "jpg", "jpeg", "gif"],
        names: true,
        log: false,
    });

    try {
        return await Promise.all(
            Object.entries(imageContent).map(async ([name, Path]) => {
                if (typeof Path === "object") {
                    return await Promise.all(
                        Object.entries(Path).map(async ([key, imgPath]) => {
                            return {
                                [key]: await writeImage({
                                    srcPath: imgPath,
                                    publication,
                                    lang,
                                    console,
                                }),
                            };
                        })
                    );
                }

                return {
                    [name]: await writeImage({
                        srcPath: Path,
                        publication,
                        lang,
                        console,
                    }),
                };
            })
        );
    } catch (error) {
        throw new Error(`error writing images at writeImages: ${error}`);
    }
};

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

/**
 * Write Docs
 * @param {Object} args
 * @param {string} args.distPath
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.publication
 * @param {string} args.version
 * @param {string} args.srcPath
 * @param {string} args.distPath
 * @returns {Promise<Array<Object>>}
 */
const writeDocs = async ({
    publication,
    lang,
    style,
    version,
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
        const index = {
            images: [],
            tables: [],
            figures: [],
            charts: [],
        };
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
                        index,
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
            console.log({ index }, { defaultLog: true, type: "info" })
        );
    } catch (error) {
        throw new Error(`error writing docs at writeDocs: ${error}`);
    }
};

/**
 * Build Docs
 * @param {Object} args
 * @param {string} args.distPath
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.publication
 * @param {Console} args.console
 * @param {string} args.version
 */
const buildDocs = async ({
    distPath,
    lang,
    style,
    publication,
    console,
    version,
}) => {
    const srcPath = path.resolve(
        paths.publications,
        publication,
        "content",
        lang
    );

    fs.existsSync(path.resolve(distPath, lang)) ||
        fs.mkdirSync(path.resolve(distPath, lang), { recursive: true });

    // se não houver um index.json no srcPath,
    // cria um index.json com os nomes dos arquivos
    // se houver, adiciona references ao index.json
    if (fs.existsSync(path.resolve(srcPath, "index.json"))) {
        const index = JSON.parse(
            fs.readFileSync(path.resolve(srcPath, "index.json"))
        );

        if (!index.files.includes("references")) index.files.push("references");

        index.files = index.files.map((file) => {
            const filePath = path.parse(file);
            if (filePath.ext === "") return `${file}.md`;
            return file;
        });

        fs.writeFileSync(
            path.resolve(distPath, lang, "index.json"),
            JSON.stringify(index)
        );
    } else {
        fs.writeFileSync(
            path.resolve(distPath, lang, "index.json"),
            JSON.stringify({
                files: [
                    fs.readdirSync(path.resolve(distPath, lang)),
                    "references",
                ],
            })
        );
    }

    // Cria documentação
    const docs = await writeDocs({
        srcPath,
        publication,
        lang,
        style,
        version,
        distPath,
    });

    // copia imagens
    const images = await writeImages({ publication, srcPath, lang, console });
};

/**
 * Build References
 * @param {Object} args
 * @param {string} args.distPath
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.publication
 * @param {Console} args.console
 * @param {string} args.version
 */
const buildReferences = async ({
    distPath,
    lang,
    style,
    publication,
    console,
}) => {
    try {
        const references = JSON.parse(
            fs.readFileSync(
                path.resolve(
                    paths.publications,
                    publication,
                    "references",
                    "index.json"
                )
            )
        ).items.map((item) => {
            let refPath = item.path.replace("<references>/", "");
            refPath = path.resolve(paths.references, refPath);
            return JSON.parse(fs.readFileSync(refPath, { encoding: "utf-8" }));
        });

        const citeproc = await engine(references, lang, style);

        citeproc.processCitationCluster(
            {
                properties: {
                    noteIndex: 1,
                },
                citationItems: references,
            },
            [],
            []
        );
        const bibliography = citeproc.makeBibliography();
        const bibliographyMD = NodeHtmlMarkdown.translate(
            bibliography[1].join("")
        );

        fs.writeFileSync(
            path.resolve(distPath, lang, "references.md"),
            bibliographyMD,
            "utf-8"
        );
        console.log(`References built using ${style} style!`);
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
        throw error;
    }
};

/**
 * Build Publication
 * @param {Object} args
 * @param {string} args.publication
 * @param {boolean} args.watch
 */
export const buildPublication = async (args) => {
    try {
        const { publication } = args;

        if (!publication) {
            throw new Error("Publication name is required");
        }
        const packageJson = JSON.parse(
            fs.readFileSync(
                path.resolve(paths.publications, publication, "package.json")
            )
        );
        const console = new Console(packageJson);

        const pubGenJson = JSON.parse(
            fs.readFileSync(
                path.resolve(paths.publications, publication, "pub-gen.json")
            )
        );

        await build(
            {
                package: packageJson,
                watch: args.watch,
                watchSrc: [
                    path.resolve(paths.publications, publication, "content"),
                    path.resolve(paths.publications, publication, "references"),
                    path.resolve(paths.references),
                ],
            },
            async (options) => {
                await Promise.all(
                    pubGenJson.publications.map(async (pub) => {
                        const distPath = path.resolve(
                            paths.publications,
                            publication,
                            "dist"
                        );
                        await buildDocs({
                            distPath,
                            lang: pub.language,
                            style: pub.style.name,
                            publication,
                            console,
                            version: packageJson.version,
                        });
                        await buildReferences({
                            distPath,
                            lang: pub.language,
                            style: pub.style.name,
                            publication,
                            console,
                        });
                    })
                );
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};
