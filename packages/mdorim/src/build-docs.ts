import path from "path";
import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";

import { readContents } from "@elucidario/schema-doc";

import { fileURLToPath } from "url";
import { pubGenRemarkProcessor } from "@elucidario/pub-gen/lib/remark/processor.js";

const outputDir = "docs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pages = readContents(path.join(__dirname, "pages"), ["md"]);

export const processPages = async () => {
    Object.entries(pages).map(async ([name, page]) => {
        const newFile = await pubGenRemarkProcessor(page, {
            pubGen: {
                path: __dirname,
            },
        });
        fs.writeFileSync(
            path.resolve(outputDir, `${name}.md`),
            newFile.toString()
        );
    });
    console.log(chalk.green("Done!"));
};

export const buildDocs = async () => {
    const program = new Command("build-docs");

    program.option("-w, --watch", "Watch for changes", false);

    program.parse();

    const options = program.opts();

    if (options.watch) {
        await processPages();
        fs.watch(path.join(__dirname, "pages"), async (eventType, filename) => {
            if (filename) {
                console.log(
                    chalk.cyan(
                        `event of type ${chalk.bgCyan(
                            chalk.bold(chalk.black(eventType))
                        )} at markdown file ${chalk.bgCyan(chalk.bold(chalk.black(filename)))}`
                    )
                );
                await processPages();
            }
        });
        fs.watch(path.join(__dirname, "schemas"), async (eventType, filename) => {
            if (filename) {
                console.log(
                    chalk.blue(
                        `event of type ${chalk.bgBlue(
                            chalk.bold(chalk.black(eventType))
                        )} at schema file ${chalk.bgBlue(chalk.bold(chalk.black(filename)))}`
                    )
                );
                await processPages();
            }
        });
    } else {
        processPages();
    }
};

buildDocs();
