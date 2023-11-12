import { BoxProps } from "@/design-system";
import { DataTypes, ObjectSchema, Schema } from "@/mdorim";
import { FC, HTMLAttributes } from "react";

export type ObjectProps = BoxProps<HTMLAttributes<HTMLDivElement>> & {
    schema: ObjectSchema;
};

export type Object = FC<ObjectProps>;
