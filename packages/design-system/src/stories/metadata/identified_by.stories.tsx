import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Field } from "@/components";
import { ComponentTemplate } from "../ComponentTemplate";
import { FieldProps } from "@elucidario/pkg-types";

import mapping from "@elucidario/pkg-mdorim";

console.log({ mapping });

const IdentifiedByTemplate = (args: FieldProps) => {
    return (
        <ComponentTemplate>
            <Field {...args} />
        </ComponentTemplate>
    );
};

const meta = {
    title: "Metadata/Propriedades/identified_by",
    component: IdentifiedByTemplate,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    args: {
        children: "Button",
    },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof IdentifiedByTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
