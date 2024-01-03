import React from "react";
import { Mdorim } from "./mdorim";
import { Entity } from "./json-schema";

export interface MdorimContextProps {}

export interface MdorimContextProvider extends MdorimContextProps {
    children: React.ReactNode;
    context?: string;
}

export type MdorimProvider = React.FC<MdorimContextProvider>;

export type MdorimContext = Mdorim & {
    context: Entity | null;
    contextName: string | null;
};
