import React from "react";

import type { ButtonProps } from "@elucidario/pkg-types";

export const Button = ({ children, ...props }: ButtonProps) => {
    return <button {...props}>{children}</button>;
};
