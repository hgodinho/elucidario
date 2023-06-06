import lcdrRollupConfig from "@elucidario/pkg-rollup";

import pkg from "./package.json" assert { type: "json" };

const external = [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const config = lcdrRollupConfig({
    external,
});

export default config;
