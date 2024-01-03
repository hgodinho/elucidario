import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components";
import type { InputProps } from "@elucidario/pkg-types";
import { ComponentTemplate } from "@/stories";

const Template = (args: InputProps) => {
    return (
        <ComponentTemplate form={true}>
            <Input {...args} />
        </ComponentTemplate>
    )
}

const meta = {
    title: "@elucidario/pkg-design-system/components/Form/Input",
    component: Template,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ["autodocs"],
    args: {
        type: "text",
        name: "name",
    },
    argTypes: {
        type: {
            control: "select",
            options: ["text", "password", "email", "number", "tel", "url"],
        },
    },
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<InputProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
