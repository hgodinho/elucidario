import React from "react";

import type { ButtonProps } from "@elucidario/pkg-types";

export const Button: React.FC<ButtonProps> = ({ children, ...props }: ButtonProps) => {
    return <button {...props}><>{children}</></button>;
};
