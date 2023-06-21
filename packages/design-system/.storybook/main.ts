import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    viteFinal: async (config, { configType }) => {
        console.log(config, configType);
        return config;
        // config.resolve.alias = {
        //     ...config.resolve.alias,
        //     '@/utils': path.resolve(__dirname, '..', 'src', 'utils'),
        //     '@/styles': path.resolve(__dirname, '..', 'src', 'styles'),
        //     '@/components': path.resolve(__dirname, '..', 'src', 'components'),
        //     '@/layouts': path.resolve(__dirname, '..', 'src', 'layouts'),
        //     '@/hooks': path.resolve(__dirname, '..', 'src', 'hooks'),
        //     '@/pages': path.resolve(__dirname, '..', 'src', 'pages'),
        // };
        // return config;
    },
};
export default config;
