import React from "react";
import type { FieldRootProps } from "@elucidario/pkg-types";
import { FieldProvider } from "./FieldProvider";
import { FieldLabel } from "./FieldLabel";
import { FieldDescription } from "./FieldDescription";

export const FieldRoot = ({
    as,
    children,
    schema,
    translations,
    map,
    language,
    render,
}: FieldRootProps) => {

    // Cria um componente de acordo com o tipo de dado ou usa o componente passado como prop
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
                {render !== undefined ? render({
                    schema,
                    translations,
                    map,
                    language,
                }) : children}
                <FieldDescription />
            </As>
        </FieldProvider>
    );
};
