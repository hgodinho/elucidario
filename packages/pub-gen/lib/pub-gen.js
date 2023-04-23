"use strict";

import { Command } from "commander";

import { createPublication } from "./create.js";
import { buildPublication } from "./build.js";
import { addAuthor } from "./addAuthor.js";
import { addDocument } from "./addDocument.js";
import { convert } from "./pandoc/convert.js";
import { Console } from "@elucidario/pkg-console";

import packageJson from "../package.json" assert { type: "json" };

const PubGen = () => {
    const program = new Command();

    const console = new Console(packageJson);
    console.banner();

    program
        .command("create")
        .description("Create new publication")
        .action((argv) => {
            console.info("Creating new publication");
            createPublication(argv);
        });

    program
        .command("add-author")
        .description("Add new author")
        .option("-p, --publication <publication>")
        .action((argv) => {
            console.info("Adding new author to", argv.publication);
            addAuthor(argv);
        });

    program
        .command("add-doc")
        .description("Add new document")
        .option("-p, --publication <publication>")
        .action((argv) => {
            console.info("Adding new document to", argv.publication);
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
            console.info("Building publication:", argv.publication);
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
            console.info("Converting publication:", argv.publication);
            convert(argv);
        });

    program.parse(process.argv);
};

export default PubGen;
