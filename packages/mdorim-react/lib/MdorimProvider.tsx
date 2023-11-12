import React, { createContext, useEffect, useReducer } from "react";

import type { MdorimProvider as MdorimProviderType, MdorimAction, MdorimProviderState } from "@elucidario/pkg-types";

import Mdorim from "@elucidario/pkg-mdorim";

const mdorim = Mdorim.getInstance();

export const MdorimContext = createContext<MdorimProviderState | null>(null);

const MdorimProvider: MdorimProviderType = ({ children }) => {
    // create a reducer to manage the state of the mdorim instance
    const reducer = (state: MdorimProviderState, action: MdorimAction) => {
        switch (action.type) {
            case "create":
                return { ...state, ...action.payload };
            default:
                return { ...state };
        }
    };

    // initialize the state of the mdorim instance
    const [state, dispatch] = useReducer(reducer, { mdorim, loading: false });

    useEffect(() => {
        if (state.mdorim === null) {
            dispatch({
                type: "create",
                payload: {
                    loading: true,
                }
            });
        }
    }, [state.mdorim]);

    useEffect(() => {
        if (state.loading) {
            dispatch({
                type: "create",
                payload: {
                    loading: false,
                    mdorim: Mdorim.getInstance(),
                }
            });
        }
    }, [state]);

    return (
        <MdorimContext.Provider value={state}>
            {children}
        </MdorimContext.Provider>
    );
};

export default MdorimProvider;