import { FC, HTMLAttributes } from "react";
import { BoxProps } from "../box";
import { FieldSchema } from "./field";

export type MultipleProps = BoxProps<HTMLAttributes<HTMLDivElement>> & {
    schema?: FieldSchema;
    fields?: {
        id: string;
        [key: string]: any;
    };
};

export type Multiple = FC<MultipleProps>;
