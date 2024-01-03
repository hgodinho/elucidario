import React from "react";

import type { ButtonProps } from "@elucidario/pkg-types";

export const Button: React.FC<ButtonProps> = ({ children, ...props }: ButtonProps) => {
    const className = [
        "font-bold",

        "bg-blue",
        "dark:bg-transparent",

        "text-white",
        "dark:text-blue",

        "border-2",
        "border-blue",
        "dark:border-blue",

        "px-4",
        "py-2",

        "focus:ring",
        "focus:ring-blue",
        "focus:outline-none",
        "focus:border-blue"
    ];
    return <button className={className.join(' ')} {...props}><>{children}</></button>;
};
