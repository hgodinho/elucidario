import lcdrRollupConfig from '@elucidario/rollup';

const config = lcdrRollupConfig({
    external: ['googleapis', 'readline', 'http'],
});

export default config;