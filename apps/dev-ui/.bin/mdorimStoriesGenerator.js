import { Mdorim as MdorimInstance } from "@elucidario/pkg-mdorim";

import path from "path";
import fs from "fs";

const generateStories = () => {
    if (fs.existsSync(path.resolve("src", "stories", "mdorim"))) {
        fs.rmSync(path.resolve("src", "stories", "mdorim"), {
            recursive: true,
        });
        fs.mkdirSync(path.resolve("src", "stories", "mdorim"), {
            recursive: true,
        });
    }

    const Mdorim = MdorimInstance.getInstance();
    const { schemas, translations } = Mdorim;
    const { mdorim, linkedArt, translation } = schemas;

    console.log("Generating stories");

    // Core
    Object.entries(mdorim.core.definitions).forEach(
        ([propertyName, propertySchema]) => {
            const languages = translations[propertyName]
                ? translations[propertyName]
                : undefined;

            const title = `@elucidario/pkg-mdorim/Core/${propertyName}`;

            const body = storyBody(
                title,
                {
                    schema: JSON.stringify(propertySchema),
                    languages,
                    language: "pt-BR",
                },
                {
                    language: {
                        control: "select",
                        options: ["pt-BR", "es-ES", "en-US"],
                    },
                },
            );

            const story = `${storyImports()}\n\n${body}\n\n${storyExports()}`;

            // console.log({ story });

            if (!fs.existsSync(path.resolve("src", "stories", "mdorim")))
                fs.mkdirSync(path.resolve("src", "stories", "mdorim"), {
                    recursive: true,
                });

            fs.writeFileSync(
                path.resolve(
                    "src",
                    "stories",
                    "mdorim",
                    `${propertyName}.stories.tsx`,
                ),
                story,
            );
        },
    );
    console.log("Stories generated");
};

const storyImports = () => {
    return `import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Field } from "@elucidario/pkg-design-system";
import { ComponentTemplate } from "@elucidario/pkg-design-system";
import { FieldProps } from "@elucidario/pkg-types";`;
};

const storyBody = (title, args, argTypes) => {
    const template = `const schema = ${JSON.stringify(args.schema)};
    const meta = {
    title: "{{title}}",
    component: (args: FieldProps) => {
        return (
            <ComponentTemplate>
                <Field.Root {...args} />
            </ComponentTemplate>
        );
    },
    tags: ["autodocs"],
    args: {
        schema: JSON.parse(schema)
    },
    argTypes: {{argTypes}},
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Field>;`;

    return template
        .replace("{{title}}", title)
        .replace("{{args}}", args)
        .replace("{{argTypes}}", JSON.stringify(argTypes));
};

const storyExports = () => {
    return `export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};`;
};

generateStories();
