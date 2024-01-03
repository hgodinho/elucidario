import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-styling";
import React from "react";
import { SystemProvider } from "@elucidario/pkg-design-system";

import "../../../packages/design-system/dist/style.css";

// export const decorators = [
//     withThemeByDataAttribute({
//         themes: {
//             light: "light",
//             dark: "dark",
//         },
//         defaultTheme: "dark",
//         attributeName: "data-mode",
//     })
// ];

const preview: Preview = {
    globalTypes: {
        darkMode: {
            defaultValue: true,
        }
    },
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                // color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        (Story,) => {
            console.log("Story", Story);
            return (
                <SystemProvider lang="pt-BR">
                    <Story />
                </SystemProvider>
            )
        },
    ]
};

export default preview;
