import * as JsSearch from "js-search";
import fs from "fs";
import path from "path";

import { Console } from "@elucidario/pkg-console";

import { getPaths } from "../getPaths.js";
const paths = getPaths();

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);

const console = new Console(packageJson);

export const prepareData = async (referencesPath) => {
    let indexJson = {};
    try {
        if (fs.existsSync(path.resolve(referencesPath, "index.json"))) {
            indexJson = JSON.parse(
                fs.readFileSync(path.resolve(referencesPath, "index.json"))
            );
            indexJson = {
                items: indexJson.items.map((item) => {
                    try {
                        let itemPath = item.path;
                        if (item.path.includes("<references>")) {
                            itemPath = item.path.replace(
                                "<references>",
                                paths.references
                            );
                        }
                        return JSON.parse(
                            fs.readFileSync(path.resolve(itemPath), "utf8")
                        );
                    } catch (err) {
                        console.log(err, "error", true);
                        throw new Error(err);
                    }
                }),
            };
            return indexJson.items;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err, { type: "error", defaultLog: true });
        throw new Error(err);
    }
};

export const searchId = async (referencesPath, searchValue) => {
    const search = new JsSearch.Search("id");

    const references = await prepareData(referencesPath);

    search.addIndex("id");
    if (!references) {
        console.log("No references yet.", { type: "warning" });
        return;
    }

    search.addDocuments(references);
    const result = search.search(searchValue);

    return result;
};

export const searchAll = async (referencesPath, searchValue) => {
    const search = new JsSearch.Search("id");

    const references = await prepareData(referencesPath);

    if (!references) {
        console.log("No references yet.", { type: "warning" });
        return;
    }

    search.addDocuments(references);

    search.addIndex("@schema");
    search.addIndex("id");
    search.addIndex("_slug");
    search.addIndex([
        "author",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "chair",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "collection-editor",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "compiler",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "composer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "container-author",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "contributor",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "curator",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "director",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "editor",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "editorial-director",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "executive-producer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "guest",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "host",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "interviewer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "illustrator",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "narrator",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "organizer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "original-author",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "performer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "producer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "recipient",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "reviewed-author",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "script-writer",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "series-creator",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "translator",
        [],
        "family",
        "given",
        "dropping-particle",
        "non-dropping-particle",
        "suffix",
        "comma-suffix",
        "static-ordering",
        "literal",
        "parse-names",
    ]);
    search.addIndex([
        "accessed",
        "date-parts",
        "season",
        "circa",
        "literal",
        "raw",
    ]);
    search.addIndex([
        "available-date",
        "date-parts",
        "season",
        "circa",
        "literal",
        "raw",
    ]);
    search.addIndex([
        "event-date",
        "date-parts",
        "season",
        "circa",
        "literal",
        "raw",
    ]);
    search.addIndex([
        "issued",
        "date-parts",
        "season",
        "circa",
        "literal",
        "raw",
    ]);
    search.addIndex([
        "original-date",
        "date-parts",
        "season",
        "circa",
        "literal",
        "raw",
    ]);
    search.addIndex([
        "submitted",
        "date-parts",
        "season",
        "circa",
        "literal",
        "raw",
    ]);
    search.addIndex("type");
    search.addIndex("id");
    search.addIndex("citation-key");
    search.addIndex("categories");
    search.addIndex("language");
    search.addIndex("journalAbbreviation");
    search.addIndex("shortTitle");
    search.addIndex("abstract");
    search.addIndex("annote");
    search.addIndex("archive");
    search.addIndex("archive_collection");
    search.addIndex("archive_location");
    search.addIndex("archive-place");
    search.addIndex("authority");
    search.addIndex("call-number");
    search.addIndex("chapter-number");
    search.addIndex("citation-number");
    search.addIndex("citation-label");
    search.addIndex("collection-number");
    search.addIndex("collection-title");
    search.addIndex("container-title");
    search.addIndex("container-title-short");
    search.addIndex("dimensions");
    search.addIndex("division");
    search.addIndex("DOI");
    search.addIndex("edition");
    search.addIndex("event");
    search.addIndex("event-title");
    search.addIndex("event-place");
    search.addIndex("first-reference-note-number");
    search.addIndex("genre");
    search.addIndex("ISBN");
    search.addIndex("ISSN");
    search.addIndex("issue");
    search.addIndex("jurisdiction");
    search.addIndex("keyword");
    search.addIndex("locator");
    search.addIndex("medium");
    search.addIndex("note");
    search.addIndex("number");
    search.addIndex("number-of-pages");
    search.addIndex("number-of-volumes");
    search.addIndex("original-publisher");
    search.addIndex("original-publisher-place");
    search.addIndex("original-title");
    search.addIndex("page");
    search.addIndex("page-first");
    search.addIndex("part");
    search.addIndex("part-title");
    search.addIndex("PMCID");
    search.addIndex("PMID");
    search.addIndex("printing");
    search.addIndex("publisher");
    search.addIndex("publisher-place");
    search.addIndex("references");
    search.addIndex("reviewed-genre");
    search.addIndex("reviewed-title");
    search.addIndex("scale");
    search.addIndex("section");
    search.addIndex("source");
    search.addIndex("status");
    search.addIndex("supplement");
    search.addIndex("title");
    search.addIndex("title-short");
    search.addIndex("URL");
    search.addIndex("version");
    search.addIndex("volume");
    search.addIndex("volume-title");
    search.addIndex("volume-title-short");
    search.addIndex("year-suffix");
    search.addIndex("custom");

    const result = search.search(searchValue);
    console.log(result, { type: "info", defaultLog: true, title: "Search" });
    return result;
};

export const searchTitle = async (referencesPath, searchValue) => {
    const search = new JsSearch.Search("id");
    search.addIndex("id");
    search.addIndex("title");

    const references = await prepareData(referencesPath);
    if (!references) {
        console.log("No references yet.", { type: "warning" });
        return;
    }

    search.addDocuments(references);
    const result = search.search(searchValue);
    return result;
};

export const search = (args) => {
    const { type, value, publication } = args;

    switch (type) {
        case "title":
            return searchTitle(paths.references, value);
        case "all":
            return searchAll(paths.references, value);
        default:
            return searchType(paths.references, value);
    }
};
