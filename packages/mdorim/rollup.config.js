import lcdrRollupConfig from "@elucidario/pkg-rollup";

import pkg from "./package.json" assert { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const minified = [
    {
        file: pkg.exports["."].import,
        format: "esm",
    },
    {
        file: pkg.exports["."].require,
        format: "cjs",
    },
];

const unMinified = minified.map(({ file, ...rest }) => ({
    ...rest,
    file: file.replace(".min.", "."),
}));

const config = lcdrRollupConfig({
    external,
    input: "src/lib/index.ts",
    output: [...unMinified, ...minified],
});

export default config;
