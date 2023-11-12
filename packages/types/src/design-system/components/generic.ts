import React, { ElementType } from "react";

// export type LabelProps = Omit<Component, 'as'> & LabelHTMLAttributes<HTMLLabelElement> & {
//     htmlFor?: string;
// }

// export type Component = {
//     as?: keyof JSX.IntrinsicElements;
//     children?: React.ReactNode;
//     id?: string;
//     className?: string;
// }

export type Component<T> = T & {
    as?: keyof JSX.IntrinsicElements;
};
