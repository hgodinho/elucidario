import path from "path";
import fs from "fs";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { Console } from "@elucidario/pkg-console";
import { readContents } from "@elucidario/pkg-schema-doc";

import { getPaths } from "./getPaths.js";
import { pubGenRemarkProcessor } from "./remark/processor.js";
import { engine } from "./reference/csl-engine.js";

const paths = getPaths();

const build = async (publication, console) => {
    const pubGenJson = JSON.parse(
        fs.readFileSync(
            path.resolve(paths.publications, publication, "pub-gen.json")
        )
    );

    const distPath = path.resolve(paths.publications, publication, "dist");
    fs.existsSync(distPath) || fs.mkdirSync(distPath);

    const contentPath = path.resolve(
        paths.publications,
        publication,
        "content"
    );

    pubGenJson.languages.map(async (lang) => {
        const languageContentPath = path.resolve(contentPath, lang);
        const mdContent = readContents(languageContentPath, "md");

        fs.existsSync(path.resolve(distPath, lang)) ||
            fs.mkdirSync(path.resolve(distPath, lang));

        try {
            await Promise.all(
                Object.entries(mdContent).map(async ([name, content]) => {
                    const newFile = await pubGenRemarkProcessor(content, {
                        pubGen: {
                            publication,
                            lang,
                            style: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt",
                            path: languageContentPath,
                        },
                    });
                    fs.writeFileSync(
                        path.resolve(distPath, lang, `${name}.md`),
                        newFile.value
                    );
                }),
                buildReferences(distPath, lang, publication, console)
            );
        } catch (error) {
            console.log({ error }, { defaultLog: true, type: "error" });
            throw error;
        }
    });
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

        await build(publication, console);
        if (args.watch) {
            console.log("Watching changes...");
            fs.watch(
                path.resolve(paths.publications, publication, "content"),
                { recursive: true },
                async (eventType, filename) => {
                    console.log(`${eventType}: ${filename}`);
                    await build(publication, console);
                }
            );
            fs.watch(
                path.resolve(paths.publications, publication, "references"),
                { recursive: true },
                async (eventType, filename) => {
                    console.log(`${eventType}: ${filename}`);
                    await build(publication, console);
                }
            );
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const buildReferences = async (distPath, lang, publication, console) => {
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

        const citeproc = await engine(
            references,
            lang,
            "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt"
        );
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
        console.log("References built");
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
        throw error;
    }
};
