import path from "path";
import fs from "fs";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { Console } from "@elucidario/pkg-console";
import { readContents, build } from "@elucidario/pkg-paths";

import { getPaths } from "./getPaths.js";
import { pubGenRemarkProcessor } from "./remark/processor.js";
import { engine } from "./reference/csl-engine.js";

const paths = getPaths();

const buildDocs = async ({
    distPath,
    lang,
    style,
    publication,
    console,
    version,
}) => {
    fs.existsSync(distPath) || fs.mkdirSync(distPath);

    const contentPath = path.resolve(
        paths.publications,
        publication,
        "content",
        lang
    );

    const mdContent = readContents({
        dirPath: contentPath,
        extensions: "md",
        log: false,
    });

    const imageContent = readContents({
        dirPath: contentPath,
        index: false,
        extensions: ["png", "jpg", "jpeg", "gif"],
        names: true,
        log: false,
    });

    fs.existsSync(path.resolve(distPath, lang)) ||
        fs.mkdirSync(path.resolve(distPath, lang));

    if (fs.existsSync(path.resolve(contentPath, "index.json"))) {
        const index = JSON.parse(
            fs.readFileSync(path.resolve(contentPath, "index.json"))
        );

        if (!index.files.includes("references")) index.files.push("references");

        fs.writeFileSync(
            path.resolve(distPath, lang, "index.json"),
            JSON.stringify(index)
        );
    } else {
        fs.writeFileSync(
            path.resolve(distPath, lang, "index.json"),
            JSON.stringify({
                files: [...Object.keys(mdContent), "references"],
            })
        );
    }

    const log = {};

    // Cria documentação
    try {
        await Promise.all(
            Object.entries(mdContent).map(async ([name, content]) => {
                let srcPath = contentPath;

                // If content is an object, it's a multi-file content, so we need to join it
                if (typeof content === "object") {
                    content = Object.values(content).join("\n\n");
                    srcPath = path.resolve(contentPath, name);
                }

                const newFile = await pubGenRemarkProcessor(content, {
                    pubGen: {
                        publication,
                        lang,
                        style,
                        path: srcPath,
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
                log[new Date().toLocaleString()] = {
                    type: "md",
                    name,
                };
            })
        );
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
        throw error;
    }

    // copia imagens
    try {
        await Promise.all(
            Object.entries(imageContent).map(async ([name, imgPath]) => {
                if (typeof imgPath === "object") {
                    return;
                }
                const imagePath = path.parse(imgPath);
                const srcPath = path.resolve(imgPath);
                const distPath = path.resolve(
                    paths.publications,
                    publication,
                    "dist",
                    lang,
                    imagePath.base
                );
                fs.copyFileSync(srcPath, distPath);
                log[new Date().toLocaleString()] = {
                    type: "img",
                    name,
                };
            })
        );
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
        throw error;
    }

    console.log(log, {
        defaultLog: true,
        title: `Docs built using ${style} style!`,
    });
};

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
