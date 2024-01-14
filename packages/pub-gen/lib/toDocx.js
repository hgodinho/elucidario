import path from "path";

import {
    getPaths,
    readFile,
    fileExists,
    createFile,
    readContents,
} from "@elucidario/pkg-paths";
import {
    pubGenConfig,
    packageJson,
    getStyleConfig,
    loopStylesStructure,
} from "./utils.js";
import { toMD } from "@elucidario/pkg-docusaurus-md";
import { pubGenProcessor } from "./remark/pubGenProcessor.js";

export async function toDocx(options) {
    const { publication, title, output, style, lang } = options;

    const pkg = packageJson(publication);

    const { version, documents, contributors, year, type } =
        pubGenConfig(publication);

    let documentsToParse = [];
    if (typeof style !== "undefined") {
        documentsToParse = documents.filter((doc) => doc.style.name === style);
    } else if (typeof lang !== "undefined") {
        documentsToParse = documents.filter((doc) => doc.language === lang);
    } else {
        documentsToParse = documents;
    }

    await Promise.all(
        documentsToParse.map(async ({ language, style, title: docTitle }) => {
            if (
                !fileExists(
                    path.resolve(
                        getPaths().publications,
                        publication,
                        "dist",
                        language,
                        "manifest.json",
                    ),
                )
            ) {
                throw new Error(
                    `Publication ${publication} not built. Please run "pub-gen build" at the root of the publication.`,
                );
            }

            const content = readContents({
                dirPath: path.resolve(
                    getPaths().publications,
                    publication,
                    "content",
                    language,
                ),
                extensions: ["md"],
                index: false,
            });

            const styleConfig = getStyleConfig({ style, publication, type });

            const files = [];
            const errors = [];
            await loopStylesStructure(
                styleConfig.structure,
                async ({ key, value, required, title }) => {
                    // console.log({ key, value, required, title });
                    let found = false;
                    if (required === true) {
                        try {
                            found = content.find((file) => {
                                return file.path.includes(
                                    path.resolve(
                                        getPaths().publications,
                                        publication,
                                        "content",
                                        language,
                                        value,
                                    ),
                                );
                            });
                        } catch (error) {
                            errors.push(error);
                        }
                    } else if (typeof required === "string") {
                        try {
                            found = content.find((file) => {
                                return file.path.includes(
                                    path.resolve(
                                        getPaths().publications,
                                        publication,
                                        "content",
                                        language,
                                        value,
                                    ),
                                );
                            });
                        } catch (error) {
                            errors.push(error);
                        }
                    }
                    if (found) {
                        files.push(found);
                    } else {
                        errors.push(
                            new Error(
                                `File ${value} not found in ${publication} ${language} ${title} ${key}`,
                            ),
                        );
                    }
                },
            );

            console.log({ files, errors });

            // const pre = manifest.content.internal.pre.map((file) => {
            //     const filePath = path.resolve(
            //         getPaths().publications,
            //         publication,
            //         "dist",
            //         language,
            //         file,
            //     );
            //     return readFile(path.resolve(filePath)).value;
            // });
            // const body = manifest.content.internal.body.map((file) => {
            //     const filePath = path.resolve(
            //         getPaths().publications,
            //         publication,
            //         "dist",
            //         language,
            //         file,
            //     );
            //     return readFile(path.resolve(filePath)).value;
            // });
            // const pos = manifest.content.internal.pos.map((file) => {
            //     const filePath = path.resolve(
            //         getPaths().publications,
            //         publication,
            //         "dist",
            //         language,
            //         file,
            //     );
            //     return readFile(path.resolve(filePath)).value;
            // });
            const markdown = toMD([...pre, ...body, ...pos]);

            const docx = await pubGenProcessor(markdown, {
                publication,
                language,
            }).then(async (docx) => {
                const docxPath = createFile(
                    path.resolve(
                        getPaths().publications,
                        publication,
                        "files",
                        "generated",
                        pkg.version,
                        language,
                        `${pkg.version}-${
                            title ? title : docTitle
                        }-${language}.docx`,
                    ),
                    docx,
                );

                return docxPath;
            });

            console.log({ docx });
        }),
    );

    // console.log({
    //     publication,
    //     title,
    //     output,
    //     pkg,
    //     version,
    //     documents,
    //     contributors,
    //     year,
    //     fileExists,
    //     documentsToParse,
    // });
}
