import React, { createContext, useMemo } from "react";

import type { FieldContextProps, FieldContextProvider } from "@elucidario/pkg-types";
import { useSystemProvider } from "@/provider";

export const FieldContext = createContext<FieldContextProvider>({
    schema: {
        type: "string",
    },
    // context: null,
    name: null,
    label: "",
    description: "",
});

export const FieldProvider = ({ children, schema, translations, map, language, name }: React.PropsWithChildren & FieldContextProvider) => {

    const { lang } = useSystemProvider();

    if (!language) language = lang;

    // migrar para useTranslations
    const { label, description } = useMemo(() => {
        return {
            // Traduz o label do campo
            label: (() => {
                if (translations && language) {
                    const label = translations.label.find(
                        ({ lang }: { lang: string; content: string }) =>
                            lang === language
                    );
                    if (label) return label.content;
                }
                return schema.title ? schema.title : name;
            })(),

            // Traduz a descrição do campo
            description: (() => {
                if (translations && language) {
                    const description = translations.description.find(
                        ({ lang }: { lang: string; content: string }) =>
                            lang === language
                    );
                    if (description) return description.content;
                }
                return schema.description;
            })(),
        }
    }, [schema, translations, map, language]);

    const componentProps = useMemo(() => {

    }, [schema, translations, map, language]);

    const props: FieldContextProvider = {
        // defaults
        schema,
        translations,
        map,
        language,

        // context,
        name,
        label,
        description,
        // componentProps
    };

    // console.warn('FieldProvider', {
    //     // Mdorim,
    //     props
    // })

    return (
        <FieldContext.Provider value={props}>
            {children}
        </FieldContext.Provider>
    );
}