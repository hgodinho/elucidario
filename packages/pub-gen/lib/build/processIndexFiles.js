import path from "path";

import {
    getPaths,
    fileExists,
    readFile,
    parseFile,
} from "@elucidario/pkg-paths";
import { heading, list, table, toMD } from "@elucidario/pkg-docusaurus-md";

const paths = getPaths();

export function indexBodyMD({ title, items, type = "table" }) {
    const header = heading(1, title.toUpperCase());
    let body = "";
    switch (type) {
        case "list":
            body = list(items, true);
            break;

        case "table":
        default:
            body = table({
                headers: ["", "", ""],
                rows: items.map((item, i) => {
                    const number = i + 1;
                    return [number, item, ""];
                }),
            });
            break;
    }
    return toMD([header, body]);
}

/**
 * Process index files
 * @param {Object} props
 * @param {Object} props.index
 * @param {string} props.publication
 * @param {string} props.lang
 * @returns {Object} processed
 */
export const processIndexFiles = async ({ index, publication, lang }) => {
    const srcPath = path.resolve(
        paths.publications,
        publication,
        "content",
        lang
    );

    // attachmentIndex
    const titles = {
        images: "Lista de imagens",
        tables: "Lista de tabelas",
        figures: "Lista de figuras",
        charts: "Lista de quadros",
        acronyms: "Lista de siglas e abreviaturas",
    };

    const processed = {};

    Object.entries(index).map(async ([type, files]) => {
        if (files.length === 0) return;
        processed[type] = indexBodyMD({
            title: titles[type],
            items: files,
        });
    });

    // acronyms and abbreviations
    if (fileExists(path.resolve(srcPath, "acronyms.json"))) {
        const acronyms = readFile({
            filePath: path.resolve(srcPath, "acronyms.json"),
        }).content;

        const sortedAcronyms = Object.entries(acronyms).sort((a, b) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
        });

        processed.acronyms = indexBodyMD({
            title: titles.acronyms,
            items: sortedAcronyms.map(([acronym, description], i) => {
                if (i === sortedAcronyms.length - 1) {
                    return `${acronym} - ${description}.`;
                } else {
                    return `${acronym} - ${description};`;
                }
            }),
        });
    } else {
        console.log("acronyms.json does not exist");
    }

    return processed;
};
