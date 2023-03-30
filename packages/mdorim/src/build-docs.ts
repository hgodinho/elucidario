import path from "path";
import fs from "fs";

import lodash from "lodash";
const { merge } = lodash;

import type { Page, Schema, Metadata } from "./types";
import { metadataTemplate, pageTemplate } from "./templates";

import * as definitions from "./metadata";
import * as pages from "./pages";
import { fileURLToPath } from "url";

const outputDir = "./docs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 *  Retorna o schema pelo nome de um arquivo
 * @param ref | string | Schema
 * @returns | Schema
 */
export const getSchema = (ref: string): Schema => {
    const schema = JSON.parse(
        fs.readFileSync(path.join(__dirname, "json/", ref), "utf8")
    );
    return schema;
};

/**
 *  Define a página
 * @param page | object
 * @returns | Page
 */
export const definePage = (page: object) => {
    if ("mainEntity" in page) {
        const entity = page.mainEntity as {
            $ref: string;
            "@type": string;
        };
        const schema = getSchema(entity.$ref);
        const newPage = merge({}, page, {
            mainEntity: {
                ref: schema,
            },
        }) as Page;
        if ("$ref" in newPage.mainEntity) {
            delete newPage.mainEntity["$ref"];
        }
        return newPage;
    }
    return null;
};

const home = fs.readFileSync(path.join(__dirname, "pages", "home.md"), "utf8");
const homeFile = path.join(__dirname, "..", outputDir, `home.md`);
fs.writeFileSync(homeFile, home);

const metadataMarkdown = metadataTemplate(definitions.Definitions as Metadata);
const outputFile = path.join(__dirname, "..", outputDir, `metadata.md`);
fs.writeFileSync(outputFile, metadataMarkdown);

Object.entries(pages).map(([key, page]) => {
    const newPage = definePage(page);
    if (newPage) {
        const pageMarkdown = pageTemplate(newPage);
        const outputFile = path.join(__dirname, "..", outputDir, `${key}.md`);
        fs.writeFileSync(outputFile, pageMarkdown);
    }
});
