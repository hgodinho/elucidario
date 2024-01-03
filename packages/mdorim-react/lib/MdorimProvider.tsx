import React, { createContext, useMemo } from "react";

import type {
    MdorimProvider as MdorimProviderType,
    MdorimContext as MdorimContextType,
    Entity,
} from "@elucidario/pkg-types";

import Mdorim from "@elucidario/pkg-mdorim";

export const MdorimContext = createContext<MdorimContextType | null>(null);

const MdorimProvider: MdorimProviderType = ({ children, context }) => {

    const mdorimContext: Entity | null = useMemo(() => {
        if (context !== undefined) {
            return Mdorim.getContext(context);
        }
        return null;
    }, [context]);

    // console.warn({ Mdorim })

    const value: MdorimContextType = {
        ...Mdorim,
        context: mdorimContext,
        contextName: context !== undefined ? context : null,
    }

    console.warn("MdorimProvider", value);

    return (
        <MdorimContext.Provider value={value}>
            {children}
        </MdorimContext.Provider>
    );
};

export default MdorimProvider;
