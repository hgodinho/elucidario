const path = require("path");
const fs = require("fs");
const mustache = require("mustache");

import type { Page, Schema } from "./types";
import { pageTemplate } from "./json/templates/entity-page";

import * as pages from "./json/pages";
import * as schemas from "./json/schemas";

export type CreateMardownPageOptions = {
    name: string;
    page: Page;
    schema: Schema;
    template: string;
    outputDir: string;
};

function createMarkdownPage({
    name,
    page,
    schema,
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
const outputDir = "../docs";

Object.entries(pages).map(([key, page]) => {
    const schemaRef = page.mainEntity['$ref']
    const schema = fs.readFileSync(path.join( __dirname, 'json/', schemaRef), 'utf8');
    console.log({ key, page, schemaRef, schema });

});

// fs.mkdirSync(outputDir, { recursive: true });

// fs.readdirSync(pagesDir).forEach((filename: string) => {
//     if (filename.endsWith(".json")) {
//         console.log({ filename,  })
//         const page = path.basename(filename, ".json");
//         const name = path.basename(path.basename(page, ".page"), ".json");
//         const schemaName = path.join(name + ".schema" + ".json");
//         const pageFile = path.join(__dirname, pagesDir, filename);
//         const schemaFile = path.join(__dirname, schemasDir, schemaName);

//         createMarkdownPage({
//             name,
//             pageFile,
//             schemaFile,
//             template: pageTemplate,
//             outputDir,
//         });
//     }
// });

// function getPropertyData(schema: Schema, metadata: any): PropertyData[] {
//     const properties = schema.properties;
//     if (!properties) {
//         return [];
//     }
//     return Object.entries(properties).map(([name, property]) => {
//         const type = property.type;
//         const description = property.description;
//         const link = metadata.definitions[type].map["schema.org"];
//         return { name, type, description, link };
//     });
// }
