import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "@/components";
import { LabelProps } from "@elucidario/pkg-types";
import { ComponentTemplate } from "@/stories";

const Template = (args: LabelProps) => {
    return (
        <ComponentTemplate>
            <Label {...args} />
        </ComponentTemplate>
    )
}

const meta = {
    title: "@elucidario/pkg-design-system/components/Form/Label",
    component: Template,
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
