import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-styling";
import React from "react";
import { SystemProvider } from "../src/provider";

import "../dist/output.css";

export const decorators = [
    withThemeByDataAttribute({
        themes: {
            light: "light",
            dark: "dark",
        },
        defaultTheme: "dark",
        attributeName: "data-mode",
    })
];

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story) => (
            <SystemProvider lang="pt-BR">
                <Story />
            </SystemProvider>
        ),
    ]
};

export default preview;
