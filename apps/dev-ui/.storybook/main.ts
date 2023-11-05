import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

// console.log(paths);

const root = path.resolve(__dirname, "..", "..", "..");
const designSystem = (alias: string) =>
    path.resolve(root, "packages", "design-system", "src", alias);

console.log(designSystem("**/*.stories.@(js|jsx|ts|tsx)"));

const config: StorybookConfig = {
    stories: [
        // "../src/**/*.mdx",
        "../../../packages/design-system/src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-styling",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    viteFinal: async (config, { configType }) => {
        if ("resolve" in config && config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                "@/hooks": designSystem("hooks"),
                "@/pages": designSystem("pages"),
                "@/utils": designSystem("utils"),
                "@/styles": designSystem("styles"),
                "@/layouts": designSystem("layouts"),
                "@/provider": designSystem("provider"),
                "@/components": designSystem("components"),
            };
            return config;
        }
        return config;
    },
};
export default config;
