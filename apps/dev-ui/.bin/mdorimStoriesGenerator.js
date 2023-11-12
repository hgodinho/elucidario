import MdorimInstance from "@elucidario/pkg-mdorim";

import path from "path";
import fs from "fs";

const storiesBuilder = (group, schema, translations, dest) => {
    Object.entries(schema).forEach(([propertyName, propertySchema]) => {
        const languages = translations[propertyName]
            ? translations[propertyName]
            : undefined;

        const title = `${group}/${propertyName}`;

        const body = storyBody(
            title,
            {
                schema: propertySchema,
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

        if (!fs.existsSync(path.resolve(dest)))
            fs.mkdirSync(path.resolve(dest), {
                recursive: true,
            });

        fs.writeFileSync(
            path.resolve(dest, `${propertyName}.stories.tsx`),
            story,
        );
    });
};

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

    // Mdorim Core
    storiesBuilder(
        "@elucidario/pkg-mdorim/Mdorim/Core",
        mdorim.core.definitions,
        translations,
        "src/stories/mdorim/mdorim",
    );

    // Linked Art Core
    storiesBuilder(
        "@elucidario/pkg-mdorim/Linked Art/Core",
        linkedArt.core.definitions,
        translations,
        "src/stories/mdorim/linked-art",
    );

    console.log("Stories generated");
};

const storyImports = () => {
    return `import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Field, ComponentTemplate } from "@elucidario/pkg-design-system";
import { MdorimProvider } from "@elucidario/pkg-mdorim-react";
import { FieldProps } from "@elucidario/pkg-types";`;
};

const storyBody = (title, args, argTypes) => {
    return `const schema = ${JSON.stringify(JSON.stringify(args.schema))};
const argTypes = ${JSON.stringify(JSON.stringify(argTypes))};
const meta = {
    title: "${title}",
    component: (args: FieldProps) => (
        <MdorimProvider>
            <ComponentTemplate>
                <Field.Root {...args} />
            </ComponentTemplate>
        </MdorimProvider>
    ),
    tags: ["autodocs"],
    args: {
        schema: JSON.parse(schema)
    },
    argTypes: JSON.parse(argTypes),
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Field>;`;
};

const storyExports = () => {
    return `export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};`;
};

generateStories();
