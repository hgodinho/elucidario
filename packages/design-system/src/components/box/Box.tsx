import React from "react";

export type BoxProps = {
    height?: number | string;
    width?: number | string;
    margin?: number | string;
    bgColor?: string;
    children?: React.ReactNode;
    className?: string;
};

export const Box = ({
    height,
    width,
    bgColor,
    margin,
    children,
    className,
}: BoxProps) => {
    return (
        <div
            style={{
                height,
                width,
                backgroundColor: bgColor,
                margin,
            }}
        >
            {children}
        </div>
    );
};
