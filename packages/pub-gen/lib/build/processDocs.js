import path from "path";

import { pubGenProcessor } from "../remark/pubGenProcessor.js";
import { readContents, getPaths, dirExists } from "@elucidario/pkg-paths";
import { processIndexFiles } from "./processIndexFiles.js";

const paths = getPaths();
/**
 * Process Docs
 * @param {Object} args
 * @param {string} args.publication
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.pkg
 * @param {Object} args.assets
 * @returns {Promise<Array<Object>>}
 */
export const processDocs = async ({
    publication,
    lang,
    style,
    pkg,
    assets,
}) => {
    const srcPath = path.resolve(
        paths.publications,
        publication,
        "content",
        lang,
    );

    const content = readContents({
        dirPath: srcPath,
        extensions: "md",
        log: false,
    });

    const produced = {
        content: [],
        indexFiles: {},
        assets: {},
    };

    const extensions = ["png", "jpg", "jpeg", "gif", "svg", "ico"];

    /**
     * Assets.
     */
    if (
        dirExists(
            path.resolve(paths.publications, publication, "files", "static"),
        )
    ) {
        produced.assets.static = readContents({
            dirPath: path.resolve(
                paths.publications,
                publication,
                "files",
                "static",
            ),
            returnType: "path",
            extensions,
            index: false,
        });
    }
    if (
        dirExists(
            path.resolve(paths.publications, publication, "files", "generated"),
        )
    ) {
        produced.assets.dynamic = readContents({
            dirPath: path.resolve(
                paths.publications,
                publication,
                "files",
                "generated",
            ),
            returnType: "path",
            extensions,
            index: false,
        });
    }

    /**
     *  Step Processor
     * @param {Object} file
     */
    const stepProcessor = async (file) => {
        const newFile = await pubGenProcessor(file.content, {
            publication,
            lang,
            style,
            assets,
            pkg,
        });

        const filePath = file.path.replace("content", "dist");

        return {
            original: file,
            processed: newFile,
            path: filePath,
        };
    };

    await Promise.all(
        content.map(async (file) => {
            produced.content.push(await stepProcessor(file));
        }),
    );

    produced.indexFiles = await processIndexFiles({
        assets,
        publication,
        lang,
        srcPath,
        style,
        pkg,
    });

    return produced;
};
