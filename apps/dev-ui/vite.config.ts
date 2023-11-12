import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { getPaths } from "@elucidario/pkg-paths";

const { packages } = getPaths();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
        include: [
            path.resolve(packages, "design-system", "lib", "index.ts"),
            path.resolve(packages, "mdorim-react", "lib", "index.ts"),
        ],
        esbuildOptions: {
            target: "es2022",
        },
    },
    resolve: {
        alias: {
            "@elucidario/pkg-design-system": path.resolve(
                packages,
                "design-system",
                "lib",
                "index.ts",
            ),
            "@elucidario/pkg-mdorim-react": path.resolve(
                packages,
                "mdorim-react",
                "lib",
                "index.ts",
            ),
        },
    },
});
