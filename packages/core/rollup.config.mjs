import lcdrRollupConfig from "@elucidario/tool-rollup";

import pkg from "./package.json" assert { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const minified = [
    {
        file: pkg.main,
        format: "iife",
        sourcemap: true,
        globals: {
            "react-dom/client": "ReactDOM",
        },
    },
];

const unMinified = minified.map(({ file, ...rest }) => ({
    ...rest,
    file: file.replace(".min.", "."),
}));

const config = lcdrRollupConfig({
    external: [...external, "react-dom/client"],
    input: "src/ts/index.tsx",
    output: [...unMinified, ...minified],
    plugins: {
        typescript: {
            declaration: false,
            declarationDir: null,
        },
    },
});

export default config;
