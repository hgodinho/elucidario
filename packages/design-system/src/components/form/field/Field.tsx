import * as Form from "@/components/form";

import type { FieldProps } from "@elucidario/pkg-types";
import React, { useMemo } from "react";
import { useSystemProvider } from "@/provider";

import { FieldRoot } from "./FieldRoot";

export const Field = ({
    schema,
    translations,
    map,
    language,
    ...props
}: FieldProps) => {

    const { componentProps, Component } = useMemo(() => {
        return {
            // Cria um componente de acordo com o tipo de dado
            Component: (() => {
                switch (schema.type) {
                    case "string":
                        return Form.Input;
                    case "number":
                    case "integer":
                        return Form.Input;
                    case "boolean":
                        return Form.Input;
                    // case "object":
                    //     return Form.Object;
                    case "array":
                        return Form.Multiple;
                    default:
                        return Form.Input;
                }
            })(),

            // Cria as props do componente de acordo com o tipo de dado
            componentProps: ((() => {
                switch (schema.type) {
                    case "string":
                        return {
                            ...schema,
                            type: "text",
                        };
                    case "number":
                    case "integer":
                        return {
                            ...schema,
                            type: "number",
                        };
                    case "boolean":
                        return {
                            ...schema,
                            type: "checkbox",
                        };
                    case "object":
                        return {
                            ...schema
                        };
                    case "array":
                        return {
                            schema: schema.items,
                        };
                    default:
                        return {
                            ...schema,
                            type: "text",
                            placeholder: "tem que ver issae heim"
                        };
                }
            })() as {
                type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url'
            }),
        }
    }, [schema]);

    return (
        <FieldRoot
            {...props}
            map={map}
            schema={schema}
            language={language}
            translations={translations}
            render={({ schema }) => (
                <Component
                    {...schema}
                    {...componentProps}
                />
            )}
        />
    );
};
