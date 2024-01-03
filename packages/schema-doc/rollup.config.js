import lcdrRollupConfig from "@elucidario/tool-rollup";

import pkg from "./package.json" assert { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const minified = [
    {
        file: pkg.exports["."].import,
        format: "esm",
        sourcemap: true,
    },
    {
        file: pkg.exports["."].require,
        format: "cjs",
        sourcemap: true,
    },
];

const unMinified = minified.map(({ file, ...rest }) => ({
    ...rest,
    file: file.replace(".min.", "."),
}));

const config = lcdrRollupConfig({
    output: [...unMinified, ...minified],
    external,
    plugins: {
        typescript: {
            emitDeclarationOnly: false,
            declaration: false,
            declarationDir: null,
        },
    },
});

export default config;
