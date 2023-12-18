import path from "path";

import { processDocs } from "./processDocs.js";
import { pubGenConfig, packageJson } from "../utils.js";
import { build, getPaths, createFile } from "@elucidario/pkg-paths";

const paths = getPaths();

export async function buildPublication({ publication, watch }) {
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
                        indexFiles: [],
                        content: [],
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
                        style: style.name,
                        pkg: pkg,
                        assets: {},
                    });

                    const { indexFiles, content, assets } = processed;

                    // BUILD INDEX FILES.
                    manifest.indexFiles = Object.entries(indexFiles).map(
                        ([name, file]) => {
                            return createFile(
                                path.resolve(distPath, `${name}.md`),
                                file,
                            ).slice(distPath.length + 1);
                        },
                    );

                    // BUILD CONTENT FILES.
                    manifest.content = content.map((file) => {
                        return createFile(
                            file.path,
                            file.processed.value,
                        ).slice(distPath.length + 1);
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
}
