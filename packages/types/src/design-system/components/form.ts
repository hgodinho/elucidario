import { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from "react"
import type { Component } from "./generic"

export type InputProps = InputHTMLAttributes<Omit<HTMLInputElement, 'children'>> & {
    type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
}

export type LabelProps = Omit<Component, 'as'> & LabelHTMLAttributes<HTMLLabelElement> & {
    htmlFor?: string;
}

export type LegendProps = Omit<Component, 'as'> & HTMLAttributes<HTMLLegendElement> & {

}

export type FieldProps = Component & {
    label: string;
    type: InputProps['type'];
    legend?: boolean;
    description?: string;
}