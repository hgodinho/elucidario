import React from "react";
import type { FormProps } from "@elucidario/pkg-types";

export const Form = ({ children }: FormProps) => {
    console.log('Form', 'ola mundo')
    return (
        <form>
            {children}
        </form>
    )
}