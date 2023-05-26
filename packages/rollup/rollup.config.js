import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import merge from "lodash.merge";

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

const lcdrRollupConfig = (config = null) => {
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
            }),
            terser({
                output: {
                    comments: "all",
                    shebang: true,
                },
            }),
        ],
        external,
    };

    const externals = [];
    externals.push(...defaultConfig.external);
    if (config && config.external) {
        externals.push(...config.external);
    }

    return merge({}, defaultConfig, config, { external: externals });
};

export default lcdrRollupConfig;
