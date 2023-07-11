import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Field } from "@/components";
import { ComponentTemplate } from "../ComponentTemplate";
import { FieldProps } from "@elucidario/pkg-types";

import mdorim, { MDORIM } from "@elucidario/pkg-mdorim";

console.log({ mdorim });

const IdTemplate = (args: FieldProps) => {
    return (
        <ComponentTemplate>
            <Field {...args} />
        </ComponentTemplate>
    );
};

const meta = {
    title: "Metadata/Propriedades/id",
    component: IdTemplate,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    args: {
        schema: (mdorim as MDORIM).schemas.mdorim.core.definitions.id,
        translations: (mdorim as MDORIM).translations.id,
        mapping: (mdorim as MDORIM).mapping.id,
        language: "pt-BR",
    },
    argTypes: {
        language: {
            control: "select",
            options: ["pt-BR", "es-ES", "en-US"],
        },
    },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
