import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '@/components';

const meta = {
    title: 'Componentes/Form/Label',
    component: Label,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    args: {
        children: 'Label',
    },
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// export const LoggedIn: Story = {
//     args: {
//         user: {
//             name: 'Jane Doe',
//         },
//     },
// };

// export const LoggedOut: Story = {};
