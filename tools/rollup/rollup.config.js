import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import pkg from "lodash";
import json from "@rollup/plugin-json";

const { mergeWith } = pkg;

const external = [
    "@elucidario",
    "chalk",
    "child_process",
    "commander",
    "fs",
    "i18n",
    "inquirer",
    "json-schema-to-typescript",
    "lodash-es",
    "lodash",
    "path",
    "url",
];

const spreadConfig = (spread = "", config) => {
    const toSpread = spread.split(".");
    return toSpread.reduce((acc, curr) => {
        try {
            return acc[curr];
        } catch (error) {
            return undefined;
        }
    }, config);
};

const lcdrRollupConfig = (config = null) => {
    const typescriptConfig = spreadConfig("plugins.typescript", config);
    const terserConfig = spreadConfig("plugins.terser", config);
    const terserConfigOutput = spreadConfig("plugins.terser.output", config);

    const defaultConfig = {
        input: "src/index.ts",
        output: {
            dir: "dist",
            format: "es",
            sourcemap: true,
        },
        plugins: [
            typescript({
                tsconfig: "tsconfig.json",
                ...typescriptConfig,
            }),
            terser({
                ...terserConfig,
                output: {
                    comments: "all",
                    shebang: true,
                    ...terserConfigOutput,
                },
            }),
            json(),
        ],
        external,
    };

    const externals = [];
    externals.push(...defaultConfig.external);
    if (config && config.external) {
        externals.push(...config.external);
    }

    const rollup = mergeWith(
        {},
        defaultConfig,
        config,
        {
            external: (id) => externals.some((d) => id.startsWith(d)),
        },
        (objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        },
    );

    return rollup;
};

export default lcdrRollupConfig;