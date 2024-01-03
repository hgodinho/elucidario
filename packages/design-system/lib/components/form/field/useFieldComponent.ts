import React, { useMemo, useCallback, FC } from "react";
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
                name:
                    typeof schema.title !== "undefined"
                        ? (schema.title as string)
                        : "",
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

    const fieldSchema = useMemo(() => {
        // Cria as props do componente de acordo com o tipo de dado
        let fieldSchema = {};

        switch (schema.type) {
            case "string":
                fieldSchema = parseSchema(schema, "text");
                break;
            case "number":
            case "integer":
                fieldSchema = parseSchema(schema, "number");
                break;
            case "boolean":
                fieldSchema = parseSchema(schema, "checkbox");
                break;
            case "object":
                fieldSchema = parseSchema(schema);
                break;
            case "array":
                fieldSchema = parseSchema(schema);
                break;

            default:
                fieldSchema = parseSchema(schema, "text");
                break;
        }

        return fieldSchema as FieldSchema;
    }, [schema, parseSchema]);

    return fieldSchema;
};
