import { FieldsetHTMLAttributes, FormHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react"
import type { Component } from "../generic"

export type FormProps = Component<FormHTMLAttributes<HTMLFormElement>> & {
    children?: JSX.Element | JSX.Element[];
}

export type InputProps = InputHTMLAttributes<Omit<HTMLInputElement, 'children'>> & {
    type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
}

export type LabelProps = Component<LabelHTMLAttributes<HTMLLabelElement>> & {
    // htmlFor?: string;
}

export type LegendProps = Component<HTMLAttributes<HTMLLegendElement>> & {

}

