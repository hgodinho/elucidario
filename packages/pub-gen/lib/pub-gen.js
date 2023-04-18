"use strict";

import { Command } from "commander";

import { createPublication } from "./create.js";
import { buildPublication } from "./build.js";
import { addAuthor } from "./addAuthor.js";
import { addDocument } from "./addDocument.js";
import { convert } from "./pandoc/convert.js";

const PubGen = () => {
    const program = new Command();

    program
        .command("create")
        .description("Create new publication")
        .action((argv) => {
            console.log("Creating new publication...");
            createPublication(argv);
        });

    program
        .command("add-author")
        .description("Add new author")
        .option("-p, --publication <publication>")
        .action((argv) => {
            console.log("Adding new author...", { argv });
            addAuthor(argv);
        });

    program
        .command("add-doc")
        .description("Add new document")
        .option("-p, --publication <publication>")
        .action((argv) => {
            console.log("Adding new document...");
            addDocument(argv);
        });

    program
        .command("build")
        .description("Build publication")
        .option("-p, --publication <publication>")
        .option("-m, --md", "build only markdown files")
        .option("-g, --gdoc", "build only to Google Docs")
        .option("-c, --clean-dist", "Clean dist folder before building")
        .action((argv) => {
            console.log("Building publication...");
            buildPublication(argv);
        });

    program
        .command("convert")
        .description("Convert publication")
        .option("-p, --publication <publication>")
        .option("-o, --output <output>")
        .option("-e, --ext <ext>")
        .option("-t, --title <title>")
        .action((argv) => {
            console.log("Converting publication...");
            convert(argv);
        });

    program.parse(process.argv);
};

export default PubGen;
