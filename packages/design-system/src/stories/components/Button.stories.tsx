import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Button } from "@/components";

import { ButtonProps } from "@elucidario/pkg-types";
import { ComponentTemplate } from "../ComponentTemplate";

const ButtonTemplate = (args: ButtonProps) => {
    return (
        <ComponentTemplate>
            <Button {...args} />
        </ComponentTemplate>
    );
};

const meta = {
    title: "Componentes/Form/Button",
    component: ButtonTemplate,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    args: {
        children: "Button",
    },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof ButtonTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
