import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";

const rollupConfig = {
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
        json(),
        copy({
            targets: [
                { src: "src/**/*.json", dest: "dist" },
            ],
            verbose: true,
            hook: "writeBundle",
            copyOnce: true,
            flatten: false,
        }),
        terser(),
    ],
};

export default rollupConfig;
