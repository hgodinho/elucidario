"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const mustache = require("mustache");
const pages = __importStar(require("./json/pages"));
function createMarkdownPage({ name, page, schema, template, outputDir, }) {
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
    const schemaRef = page.mainEntity['$ref'];
    const schema = fs.readFileSync(path.join(__dirname, 'json/', schemaRef), 'utf8');
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
//# sourceMappingURL=build-docs.js.map