import path from "path";

import { processDocs } from "./processDocs";
import { pubGenConfig, packageJson } from "../utils";
import { build, getPaths, createFile } from "@elucidario/pkg-paths";

const paths = getPaths();

export async function buildPublication({ publication }) {
    const pubGenJson = pubGenConfig(publication);
    const pkgJson = packageJson(publication);

    const { documents } = pubGenJson;

    const manifests = {};

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
                pkg: pkgJson,
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
                return createFile(file.path, file.processed.value).slice(
                    distPath.length + 1,
                );
            });

            // PARSE ASSETS.
            manifest.assets = Object.entries(assets).reduce(
                (acc, [name, assets]) => {
                    assets.forEach((asset) => {
                        acc.push(
                            path
                                .resolve(asset.path)
                                .replace(staticPath, "..\\..\\files\\static"),
                        );
                    });
                    return acc;
                },
                [],
            );

            manifests[language] = manifest;

            createFile(path.resolve(distPath, "manifest.json"), manifest);
        }),
    );

    return manifests;
}
