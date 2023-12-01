import React from "react";
import type { FieldRootProps } from "@elucidario/pkg-types";
import { FieldProvider } from "./FieldProvider";
import { FieldLabel } from "./FieldLabel";
import { FieldDescription } from "./FieldDescription";

import { Input, Multiple, Object } from "../";

export const FieldRoot = ({
    as,
    schema,
    translations,
    map,
    language,
    name,
}: FieldRootProps) => {
    // Componente a ser usado
    const Component = (() => {
        switch (schema.type) {
            case "object":
                return Object;
            case "array":
                return Multiple;
            case "string":
            default:
                return Input;
        }
    })();

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

    const props: FieldRootProps = {
        schema,
        translations,
        map,
        language,
        name
    }

    return (
        <FieldProvider {...props}>
            <As className="field flex flex-col mb-4">
                <FieldLabel type={'fieldset' === As ? 'legend' : 'label'} />
                <Component />
                <FieldDescription />
            </As>
        </FieldProvider>
    );
};
