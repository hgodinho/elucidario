import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import merge from "lodash.merge";

const lcdrRollupConfig = (config = null) => {
    const defaultConfig = {
        input: 'src/index.ts',
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
            "@elucidario/parse-args",
            "fs",
            "path",
            "inquirer",
            "child_process",
            "lodash",
            "json-schema-to-typescript",
            "commander",
        ]
    }

    const external = [];
    external.push(...defaultConfig.external);
    if (config && config.external) {
        external.push(...config.external);
    }

    return merge({}, defaultConfig, config, { external });
};

export default lcdrRollupConfig;
