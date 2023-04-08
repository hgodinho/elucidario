#!/usr/bin/env node

"use strict";

import { Command } from "commander";

import { createPublication } from "./lib/create.js";
import { syncPublication } from "./lib/sync.js";
import { addAuthor } from "./lib/addAuthor.js";
import { addDocument } from "./lib/addDocument.js";

const program = new Command();

program
    .command("create")
    .description("Cria nova publicação")
    .action((argv) => {
        console.log("Criando publicação...");
        createPublication(argv);
    });

program
    .command("add-author")
    .description("Adiciona novo autor")
    .option("-p, --publication <publication>", "nome-da-publicacao")
    .action((argv) => {
        console.log("Adicionando novo autor...", { argv });
        addAuthor(argv);
    });

program
    .command("add-doc")
    .description("Adiciona novo documento")
    .option("-p, --publication <publication>", "nome-da-publicacao")
    .action((argv) => {
        console.log("Adicionando novo documento...");
        addDocument(argv);
    });

program
    .command("sync")
    .description("Sincroniza publicação com o Google Drive")
    .option("-p, --publication <publication>", "nome-da-publicacao")
    .action((argv) => {
        console.log("Sincronizando publicação com o Google Drive...");
        syncPublication(argv);
    });

program.parse(process.argv);

export { program };
