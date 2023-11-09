import React, { ElementType } from "react";
import type { FieldRootProps } from "@elucidario/pkg-types";
import { FieldProvider } from "./FieldProvider";
import { FieldLabel } from "./FieldLabel";
import { FieldDescription } from "./FieldDescription";
import { useFieldComponent } from "./useFieldComponent";

import { Input, Multiple } from "../";

export const FieldRoot = ({
    as,
    schema,
    translations,
    map,
    language,
}: FieldRootProps) => {
    const { componentProps, component } = useFieldComponent(schema);

    // Componente a ser usado
    const Component = component !== undefined ? (() => {
        switch (schema.type) {
            case "object":
            case "array":
                return Multiple;
            case "string":
            default:
                return Input;
        }
    })() : Input;

    // Cria um componente de acordo com o tipo de dado
    const As = as !== undefined ? (() => {
        switch (schema.type) {
            case "object":
            case "array":
                return 'fieldset';
            default:
                return 'div';
        }
    })() : 'div';

    return (
        <FieldProvider
            schema={schema}
            translations={translations}
            map={map}
            language={language}
        >
            <As className="field flex flex-col mb-4">
                <FieldLabel type={'fieldset' === As ? 'legend' : 'label'} />
                <Component
                    {...componentProps}
                />
                <FieldDescription />
            </As>
        </FieldProvider>
    );
};
