import {
    FieldsetHTMLAttributes,
    FormHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    ReactNode,
    FC,
} from "react";
import type { Component } from "../generic";

export type FormProps = Component<FormHTMLAttributes<HTMLFormElement>> & {
    children?: ReactNode;
};

export type InputType =
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "checkbox";

export type InputProps = InputHTMLAttributes<
    Omit<HTMLInputElement, "children">
> & {
    type?: InputType;
};

export type Input = FC<InputProps>;

export type LabelProps = Component<LabelHTMLAttributes<HTMLLabelElement>> & {
    // htmlFor?: string;
};

export type LegendProps = Component<HTMLAttributes<HTMLLegendElement>> & {};
