import { unified } from "unified";
import remarkStringify from "remark-stringify";
import markdown from "remark-parse";
import remarkGfm from "remark-gfm";

export default testProcessor = async (content, options) => {
    const processor = unified()
        .use(markdown)
        .use(remarkGfm)
        .use(options.plugin, options.pluginOptions);
    processor.use(remarkStringify, options.stringifyOptions);

    return await processor.process(content);
};
