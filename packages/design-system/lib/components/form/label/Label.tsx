import React from "react";

import type { LabelProps } from "@elucidario/pkg-types";

export const Label = ({ children, ...labelProps }: LabelProps) => {
    const className = [
        "label",
        "font-bold",
        "mb-3",

        "text-black",
        "dark:text-white",
    ];

    return (
        <label {...labelProps} className={className.join(' ')}>
            <>{children}</>
        </label>
    );
};
