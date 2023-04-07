#!/usr/bin/env node
import { program } from "commander";

import { createPublication } from "./create";

program
    .command("create")
    .description("Cria nova publicação")
    .action((argv: any) => {
        createPublication(argv);
    });

program.parse(process.argv);

export { program };
