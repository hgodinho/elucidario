import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components";

import { ButtonProps } from "@elucidario/pkg-types";
import { ComponentTemplate } from "../ComponentTemplate";

const Template = (args: ButtonProps) => {
    return (
        <ComponentTemplate>
            <Button {...args} />
        </ComponentTemplate>
    );
};

const meta = {
    title: "@elucidario/pkg-design-system/components/Button",
    component: Template,
    tags: ["autodocs"],
    args: {
        children: "Button",
    },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
