// import React, { HTMLAttributes, TableHTMLAttributes } from "react";
// import { Component } from "../generic";
// import type { LabelProps, LegendProps, InputType } from "./form";
// import type { MappingProps } from "../../../mdorim";
// import type { BoxProps } from "../box";

// import type { Schema } from "../../../schema.types";

// export type FieldSchema = Omit<Schema, 'required'> & {
//     required?: boolean;
//     type?: InputType;
// }

// export interface FieldContextProps {
//     schema: Schema;
//     translations?: Record<string, any>;
//     map?: MappingProps;
//     language?: string;
// }

// export type FieldContextProvider = FieldContextProps & {
//     label: React.ReactNode;
//     description?: React.ReactNode;
//     componentProps?: FieldSchema;
// }

// export type FieldRootProps = Component<HTMLAttributes<HTMLDivElement>> & {
//     render?: (fieldProps: FieldContextProps) => React.ReactNode;
// } & FieldContextProps;

// export type FieldLabelType = 'label' | 'legend';

// export type FieldLabelProps = (LabelProps | LegendProps) & {
//     type: FieldLabelType;
//     label?: React.ReactNode;
// }

// export type FieldDescriptionProps = BoxProps & {
//     description?: string;
// }

// export type FieldMappingProps = Component<TableHTMLAttributes<HTMLTableElement>> & {
//     map: MappingProps;
// }

// export type FieldProps =
//     Component<HTMLAttributes<HTMLDivElement>> &
//     FieldContextProps &
//     FieldDescriptionProps;
