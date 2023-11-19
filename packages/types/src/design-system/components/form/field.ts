import { FC, HTMLAttributes, TableHTMLAttributes, ReactNode } from "react";
import type { BoxProps, Component } from "@/design-system";
import type {
    DataTypes,
    MappingProps,
    MdorimProperties,
    Schema,
} from "@/mdorim";
import type { LabelProps, LegendProps, InputType } from "./form";

export type UseFieldComponent = (schema: Schema<DataTypes>) => FieldSchema;

export type FieldSchema = Omit<Schema<DataTypes>, "required"> & {
    required?: boolean;
    type?: InputType;
};

export interface FieldContextProps {
    schema: Schema<DataTypes>;
    name: MdorimProperties;
    translations?: Record<string, any>;
    map?: MappingProps;
    language?: string;
}

export type FieldContextProvider = FieldContextProps & {
    label: ReactNode;
    description?: ReactNode;
    componentProps?: FieldSchema;
};

export type FieldRootProps = Component<HTMLAttributes<HTMLDivElement>> &
    FieldContextProps;

export type FieldLabelType = "label" | "legend";

export type FieldLabelProps = (LabelProps | LegendProps) & {
    type: FieldLabelType;
    label?: ReactNode;
};

export type FieldDescriptionProps = BoxProps & {
    description?: string;
};

export type FieldMappingProps = Component<
    TableHTMLAttributes<HTMLTableElement>
> & {
    map: MappingProps;
};

export type FieldProps = Component<HTMLAttributes<HTMLDivElement>> &
    FieldContextProps &
    FieldDescriptionProps;

export type FieldType = {
    Provider: FC<FieldContextProvider>;
    Root: FC<FieldRootProps>;
    Label: FC<FieldLabelProps>;
    Description: FC<FieldDescriptionProps>;
};
