import React from "react";
import type { InputProps } from "@elucidario/pkg-types";

export const Input = (props: InputProps) => {
    return <input {...props} className="input p-2 text-md" />;
};
