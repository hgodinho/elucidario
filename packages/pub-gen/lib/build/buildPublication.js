import path from "path";

import { processDocs } from "./processDocs.js";
import { pubGenConfig, packageJson, processFiles } from "../utils.js";
import {
    build,
    getPaths,
    createFile,
    readFile,
    writeFile,
} from "@elucidario/pkg-paths";
import { Console } from "@elucidario/pkg-console";

const paths = getPaths();
const pkg = readFile(
    path.resolve(getPaths().packages, "pub-gen", "package.json"),
).content;

export async function buildPublication({ publication, watch }) {
    const console = new Console(pkg);
    try {
        const pubGenJson = pubGenConfig(publication);
        const pkg = packageJson(publication);

        const { documents } = pubGenJson;

        const manifests = {};

        await build(
            {
                package: pkg,
                watch,
                watchSrc: [
                    path.resolve(paths.publications, publication, "content"),
                    path.resolve(paths.publications, publication, "references"),
                    path.resolve(paths.references),
                ],
            },
            async (options) => {
                await Promise.all(
                    documents.map(async (pub) => {
                        let manifest = {
                            content: {},
                            assets: [],
                        };

                        const { language, style } = pub;

                        const distPath = path.resolve(
                            paths.publications,
                            publication,
                            "dist",
                            language,
                        );

                        const staticPath = path.resolve(
                            paths.publications,
                            publication,
                            "files",
                            "static",
                        );

                        const processed = await processDocs({
                            publication,
                            lang: language,
                            index: pub.index || true,
                            type: pubGenJson.type,
                            style,
                            pkg,
                            assets: {},
                        });

                        const { content, assets } = processed;

                        // BUILD CONTENT FILES.
                        manifest.content = processFiles(content, (file) => {
                            const created = createFile(
                                file.path,
                                file.processed,
                            );
                            return created.replace(distPath, "");
                        });

                        // PARSE ASSETS.
                        manifest.assets = Object.entries(assets).reduce(
                            (acc, [name, assets]) => {
                                assets.forEach((asset) => {
                                    acc.push(
                                        path
                                            .resolve(asset.path)
                                            .replace(
                                                staticPath,
                                                "..\\..\\files\\static",
                                            ),
                                    );
                                });
                                return acc;
                            },
                            [],
                        );

                        manifests[language] = manifest;

                        createFile(
                            path.resolve(distPath, "manifest.json"),
                            manifest,
                        );
                    }),
                );
            },
        );

        return manifests;
    } catch (error) {
        console.error(new Error(error));
    }
}
