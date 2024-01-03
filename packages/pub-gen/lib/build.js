import path from "path";
import fs from "fs";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { Console } from "@elucidario/pkg-console";
import { build, createDir, getPaths } from "@elucidario/pkg-paths";

import { engine } from "./reference/csl-engine.js";
import { toMD, heading } from "@elucidario/pkg-docusaurus-md";
import writeImages from "./build/writeImages.js";
import { writeDocs } from "./build/writeDocs.js";

const paths = getPaths();

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

    createDir(path.resolve(distPath, lang));

    const attachmentIndex = {
        images: [],
        tables: [],
        figures: [],
        charts: [],
    };

    // Cria documentação
    const docs = await writeDocs({
        srcPath,
        publication,
        lang,
        style,
        version,
        attachmentIndex,
        distPath,
    });

    // copia imagens
    /**
     * esse nao tem mais necessidade, pois as imagens e outros arquivos estáticos
     * devem ser postos na pasta files > static da publicação.
     */
    const images = await writeImages({ publication, srcPath, lang, console });

    // se não houver um index.json no srcPath,
    // cria um index.json com os nomes dos arquivos
    // se houver, adiciona references ao index.json
    if (fs.existsSync(path.resolve(srcPath, "index.json"))) {
        const index = JSON.parse(
            fs.readFileSync(path.resolve(srcPath, "index.json"))
        );

        const attachmentKeys = Object.keys(attachmentIndex)
            .map((key) => {
                if (attachmentIndex[key].length > 0) return key;
            })
            .filter((key) => key !== undefined);

        if (fs.existsSync(path.resolve(srcPath, "acronyms.json"))) {
            attachmentKeys.push("acronyms");
        }

        let position = 0;
        let offset = 2;
        if (attachmentKeys.length > 0) {
            attachmentKeys.forEach((key) => {
                if (!index.files.includes(key))
                    index.files.splice(position + offset, 0, key);
                position++;
            });
        }

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

        const data = toMD([
            heading(1, "Referências".toUpperCase()),
            bibliographyMD,
        ]);

        fs.writeFileSync(
            path.resolve(distPath, lang, "references.md"),
            data,
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
