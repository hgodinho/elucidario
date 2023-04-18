import lcdrRollupConfig from "@elucidario/pkg-rollup";

const config = lcdrRollupConfig({
    external: ["@apidevtools/json-schema-ref-parser"],
});

export default config;
