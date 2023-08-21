import React, { HTMLAttributes, TableHTMLAttributes } from "react";
import { Component } from "../generic";
import type { LabelProps, LegendProps } from "./form";
import type { MappingProps } from "../../../mdorim";
import type { BoxProps } from "../box";

export interface FieldContextProps {
    schema: Record<string, any>;
    translations?: Record<string, any>;
    map?: MappingProps;
    language?: string;
}

export type FieldContextProvider = FieldContextProps & {
    label: React.ReactNode;
    description?: React.ReactNode;
    componentProps?: Record<string, any>;
}

export type FieldRootProps = Component<HTMLAttributes<HTMLDivElement>> & {
    render?: (fieldProps: FieldRootProps) => React.ReactNode;
} & FieldContextProps;

export type FieldLabelType = 'label' | 'legend';

export type FieldLabelProps = (LabelProps | LegendProps) & {
    type: FieldLabelType;
    label?: React.ReactNode;
}

export type FieldDescriptionProps = BoxProps & {
    description?: string;
}

export type FieldMappingProps = Component<TableHTMLAttributes<HTMLTableElement>> & {
    map: MappingProps;
}

export type FieldProps =
    Component<HTMLAttributes<HTMLDivElement>> &
    FieldContextProps &
    FieldDescriptionProps;