import lcdrRollupConfig from "@elucidario/pkg-rollup";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";

import fs from "fs";
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const external = [
    // ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const config = lcdrRollupConfig({
    external,
    output: {
        dir: "dist",
        declarationDir: "dist",
        format: "es",
        sourcemap: true,
    },
    plugins: [
        resolve(),
        babel({
            babelHelpers: "bundled",
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
            ],
        }),
        replace({
            preventAssignment: false,
            "process.env.NODE_ENV": JSON.stringify("development"),
        }),
    ],
});

export default config;
