import React from "react";
import type { Input as InputType } from "@elucidario/pkg-types";
import { useFormContext } from "react-hook-form";
import { useFieldContext } from "../field";

export const Input: InputType = ({ children, ...props }) => {

    const { componentProps, name, } = useFieldContext();
    // const { register } = useFormContext();

    const className = [
        "input",
        "p-2",
        "text-md",

        "text-black",
        "dark:text-white",

        "border",
        "border-blue",
        "bg-transparent",

        "focus:ring",
        "focus:ring-blue",
        "focus:outline-none",
        "focus:border-blue",
    ];

    // const options = register(props.name);

    // console.warn({ options, componentProps, name });

    return (
        <input className={className.join(' ')} {...props} />
    );
};
