import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

export default {
    input: {
        mdorim: "src/index.ts",
        build: "src/build-docs.ts",
    },
    output: {
        dir: "dist",
        format: "es",
        sourcemap: true,
        plugins: [terser()],
    },
    plugins: [
        typescript({
            tsconfig: "tsconfig.json",
        }),
        json(),
    ],
};
