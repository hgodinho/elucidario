import React, { useMemo } from "react";
import type {
    FieldLabelProps,
    LabelProps,
    LegendProps,
} from "@elucidario/pkg-types";

import { Legend } from "../legend";
import { Label } from "../label";

import { useFieldProvider } from "./useFieldProvider";
import { FieldMapping } from "./FieldMapping";

export const FieldLabel = ({ children, type, ...props }: FieldLabelProps) => {
    const { label, map } = useFieldProvider();

    const Child = useMemo(() => {
        const X = children === undefined
            ? map !== undefined && <FieldMapping map={map} />
            : children;
        const fieldTitle = label !== undefined ? label : props.label !== undefined ? props.label : false;
        if (fieldTitle) {
            return (
                <>
                    {fieldTitle}
                    {X}
                </>
            )
        }
        return X;
    }, [children, label, props.label]);

    if ("legend" === type) {
        return (
            <Legend {...(props as LegendProps)}>
                {Child}
                {/* {children === undefined
                    ? map !== undefined && <FieldMapping map={map} />
                    : null} */}
            </Legend>
        );
    }
    return (
        <Label {...(props as LabelProps)}>
            {Child}
            {/* {children === undefined
                ? map !== undefined && <FieldMapping map={map} />
                : null} */}
        </Label>
    );
};
