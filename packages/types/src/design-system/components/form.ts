import { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react"
import type { Component } from "./generic"

export type FormProps = Omit<Component, 'as'> & {
    children?: JSX.Element | JSX.Element[];
}

export type InputProps = InputHTMLAttributes<Omit<HTMLInputElement, 'children'>> & {
    type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
}

export type LabelProps = Omit<Component, 'as'> & LabelHTMLAttributes<HTMLLabelElement> & {
    htmlFor?: string;
}

export type LegendProps = Omit<Component, 'as'> & HTMLAttributes<HTMLLegendElement> & {

}

export type FieldProps = Component & {
    schema: Record<string, any>;
    translations?: Record<string, any>;
    mapping?: Record<string, any>;
    language?: string;
}