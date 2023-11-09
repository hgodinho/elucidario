import React from "react";

export type BoxProps = {
    children?: React.ReactNode;
    className?: string;
};

export const Box = ({ children, className }: BoxProps) => {
    return <div className={`box ${className}`}>{children}</div>;
};
