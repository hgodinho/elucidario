import path from "path";
import fs from "fs";
import { program } from "commander";
import { build, getPaths } from "@elucidario/pkg-paths";

import { buildDocs } from "./docs.js";
import { buildSchemas } from "./schemas.js";
import { buildTypes } from "./types.js";
import { buildTranslations } from "./translations.js";
import { buildExamples } from "./examples.js";
import { clean } from "./clean.js";
import { test } from "./test.js";

const { packages } = getPaths();

const __dirname = path.resolve(packages, "mdorim", "src");

const outStatic = path.resolve(packages, "mdorim", "static", "mdorim");

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(packages, "mdorim", "package.json")),
);

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
        .option("-d, --docs", "Builds the docs", false)
        .option("--test", "Test the model", false)
        .action(async (options) => {
            await build(
                {
                    package: packageJson,
                    watch: options.watch,
                    watchSrc: [
                        __dirname,
                        path.resolve(__dirname, "..", "tests"),
                    ],
                },
                async () => {
                    if (options.clean) await clean(packageJson, outStatic);
                    if (options.schema) {
                        await buildSchemas(packageJson, __dirname, outStatic);
                    }
                    if (options.examples)
                        await buildExamples(packageJson, __dirname, outStatic);
                    // if (options.mapping)
                    //     await buildMapping(packageJson, __dirname, outStatic);
                    if (options.translations)
                        await buildTranslations(
                            packageJson,
                            __dirname,
                            outStatic,
                        );

                    if (options.docs) await buildDocs(packageJson, __dirname);
                    if (options.test) await test(packageJson);
                    // if (options.types) await buildTypes(packageJson, __dirname);
                },
            );
        });

    program.parse(process.argv);
};

await buildMdorim();
