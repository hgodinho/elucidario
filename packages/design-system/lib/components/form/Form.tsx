import React from "react";
import type { FormProps } from "@elucidario/pkg-types";

export const Form = ({ children }: FormProps) => {
    return (
        <form><>
            {children}
        </></form>
    )
}