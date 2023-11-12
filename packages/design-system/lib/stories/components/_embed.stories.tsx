import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Field } from "@/components";
import { ComponentTemplate } from "../ComponentTemplate";
import { FieldProps } from "@elucidario/pkg-types";

const schema = JSON.parse(JSON.stringify({ "type": "boolean", "description": "Whether to embed the resource data in the response." }));
const meta = {
    title: "@elucidario/pkg-design-system/components/_embed",
    component: (args: FieldProps) => {
        return (
            <ComponentTemplate>
                <Field.Root {...args} />
            </ComponentTemplate>
        );
    },
    tags: ["autodocs"],
    args: schema,
    argTypes: { "language": { "control": "select", "options": ["pt-BR", "es-ES", "en-US"] } },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Field.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};