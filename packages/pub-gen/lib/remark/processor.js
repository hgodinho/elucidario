import { unified } from "unified";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import { citePlugin } from "@benrbray/remark-cite";

import remarkPubGen from "./remark-pub-gen.js";

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

    if (plugins) {
        plugins.map((plugin) => {
            processor.use(plugin.plugin, plugin.options);
        });
    }

    processor.Compiler = remarkPubGen;

    try {
        const result = await processor.process(content);
        return result;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};
