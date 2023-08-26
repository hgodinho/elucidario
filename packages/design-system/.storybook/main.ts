import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
    stories: [
        // "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
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
                '@/hooks': path.resolve(__dirname, '..', 'src', 'hooks'),
                '@/pages': path.resolve(__dirname, '..', 'src', 'pages'),
                '@/utils': path.resolve(__dirname, '..', 'src', 'utils'),
                '@/styles': path.resolve(__dirname, '..', 'src', 'styles'),
                '@/layouts': path.resolve(__dirname, '..', 'src', 'layouts'),
                '@/provider': path.resolve(__dirname, '..', 'src', 'provider'),
                '@/components': path.resolve(__dirname, '..', 'src', 'components'),
            };
            return config;
        }
        return config;
    },
};
export default config;
