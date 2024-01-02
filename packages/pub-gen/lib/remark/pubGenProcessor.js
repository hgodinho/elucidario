import { unified } from "unified";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";
import unifiedPrettier from "unified-prettier";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import { citePlugin } from "@benrbray/remark-cite";
import { Console } from "@elucidario/pkg-console";

import tableParser from "./table/tableParser.js";
import codeParser from "./code/codeParser.js";
import embedParser from "./embed/embedParser.js";
import citeParser from "./cite/citeParser.js";
import countParser from "./count/countParser.js";
import mermaidParser from "./mermaid/mermaidParser.js";

export const pubGenProcessor = async (content, options) => {
    if (!content) return Promise.reject(new Error("No content provided."));
    if (!options) return Promise.reject(new Error("No options provided."));
    if (typeof options.publication === "undefined")
        return Promise.reject(new Error("No publication provided."));
    if (typeof options.lang === "undefined")
        return Promise.reject(new Error("No lang provided."));
    if (typeof options.style === "undefined")
        return Promise.reject(new Error("No style provided."));
    if (typeof options.assets === "undefined")
        return Promise.reject(new Error("No assets provided."));
    if (typeof options.assetsTitles === "undefined")
        return Promise.reject(new Error("No assetsTitles provided."));
    if (typeof options.pkg === "undefined")
        return Promise.reject(new Error("No package.json provided."));

    const console = new Console(options.pkg);

    try {
        const plugins = {
            markdown: {
                commonmark: true,
                footnotes: true,
                pedantic: true,
            },
            frontmatter: {
                type: "yaml",
                fence: "---",
            },
            cite: {},
            pubGen: {
                ...options,
            },
            stringfy: {},
            prettier: {},
        };

        const usedPlugins = [
            [markdown, plugins.markdown], // always on.
            [remarkGfm, plugins.markdown], // always on.
            [remarkFrontmatter, plugins.frontmatter], // always on.

            [tableParser, plugins.pubGen], // pub-gen table parser.
            [codeParser, plugins.pubGen], // pub-gen code parser.
            [embedParser, plugins.pubGen], // pub-gen embed parser.
            [mermaidParser, plugins.pubGen], // pub-gen mermaid parser.

            [citePlugin, plugins.cite], // @see remark-cite.
            [citeParser, plugins.pubGen], // pub-gen citation parser, must be after citePlugin.

            [countParser, plugins.pubGen], // pub-gen count parser, must be the last pub-gen parser/compiler.

            [remarkStringify, plugins.stringfy],
            // [unifiedPrettier, plugins.prettier], // must be the last one.
        ].filter((plugin) => plugin !== null);

        const processor = unified();
        usedPlugins.forEach(([plugin, options]) => {
            processor.use(plugin, options);
        });
        return await processor.process(content);
    } catch (error) {
        const er = new Error(`Error processing content: ${error} ${content}`);
        console.error(error);
        return Promise.reject(error);
    }
};
