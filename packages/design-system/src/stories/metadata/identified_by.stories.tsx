import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Field } from "@/components";
import { ComponentTemplate } from "../ComponentTemplate";
import { FieldProps } from "@elucidario/pkg-types";

import mdorim, { MDORIM } from "@elucidario/pkg-mdorim";

const IdentifiedByTemplate = (args: FieldProps) => {
    return (
        <ComponentTemplate>
            <Field {...args} />
        </ComponentTemplate>
    );
};

console.log({ mdorim })
const dereference = (mdorim as MDORIM).dereference;

const schema = await dereference((mdorim as MDORIM).schemas.mdorim.core.definitions.identified_by);

const meta = {
    title: "Metadata/Propriedades/identified_by",
    component: IdentifiedByTemplate,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    args: {
        schema,
        translations: (mdorim as MDORIM).translations.identified_by,
        mapping: (mdorim as MDORIM).mapping.identified_by,
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
