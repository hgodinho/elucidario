import path from "path";
import fs from "fs";
import mustache from "mustache";

import { merge } from "lodash";

import type { Page, Schema, Metadata } from "./types";
import { metadataTemplate } from "./templates";

import * as definitions from "./metadata";
import * as pages from "./pages";
import * as schemas from "./schemas";

export type CreateMardownPageOptions = {
    name: string;
    page: Page;
    metadata: Metadata;
    template: string;
    outputDir: string;
};

function createMarkdownPage({
    name,
    page,
    metadata,
    template,
    outputDir,
}: CreateMardownPageOptions) {
    // page.mainEntity.ref.definitions = Object.entries(schema).map(([key, schema]) => {
    //     console.log({ key, schema });
    //     return schema;
    // });
    // const markdown = mustache.render(template, pageData);
    // console.log({ meta, pageData, schemaData, template, markdown });
    // const outputFile = path.join(outputDir, `${schemaData.title}.md`);
    // fs.writeFileSync(outputFile, markdown);
}

const pagesDir = "./json/pages";
const schemasDir = "./json/schemas";
const metadataFile = "./json/metadata/definitions.json";
const templatesDir = "./json/templates";
const outputDir = "./docs";

export const definePage = (page: object, schema: object, metadata: object) => {
    
    const newMetadata = metadata as Metadata;

    const newSchema = schema as Schema;
    
    const newPage = merge({}, page, {
        mainEntity: {
            ref: newSchema,
        },
    }) as Page;

    if ("$ref" in newPage.mainEntity) {
        delete newPage.mainEntity["$ref"];
    }

    console.log({ newPage, newSchema, newMetadata });

    return newPage;
};

console.log({ definitions: definitions.Definitions.definitions.ID})
const metadataMarkdown = metadataTemplate(definitions.Definitions as Metadata);
const outputFile = path.join( __dirname, '..', outputDir, `metadata.md`);
console.log({ metadataMarkdown, outputFile})
fs.writeFileSync(outputFile, metadataMarkdown);

// Object.entries(pages).map(([key, page]) => {
//     const schemaRef = page.mainEntity["$ref"];
//     const schema = JSON.parse(
//         fs.readFileSync(path.join(__dirname, "json/", schemaRef), "utf8")
//     );

//     const pageData = definePage(page, schema, definitions.Definitions);

//     // createMarkdownPage({
//     //     name: key,
//     //     page: pageData,
//     //     metadata: definitions.Definitions as Metadata,
//     //     template: pageTemplate,
//     //     outputDir,
//     // });
// });

