import { Component } from "./generic"

export type MultipleProps = Omit<Component, 'as'> & {
    schema?: Record<string, any>;
    fields?: {
        id: string;
        [key: string]: any;
    },
}