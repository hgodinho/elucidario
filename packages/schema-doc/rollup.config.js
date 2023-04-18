import lcdrRollupConfig from "@elucidario/rollup";

const config = lcdrRollupConfig({
    external: ["@apidevtools/json-schema-ref-parser"],
});

export default config;
