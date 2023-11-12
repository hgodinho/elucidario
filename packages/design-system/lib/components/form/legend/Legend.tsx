import React from "react";

import type { LegendProps } from "@elucidario/pkg-types";

export const Legend = ({ children, ...legendProps }: LegendProps) => {
    return (
        <legend {...legendProps} className="legend font-bold">
            <>{children}</>
        </legend>
    );
};
