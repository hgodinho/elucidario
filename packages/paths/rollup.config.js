import lcdrRollupConfig from "@elucidario/pkg-rollup";

import pkg from "./package.json" assert { type: "json" };

const config = lcdrRollupConfig({
    output: [
        {
            file: "dist/index.js",
            format: "cjs",
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
        },
    ],
    external: [...Object.keys(pkg.devDependencies)],
});

export default config;
