import { unified } from "unified";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";

import remarkPubGen from "./remark-pub-gen.js";

export const pubGenRemarkProcessor = async (
    content,
    options = undefined,
    plugins = undefined
) => {
    const processor = unified()
        .use(markdown, options?.markdown)
        .use(remarkFrontmatter, options?.frontmatter)
        .use(remarkGfm, options?.gfm)
        .use(remarkPubGen, options?.pubGen)
        .use(remarkStringify, options?.stringify);

    if (plugins) {
        plugins.map((plugin) => {
            processor.use(plugin);
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
