import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '@/components';

const meta = {
    title: 'Componentes/Form/Label',
    component: Label,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    args: {
        children: 'Label',
        htmlFor: 'input',
    },
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};