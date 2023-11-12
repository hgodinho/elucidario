import React from "react";

export interface MdorimContextProps {}

export interface MdorimContextProvider extends MdorimContextProps {
    children: React.ReactNode;
}

export type MdorimProvider = React.FC<MdorimContextProvider>;
