import { engine } from "./reference/csl-engine.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { toMD, heading } from "@elucidario/pkg-docusaurus-md";

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
export const processReferences = async ({
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
