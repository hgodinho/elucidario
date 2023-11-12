import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({ outDir: "dist/types" })],
    build: {
        sourcemap: true,
        lib: {
            entry: "lib/index.ts",
            formats: ["es"],
            fileName: (format) => `${format}/mdorim-react.js`,
        },
        rollupOptions: {
            external: [
                ...Object.keys(pkg.peerDependencies || {}),
                ...Object.keys(pkg.devDependencies || {}),
            ],
            output: {
                // Provide global variables to use in the UMD build for externalized deps
                // https://rollupjs.org/guide/en/#output-globals-g-globals
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
