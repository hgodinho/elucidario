import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "@/components";
import { LabelProps } from "@elucidario/pkg-types";

const meta = {
    title: "@elucidario/pkg-design-system/components/Form/Label",
    component: Label as unknown as React.FC,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    args: {
        children: "Label",
        htmlFor: "input",
    },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<LabelProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
