import { Command } from "commander";
import path from "path";
import fs from "fs";

import { Console } from "@elucidario/pkg-console";
import { getPaths } from "@elucidario/pkg-paths";

import { init } from "./init.js";
import { createPublication } from "./create.js";
import { buildPublication } from "./build.js";
import { addAuthor } from "./addAuthor.js";
import { commentsToIssues } from "./commentsToIssues.js";
import { reference } from "./reference/reference.js";
import { search } from "./reference/search.js";
import { version } from "./version.js";
import { generateSearchIndex } from "./reference/generateSearchIndex.js";
import { convert } from "./pandoc/convert.js";
import { listTemplates } from "./pandoc/listTemplates.js";
import { validateReferences } from "./reference/validateReferences.js";
import { migrate } from "./migration/migration-helper.js";

const paths = getPaths();

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.packages, "pub-gen", "package.json"))
);
const console = new Console(packageJson);

const PubGen = () => {
    const program = new Command();
    program.version(packageJson.version);

    /**
     * @command <init> - Inicializa pub-gen-config.json
     *
     * @param {boolean} force - Força a inicialização
     * @param {boolean} default - Inicializa com configuração padrão
     */
    program
        .command("init")
        .description("Initialize pub-gen config")
        .option("-f, --force", "force initialization", false)
        .option("-d, --default", "default configuration")
        .action((argv) => {
            console.log("Initializing pub-gen config...");
            init(argv);
        });

    /**
     * @command <migrate> - Migrar versão da publicação
     *
     * @param {string} publication - Nome da publicação
     */
    program
        .command("migrate")
        .description("Migrate publications version")
        .option("-p, --publication <publication>")
        .option("-f, --force", "force initialization", false)
        .action((argv) => {
            console.log("Migrating publication version...");
            migrate(argv);
        });

    /**
     * @command <create> - Cria nova publicação
     */
    program
        .command("create")
        .description("Create new publication")
        .option("-n, --no-install")
        .option("-d, --debug")
        .action((argv) => {
            console.log("Creating new publication package...");
            createPublication(argv);
        });

    /**
     * @command <version> - Faz o update da versão da publicação
     *
     * @param {string} publication - Nome da publicação
     */
    program
        .command("version")
        .description("Update version")
        .option("-p, --publication <publication>")
        .action((argv) => {
            console.log("Updating version");
            version(argv);
        });

    /**
     * @command <add-author> - Adiciona novo autor
     *
     * @param {string} publication - Nome da publicação
     */
    program
        .command("add-author")
        .description("Add new author")
        .option("-p, --publication <publication>")
        .action((argv) => {
            addAuthor(argv);
        });

    /**
     * @command <reference> Referência
     *
     * @command <index> - Gera índice de busca
     * @command <add> - Adiciona nova publicação
     * @command <search> - Busca referência
     * @command <validate> - Valida referências
     */
    const ref = program.command("reference").description("Reference");

    /**
     * @command <reference> <index> - Gera índice de busca
     */
    ref.command("index")
        .description("Search index")
        .action((argv) => {
            generateSearchIndex();
        });

    /**
     * @command <reference> <add> - Adiciona nova referência
     *
     * @param {string} publication - Nome da publicação
     */
    ref.command("add")
        .description("Add new reference")
        .option("-p, --publication <publication>")
        .action((argv) => {
            console.log(
                `Adding new reference to: ${
                    argv.publication ? argv.publication : "monorepo"
                }`
            );
            reference(argv);
        });

    /**
     * @command <reference> <search> - Busca referência
     *
     * @param {string} publication - Nome da publicação
     */
    ref.command("search")
        .description("Search reference")
        .option("-p, --publication <publication>")
        .option("-t, --type <type>")
        .option("-v, --value <value>")
        .action((argv) => {
            console.log(
                `Searching reference in: ${
                    argv.publication ? argv.publication : "monorepo"
                }`
            );
            search(argv);
        });

    /**
     * @command <reference> <validate> - Valida referências
     * @param {string} publication - Nome da publicação
     */
    ref.command("validate")
        .description("Validate references")
        .option("-p, --publication <publication>")
        .action(async (argv) => {
            console.log(
                `Validating references in: ${
                    argv.publication ? argv.publication : "monorepo"
                }`
            );
            await validateReferences(argv);
        });

    /**
     * @command <build> - Build
     *
     * @param {string} publication - Nome da publicação
     * @param {boolean} md - Build only markdown files
     * @param {boolean} gdoc - Build only to Google Docs
     * @param {boolean} clean-dist - Clean dist folder before building
     */
    program
        .command("build")
        .description("Build publication")
        .option("-p, --publication <publication>")
        .option("-w, --watch")
        .action((argv) => {
            buildPublication(argv);
        });

    /**
     * @command <pandoc> Pandoc
     *
     * @command <convert> - Converte a publicação
     * @command <templates> - Lista templates docx do pandoc
     */
    const pandoc = program.command("pandoc").description("Pandoc publication");

    /**
     * @command <pandoc> <convert> - Convert
     *
     * @param {string} publication - Nome da publicação
     * @param {string} output - Diretório de saída do arquivo convertido
     * @param {string} ext - Extensão do arquivo de saída
     * @param {string} title - Título do documento
     */
    pandoc
        .command("convert")
        .description("Convert publication")
        .option("-p, --publication <publication>")
        .option("-o, --output <output>")
        .option("-e, --ext <ext>")
        .option("-t, --title <title>")
        .action((argv) => {
            console.log("Converting publication:", argv.publication);
            convert(argv);
        });

    /**
     * @command <pandoc> <templates> - Lista templates do pandoc
     */
    pandoc
        .command("templates")
        .description("List pandoc docx templates")
        .action((argv) => {
            console.log("Listing pandoc docx templates");
            listTemplates();
        });

    program
        .command("comments-to-issues")
        .description("Convert comments to issues")
        .option("-p, --publication <publication>")
        .option("-f, --fileId <fileId>")
        .action(async (argv) => {
            console.log("Converting comments to issues");
            await commentsToIssues({
                publication: argv.publication,
                fileId: argv.fileId,
            });
        });

    program.parse(process.argv);
};

export default PubGen;
