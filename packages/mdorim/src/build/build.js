import path from "path";
import { program } from "commander";
import { build, getPaths, readFile } from "@elucidario/pkg-paths";

import { buildDocs } from "./docs.js";
import { buildSchemas } from "./schemas.js";
import { buildTranslations } from "./translations.js";
import { buildExamples } from "./examples.js";
import { clean } from "./clean.js";
import { cli } from "./cli.js";

const mdorimSrc = path.resolve(getPaths().packages, "mdorim", "src");
const mdorimTests = path.resolve(getPaths().packages, "mdorim", "tests");
const mdorimStatic = path.resolve(
    getPaths().packages,
    "mdorim",
    "static",
    "mdorim",
);

const pkg = readFile(
    path.resolve(getPaths().packages, "mdorim", "package.json"),
).value;

/**
 * Build mdorim
 */
export const buildMdorim = async () => {
    program
        .description("Builds the mdorim model")
        .option("-w, --watch", "Watch for changes", false)
        .option("-c, --clean", "Clean static folder", false)
        .option("-s, --schema", "Builds the schema", false)
        .option("-e, --examples", "Builds the examples", false)
        .option("-t, --translations", "Builds the translations", false)
        .option("-l, --lib", "Builds the Lib", false)
        .option("-d, --docs", "Builds the docs", false)
        .option("--test", "Test the model", false)
        .action(async (options) => {
            await build(
                {
                    package: pkg,
                    watch: options.watch,
                    watchSrc: [mdorimSrc, mdorimTests],
                },
                async () => {
                    /**
                     * Clean static folder.
                     */
                    if (options.clean) await clean(pkg, mdorimStatic);

                    /**
                     * Build schemas.
                     */
                    if (options.schema)
                        await buildSchemas(pkg, mdorimSrc, mdorimStatic);

                    /**
                     * Build examples.
                     */
                    if (options.examples)
                        await buildExamples(pkg, mdorimSrc, mdorimStatic);

                    /**
                     * Build translations.
                     */
                    if (options.translations)
                        await buildTranslations(pkg, mdorimSrc, mdorimStatic);

                    /**
                     * Build lib.
                     */
                    if (options.lib)
                        await cli(
                            "pnpm build:rollup",
                            "Building lib with rollup...",
                            pkg,
                        );

                    /**
                     * Build docs.
                     */
                    if (options.docs) await buildDocs(pkg, mdorimSrc);

                    /**
                     * Test.
                     */
                    if (options.test)
                        await cli("pnpm test", "Testando...", pkg);
                },
            );
        });

    program.parse(process.argv);
};

await buildMdorim();
