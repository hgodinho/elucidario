import path from "path";
import { getPaths, readFile } from "@elucidario/pkg-paths";

const paths = getPaths();

/**
 * Get publication config
 * @param {string} publication
 * @returns {object}
 */
export function pubGenConfig(publication) {
    const pubGenJson = readFile({
        filePath: path.resolve(paths.publications, publication, "pub-gen.json"),
        ext: "json",
    }).content;
    return pubGenJson;
}

/**
 * Get publication package.json
 * @param {string} publication
 * @returns {object}
 */
export function packageJson(publication) {
    const pubGenJson = readFile({
        filePath: path.resolve(paths.publications, publication, "package.json"),
        ext: "json",
    }).content;
    return pubGenJson;
}
