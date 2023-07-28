import * as components from "@/components";

import type { FieldProps, MappingProps } from "@elucidario/pkg-types";
import React, { useMemo } from "react";

import { InfoCircledIcon } from "@radix-ui/react-icons";

export const Mapping = ({ version, mapping }: MappingProps) => {
    return (
        <table className='table-auto'>
            <thead>
                {mapping && mapping.length > 0 ? (
                    <tr>
                        <td>standard</td>
                        <td>metadata</td>
                    </tr>
                ) : null}
            </thead>
            <tbody>
                {mapping && mapping.length > 0 ? (
                    mapping.map((row, i) => (
                        <tr key={i}>
                            <td>{row.standard}</td>
                            <td><a href={row.link}>{row.metadata}</a></td>
                        </tr>
                    ))
                ) : null}
            </tbody>
        </table >
    )
}

export const Field = ({
    schema,
    translations,
    mapping,
    language,
    as,
}: FieldProps) => {
    const { type, labelTypes, label, description, Component, componentProps, As } = useMemo(() => {
        return {
            // Tipo de dado
            type: schema.type,
            // Tipos de label
            labelTypes: ["string", "number", "integer", "boolean"],
            // Traduz o label do campo
            label:
                translations && language
                    ? translations.label.find(
                        ({ lang }: { lang: string; content: string }) =>
                            lang === language
                    ).content
                    : schema.title,
            // Traduz a descrição do campo
            description:
                translations && language
                    ? translations.description.find(
                        ({ lang }: { lang: string; content: string }) =>
                            lang === language
                    ).content
                    : schema.description,
            // Cria um componente de acordo com o tipo de dado ou usa o componente passado como prop
            As: as || (() => {
                switch (schema.type) {
                    case "object":
                    case "array":
                        return 'fieldset';
                    default:
                        return 'div';
                }
            })(),
            // Cria um componente de acordo com o tipo de dado
            Component: (() => {
                switch (schema.type) {
                    case "string":
                        return components.Input;
                    case "number":
                        return components.Input;
                    case "integer":
                        return components.Input;
                    case "boolean":
                        return components.Input;
                    case "array":
                        return components.Multiple;
                    default:
                        return components.Input;
                }
            })(),
            // Cria as props do componente de acordo com o tipo de dado
            componentProps: ((() => {
                switch (schema.type) {
                    case "string":
                        return {
                            type: "text",
                        };
                    case "number":
                        return {
                            type: "number",
                        };
                    case "integer":
                        return {
                            type: "number",
                        };
                    case "boolean":
                        return {
                            type: "checkbox",
                        };
                    case "array":
                        return {
                            schema: schema.items,

                        };
                    default:
                        return {
                            type: "text",
                            placeholder: "tem que ver issae heim"
                        };
                }
            })() as {
                type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url'
            }),
        }
    }, [schema, translations, mapping, language, as]);

    console.log({
        type,
        label,
        schema,
        translations,
        mapping,
        language,
        As,
    });

    return (
        <As className="field flex flex-col mb-4">
            {labelTypes.includes(type) ? (
                <components.Label>
                    {label}
                    {mapping !== undefined &&
                        <components.Popover
                            Trigger={InfoCircledIcon}
                            Content={Mapping}
                            contentProps={mapping}
                        />
                    }
                </components.Label>
            ) : (
                <components.Legend>
                    {label}
                    {mapping !== undefined &&
                        <components.Popover
                            Trigger={InfoCircledIcon}
                            Content={Mapping}
                            contentProps={mapping}
                        />
                    }
                </components.Legend>
            )}
            <Component
                {...schema}
                {...componentProps}
            />
            <span className="description">{description}</span>
        </As>
    );
};
