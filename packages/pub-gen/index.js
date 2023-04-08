#!/usr/bin/env node

"use strict";

import { Command } from "commander";

import { createPublication } from "./lib/create.js";
import { syncPublication } from "./lib/sync.js";

const program = new Command();

program
    .command("create")
    .description("Cria nova publicação")
    .action((argv) => {
        console.log("Criando publicação...");
        createPublication(argv);
    });

program
    .command("sync")
    .description("Sincroniza publicação com o Google Drive")
    .action((argv) => {
        console.log("Sincronizando publicação com o Google Drive...");
        syncPublication(argv);
    });

program.parse(process.argv);

export { program };
