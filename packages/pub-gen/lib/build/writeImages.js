import { isEmpty } from "lodash-es";
import path from "path";
import fs from "fs";
import { readContents } from "@elucidario/pkg-paths";
import { getPaths } from "../getPaths.js";

const paths = getPaths();

/**
 * Write Image
 * @param {Object} args
 * @param {string} args.srcPath
 * @param {string} args.publication
 * @param {string} args.lang
 * @param {Console} args.console
 */
const writeImage = async ({ srcPath, publication, lang, console }) => {
    if (isEmpty(srcPath) || typeof srcPath === "object") return;
    try {
        const imagePath = path.parse(srcPath);
        const distPath = path.resolve(
            paths.publications,
            publication,
            "dist",
            lang,
            imagePath.base
        );
        fs.copyFileSync(srcPath, distPath);
        console.log(
            {
                type: "img",
                when: new Date().toLocaleString(),
            },
            {
                defaultLog: true,
                title: `Image ${imagePath.base} copied!`,
                type: "success",
            }
        );
    } catch (error) {
        throw new Error(`error writing image at writeImage: ${error}`);
    }
};

/**
 * Write Images
 * @param {Object} args
 * @param {string} args.srcPath
 * @param {string} args.publication
 * @param {string} args.lang
 * @param {Console} args.console
 * @returns {Promise<Array<Object>>}
 */
const writeImages = async ({ srcPath, publication, lang, console }) => {
    const imageContent = readContents({
        dirPath: srcPath,
        index: false,
        returnType: "path",
        extensions: ["png", "jpg", "jpeg", "gif"],
        names: true,
        log: false,
    });

    try {
        return await Promise.all(
            Object.entries(imageContent).map(async ([name, Path]) => {
                if (typeof Path === "object") {
                    return await Promise.all(
                        Object.entries(Path).map(async ([key, imgPath]) => {
                            return {
                                [key]: await writeImage({
                                    srcPath: imgPath,
                                    publication,
                                    lang,
                                    console,
                                }),
                            };
                        })
                    );
                }

                return {
                    [name]: await writeImage({
                        srcPath: Path,
                        publication,
                        lang,
                        console,
                    }),
                };
            })
        );
    } catch (error) {
        throw new Error(`error writing images at writeImages: ${error}`);
    }
};

export default writeImages;
