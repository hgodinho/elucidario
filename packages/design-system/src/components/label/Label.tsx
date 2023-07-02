import React from "react";

import type { LabelProps } from "@elucidario/pkg-types";

export const Label = ({ children, ...labelProps }: LabelProps) => {
    return (
        <label className="label font-bold" {...labelProps}>
            {children}
        </label>
    );
};
