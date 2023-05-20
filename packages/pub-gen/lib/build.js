import path from "path";
import fs from "fs";

import { pubGenRemarkProcessor } from "./remark/processor.js";

import { readContents } from "@elucidario/pkg-schema-doc";
import { updateDoc } from "@elucidario/pkg-md-to-gdoc";
import { getCredentials } from "./getCredentials.js";
import { getPaths } from "./getPaths.js";
import { Console } from "@elucidario/pkg-console";
const paths = getPaths();
import { engine } from "./reference/csl-engine.js";

import { NodeHtmlMarkdown } from "node-html-markdown";

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

        // const rootPath = path.resolve(__dirname, "..", "..");
        // const pubPath = path.resolve(rootPath, "publications", publication);

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

            await Promise.all(
                Object.entries(mdContent).map(async ([name, content]) => {
                    const newFile = await pubGenRemarkProcessor(content, {
                        pubGen: {
                            publication,
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
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const buildReferences = async (distPath, lang, publication, console) => {
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

    const citeproc = await engine(references);
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
    const bibliographyMD = NodeHtmlMarkdown.translate(bibliography[1].join(""));

    fs.writeFileSync(
        path.resolve(distPath, lang, "references.md"),
        bibliographyMD,
        "utf-8"
    );
    console.log("References built");
};
