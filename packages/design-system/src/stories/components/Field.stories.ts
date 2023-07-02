import type { Meta, StoryObj } from '@storybook/react';

import { Field } from '@/components';

const meta = {
    title: 'Componentes/Form/Field',
    component: Field,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    args: {
        type: 'text',
        label: 'Label',
        id: 'field',
        description: 'Description',
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number', 'tel', 'url'],
        },
    },
    parameters: {
        layout: 'fullscreen'
    },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};