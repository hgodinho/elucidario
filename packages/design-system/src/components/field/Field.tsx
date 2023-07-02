import React from "react";

import { Label } from "../label";
import { Input } from "../input";
import { Legend } from "./Legend";
import type { FieldProps } from "@elucidario/pkg-types";

export const Field = ({
    id,
    as,
    label,
    type,
    legend,
    description,
}: FieldProps) => {
    let As = as || "div";
    if (legend) {
        As = "fieldset";
    }
    return (
        <As className="field flex flex-col mb-4">
            {legend ? (
                <Legend>{label}</Legend>
            ) : (
                <Label htmlFor={id}>{label}</Label>
            )}
            <Input id={id} type={type} value="Value" />
            <span className="description">{description}</span>
        </As>
    );
};
