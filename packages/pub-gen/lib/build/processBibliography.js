import path from "path";
import { engine } from "../reference/csl-engine.js";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { toMD, heading } from "@elucidario/pkg-docusaurus-md";
import { getPaths, readFile, parseFile } from "@elucidario/pkg-paths";

/**
 * Build References
 * @param {Object} args
 * @param {string} args.publication
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.title
 * @param {string} args.filePath
 * @param {string} args.index
 */
export async function processBibliography(args) {
    try {
        if (typeof args === "undefined") throw new Error("`args` is undefined");

        const {
            publication,
            lang,
            style,
            title,
            filePath,
            index = true,
        } = args;

        if (typeof publication === "undefined")
            throw new Error("`publication` is undefined");

        if (typeof lang === "undefined") throw new Error("`lang` is undefined");

        if (typeof style === "undefined")
            throw new Error("`style` is undefined");

        if (style.hasOwnProperty("csl") === false)
            throw new Error("`csl` property from `style` is undefined");

        let pageTitle = "";
        if (index === true) {
            if (typeof title === "undefined")
                throw new Error("`title` is undefined");
            pageTitle = title;
        } else if (
            typeof index === "object" &&
            index.hasOwnProperty("bibliography")
        ) {
            pageTitle = index.bibliography;
        } else if (
            typeof index === "object" &&
            !index.hasOwnProperty("bibliography")
        ) {
            throw new Error(
                "`bibliography` property from `index` is undefined",
            );
        }

        const references = readFile(
            path.resolve(
                getPaths().publications,
                publication,
                "references",
                "index.json",
            ),
        ).value.items.map((item) => {
            let refPath = item.path.replace("<references>/", "");
            refPath = path.resolve(getPaths().references, refPath);
            return readFile(refPath).value;
        });

        const citeproc = await engine(references, lang, style.csl);

        citeproc.processCitationCluster(
            {
                properties: {
                    noteIndex: 1,
                },
                citationItems: references,
            },
            [],
            [],
        );

        const bibliography = citeproc.makeBibliography();
        const bibliographyMD = NodeHtmlMarkdown.translate(
            bibliography[1].join(""),
        );

        const file = parseFile({
            name: filePath.split("/").pop(),
            path: path.resolve(
                getPaths().publications,
                publication,
                "dist",
                lang,
                `${filePath}.md`,
            ),
            value: toMD([heading(1, pageTitle), bibliographyMD]),
        });
        return file;
    } catch (error) {
        throw error;
    }
}
