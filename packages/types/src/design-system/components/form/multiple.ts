import { FC, HTMLAttributes } from "react";
import { BoxProps } from "../box";

export type MultipleProps = BoxProps<HTMLAttributes<HTMLDivElement>> & {
    schema?: Record<string, any>;
    fields?: {
        id: string;
        [key: string]: any;
    };
};

export type Multiple = FC<MultipleProps>;
