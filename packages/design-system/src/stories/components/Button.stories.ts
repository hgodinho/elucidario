import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components';

const meta = {
    title: 'Componentes/Form/Button',
    component: Button,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    args: {
        children: 'Button',
    },
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};