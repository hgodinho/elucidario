import lcdrRollupConfig from "@elucidario/pkg-rollup";

const config = lcdrRollupConfig({
    external: ["googleapis", "readline", "http"],
});

export default config;
