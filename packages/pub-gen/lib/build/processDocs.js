import path from "path";

import { pubGenRemarkProcessor } from "../remark/processor.js";
import {
    readContents,
    getPaths,
    dirExists,
    parseFile,
} from "@elucidario/pkg-paths";
import { processIndexFiles } from "./processIndexFiles.js";

const paths = getPaths();
/**
 * Process Docs
 * @param {Object} args
 * @param {string} args.publication
 * @param {string} args.srcPath
 * @param {string} args.distPath
 * @param {string} args.lang
 * @param {string} args.style
 * @param {string} args.version
 * @param {Object} args.attachmentIndex
 * @returns {Promise<Array<Object>>}
 */
export const processDocs = async ({
    publication,
    lang,
    style,
    version,
    attachmentIndex,
}) => {
    const srcPath = path.resolve(
        paths.publications,
        publication,
        "content",
        lang
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

    if (
        dirExists(
            path.resolve(paths.publications, publication, "files", "static")
        )
    ) {
        produced.assets.static = readContents({
            dirPath: path.resolve(
                paths.publications,
                publication,
                "files",
                "static"
            ),
            returnType: "path",
            extensions,
            index: false,
        });
    }

    if (
        dirExists(
            path.resolve(paths.publications, publication, "files", "generated")
        )
    ) {
        produced.assets.dynamic = readContents({
            dirPath: path.resolve(
                paths.publications,
                publication,
                "files",
                "generated"
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
    const stepProcessor = async ({ content, ...file }) => {
        switch (typeof content) {
            case "string":
                const newFile = await pubGenRemarkProcessor(content, {
                    pubGen: {
                        publication,
                        lang,
                        style,
                        path: path.resolve(srcPath),
                        index: attachmentIndex,
                        distPath: path.resolve(
                            paths.publications,
                            publication,
                            "files",
                            "generated",
                            version
                        ),
                    },
                });

                const filePath = file.path.replace("content", "dist");
                return parseFile({
                    content: newFile.value,
                    ...file,
                    path: filePath,
                });
        }
    };

    await Promise.all(
        content.map(async (file) => {
            const newFile = await stepProcessor(file);
            produced.content.push(newFile);
        }),
        (produced.indexFiles = await processIndexFiles({
            index: attachmentIndex,
            publication,
            lang,
            srcPath,
            style,
            version,
        }))
    );

    return produced;
};
