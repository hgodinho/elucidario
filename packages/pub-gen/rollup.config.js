import glob from "glob";
import path from "path";
import { fileURLToPath } from "url";
import lcdrRollupConfig from '@elucidario/rollup';

const rollupConfig = lcdrRollupConfig({
    input: Object.fromEntries(
        glob.sync("src/**/*.ts").map((file) => [
            path.relative("src", file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
        ])
    ),
})

export default rollupConfig;
