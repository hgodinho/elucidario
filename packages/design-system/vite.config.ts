import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import pkg from "./package.json";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        dts({
            outDir: "dist/types",
        }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, "lib", "index.ts"),
            formats: ["es"],
            fileName: (format) => `${format}/design-system.js`,
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
