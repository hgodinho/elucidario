import React, { createContext, useMemo } from "react";

import type { FieldContextProps, FieldContextProvider } from "@elucidario/pkg-types";
import { useSystemProvider } from "@/provider";
import { useFieldComponent } from "./useFieldComponent";

export const FieldContext = createContext<FieldContextProvider>({
    schema: {
        type: "string",
    },
    label: "",
    description: "",
});

export const FieldProvider = ({ children, schema, translations, map, language }: React.PropsWithChildren & FieldContextProps) => {

    const { lang } = useSystemProvider();
    if (!language) language = lang;

    const { label, description } = useMemo(() => {
        return {
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
        }
    }, [schema, translations, map, language]);

    const props = {
        // defaults
        schema,
        translations,
        map,
        language,

        label,
        description,
    };

    // console.log('FieldContext.Provider', props)

    return (
        <FieldContext.Provider value={props}>
            {children}
        </FieldContext.Provider>
    );
}