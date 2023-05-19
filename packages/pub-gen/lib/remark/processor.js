import { unified } from "unified";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkPrettier from "remark-prettier";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import { citePlugin } from "@benrbray/remark-cite";

import remarkPubGen from "./remark-pub-gen.js";

// import docx from "remark-docx";

// console.log(docx);

export const pubGenRemarkProcessor = async (content, options, plugins) => {
    const processor = unified()
        // Use the remark parser to parse markdown
        .use(markdown, options?.markdown)
        // Use the remark-gfm plugin to add support for Github Flavored Markdown
        .use(remarkGfm, options?.gfm)
        // Use the remark-frontmatter plugin to parse frontmatter from markdown
        .use(remarkFrontmatter, options?.frontmatter)
        // Use the citation plugin
        .use(citePlugin, options?.cite || {})
        // Use the remark-pub-gen plugin to generate a publication
        .use(remarkPubGen, options?.pubGen);

    // .use(remarkStringify, options?.stringify);

    if (plugins) {
        plugins.map((plugin) => {
            processor.use(plugin);
        });
    }

    processor.Compiler = remarkPubGen;

    processor.use(remarkPrettier, options?.prettier);

    try {
        const result = await processor.process(content);
        return result;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};
