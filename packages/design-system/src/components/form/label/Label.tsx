import React from "react";

import type { LabelProps } from "@elucidario/pkg-types";

export const Label = ({ children, ...labelProps }: LabelProps) => {
    return (
        <label {...labelProps} className="label font-bold">
            {children}
        </label>
    );
};
