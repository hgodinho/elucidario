import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const lcdrRollupConfig = {
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
};

export default lcdrRollupConfig;
