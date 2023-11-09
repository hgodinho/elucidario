import { useMemo, useCallback, FC } from "react";
import type {
    Schema,
    DataTypes,
    FieldSchema,
    InputType,
    UseFieldComponent,
} from "@elucidario/pkg-types";

export const useFieldComponent: UseFieldComponent = (schema) => {
    const parseSchema = useCallback(
        (
            schema: Omit<Schema<DataTypes>, "type">,
            type?: InputType,
        ): FieldSchema => {
            let newSchema = {} as FieldSchema;
            newSchema = {
                ...schema,
                type,
            };
            if (schema.hasOwnProperty("required")) {
                newSchema.required = true;
            }
            return newSchema;
        },
        [],
    );

    const { componentProps, component } = useMemo(() => {
        return {
            // Cria um componente de acordo com o tipo de dado
            component: ((): string => {
                switch (schema.type) {
                    case "string":
                        return "Input";
                    case "number":
                    case "integer":
                        return "Input";
                    case "boolean":
                        return "Input";
                    // case "object":
                    //     return Object;
                    case "array":
                        return "Multiple";
                    default:
                        return "Input";
                }
            })(),

            // Cria as props do componente de acordo com o tipo de dado
            componentProps: (() => {
                let newSchema = {};

                switch (schema.type) {
                    case "string":
                        newSchema = parseSchema(schema, "text");
                        break;
                    case "number":
                    case "integer":
                        newSchema = parseSchema(schema, "number");
                        break;
                    case "boolean":
                        newSchema = parseSchema(schema, "checkbox");
                        break;
                    case "object":
                        newSchema = parseSchema(schema);
                        break;
                    case "array":
                        newSchema = parseSchema(schema);
                        break;

                    default:
                        newSchema = parseSchema(schema, "text");
                        break;
                }
                return newSchema;
            })() as FieldSchema,
        };
    }, [schema]);

    return {
        componentProps,
        component,
    };
};
