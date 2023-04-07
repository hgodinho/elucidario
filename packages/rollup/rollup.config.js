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
            terser(),
        ],
        external: [
            "@elucidario/parse-args",
            "fs",
            "path",
            "inquirer",
            "child_process",
            "lodash",
            "json-schema-to-typescript",
            "commander"
        ]
    }

    return merge({}, defaultConfig, config);
};

export default lcdrRollupConfig;
