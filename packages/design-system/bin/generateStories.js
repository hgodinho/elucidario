import mdorim from "@elucidario/pkg-mdorim";

import path from "path";
import fs from "fs";

const properties = [
    "identified_by",
    "classified_as",
    "referred_to_by",
    "made_of",
    "content",
];

const generateStories = () => {
    if (fs.existsSync(path.resolve("src", "stories", "mdorim"))) {
        fs.rmSync(path.resolve("src", "stories", "mdorim"), {
            recursive: true,
        });
        fs.mkdirSync(path.resolve("src", "stories", "mdorim"), {
            recursive: true,
        });
    }

    console.log("Generating stories");
    console.log({
        mdorim,
    });

    properties.forEach((element) => {
        const schema =
            mdorim.schemas.dereferenced.core.definitions[element] || undefined;

        console.log({
            schema,
            element,
        });

        const translations = mdorim.translations[element] || undefined;
        const mapping = mdorim.mapping[element] || undefined;
        const title = `Mdorim/Propriedades/${element}`;

        const body = storyBody(
            title,
            { schema, translations, mapping, language: "pt-BR" },
            {
                language: {
                    control: "select",
                    options: ["pt-BR", "es-ES", "en-US"],
                },
            },
        );
        const story = `${storyImports()}\n\n${body}\n\n${storyExports()}`;

        if (
            !fs.existsSync(
                path.resolve("src", "stories", "mdorim", "properties"),
            )
        )
            fs.mkdirSync(
                path.resolve("src", "stories", "mdorim", "properties"),
                { recursive: true },
            );

        fs.writeFileSync(
            path.resolve(
                "src",
                "stories",
                "mdorim",
                "properties",
                `${element}.stories.tsx`,
            ),
            story,
        );
    });
    console.log("Stories generated");
};

const storyImports = () => {
    return `import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { Field } from "@/components";
import { ComponentTemplate } from "../../ComponentTemplate";
import { FieldProps } from "@elucidario/pkg-types";
import mdorim from "@elucidario/pkg-mdorim";`;
};

const storyBody = (title, args, argTypes) => {
    const template = `const schema = ${mdorim.decycle(args)};
    
    const meta = {
    title: "{{title}}",
    component: (args: FieldProps) => {
        return (
            <ComponentTemplate>
                <Field {...args} />
            </ComponentTemplate>
        );
    },
    tags: ["autodocs"],
    args: mdorim.retrocycle(schema),
    argTypes: {{argTypes}},
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof Field>;`;

    return template
        .replace("{{title}}", title)
        .replace("{{args}}", mdorim.decycle(args))
        .replace("{{argTypes}}", JSON.stringify(argTypes));
};

const storyExports = () => {
    return `export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};`;
};

generateStories();
