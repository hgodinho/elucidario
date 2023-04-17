import { unified } from "unified";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkPrettier from "remark-prettier";
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
