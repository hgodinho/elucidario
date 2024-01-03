import lcdrRollupConfig from "@elucidario/tool-rollup";

const config = lcdrRollupConfig({
    external: ["googleapis", "readline", "http"],
});

export default config;
