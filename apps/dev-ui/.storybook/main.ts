import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const root = path.resolve(__dirname, "..", "..", "..");
const designSystem = (alias: string) =>
    path.resolve(root, "packages", "design-system", "lib", alias);

const config: StorybookConfig = {
    stories: [
        "../../../packages/design-system/lib/**/*.stories.@(ts|tsx)",
        "../src/stories/mdorim/**/*.stories.@(ts|tsx)",
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
