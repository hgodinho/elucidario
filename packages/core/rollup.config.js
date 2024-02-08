import lcdrRollupConfig from "@elucidario/tool-rollup";

import pkg from "./package.json" assert { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const minified = [
    {
        file: pkg.main,
        format: "esm",
        sourcemap: true,
    },
];

const unMinified = minified.map(({ file, ...rest }) => ({
    ...rest,
    file: file.replace(".min.", "."),
}));

const config = lcdrRollupConfig({
    external,
    input: "src/ts/index.ts",
    output: [...unMinified, ...minified],
    plugins: {
        typescript: {
            declaration: false,
            declarationDir: null,
        },
    },
});

export default config;
