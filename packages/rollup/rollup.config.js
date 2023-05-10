import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import merge from "lodash.merge";

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
        external: [
            "@elucidario/pkg-docusaurus-md",
            "@elucidario/pkg-parse-args",
            "@elucidario/pkg-pub-gen",
            "@elucidario/pkg-schema-doc",
            "@elucidario/pkg-console",
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
        ],
    };

    const external = [];
    external.push(...defaultConfig.external);
    if (config && config.external) {
        external.push(...config.external);
    }

    return merge({}, defaultConfig, config, { external });
};

export default lcdrRollupConfig;
