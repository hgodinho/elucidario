import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@/components';

const meta = {
    title: 'Componentes/Form/Input',
    component: Input,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    args: {
        type: 'text',
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
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};