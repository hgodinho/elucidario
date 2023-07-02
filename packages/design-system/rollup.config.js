import lcdrRollupConfig from "@elucidario/pkg-rollup";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";

import pkg from "./package.json" assert { type: "json" };

const external = [
    // ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
];

const config = lcdrRollupConfig({
    external,
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
