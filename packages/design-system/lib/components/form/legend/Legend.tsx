import React from "react";

import type { LegendProps } from "@elucidario/pkg-types";

export const Legend = ({ children, ...legendProps }: LegendProps) => {
    const className = [
        "label",
        "font-bold",
        "mb-3",

        "text-black",
        "dark:text-white",
    ];

    return (
        <legend {...legendProps} className={className.join(' ')}>
            <>{children}</>
        </legend>
    );
};
