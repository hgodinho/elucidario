import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@/components';
import { ComponentTemplate } from '../../ComponentTemplate';

const meta = {
    title: 'Componentes/Form/Field',
    component: Field.Factory,
    tags: ['autodocs'],
    args: {
        schema: {
            type: 'string',
            title: 'Label',
            description: 'Description',
        },
        translations: {
            label: [
                {
                    lang: "pt-BR",
                    content: "Nome"
                },
                {
                    lang: "es-ES",
                    content: "Nombre"
                },
                {
                    lang: "en-US",
                    content: "Name"
                }
            ],
            description: [
                {
                    lang: "pt-BR",
                    content: "Descrição do campo"
                },
                {
                    lang: "es-ES",
                    content: "Descripción de la propiedad"
                },
                {
                    lang: "en-US",
                    content: "Description of the field"
                }
            ]
        },
        map: {
            version: "0.1.0",
            mapping: [
                {
                    standard: "la",
                    metadata: "identified_by",
                    link: "https://linked.art/api/1.0/shared/"
                },
                {
                    standard: "crm",
                    metadata: "PI_is_identified_by",
                    link: "http://www.cidoc-crm.org/cidoc-crm/P1_is_identified_by"
                }
            ]
        },
        id: 'field',
        language: '',
    },
    argTypes: {
        language: {
            control: "select",
            options: ["pt-BR", "es-ES", "en-US"]
        }
    },
    decorators: [
        (Story: any) => (
            <ComponentTemplate>
                <Story />
            </ComponentTemplate>
        ),
    ],
    parameters: {
        layout: 'fullscreen'
    },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};