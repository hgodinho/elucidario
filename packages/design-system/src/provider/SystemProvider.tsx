import React, { createContext, useReducer } from "react";

import type {
    SystemContextProvider,
    SystemContextProps,
    SystemState,
    SystemAction,
} from "@elucidario/pkg-types";
import { SystemActionTypes } from "./SystemActionTypes";

import { merge } from "lodash-es";

export const SystemContext = createContext<SystemContextProvider>({
    lang: "pt-BR",
});

export const SystemProvider = ({
    children,
    lang,
}: React.PropsWithChildren<{}> & SystemContextProps) => {

    const [state, dispatch] = useReducer(
        (state: SystemState, action: SystemAction) => {
            switch (action.type) {
                case SystemActionTypes.SET_LANG:
                    return { ...state, lang: action.payload };
                default:
                    throw new Error();
            }
        },
        {
            lang,
        },
    );

    const props: SystemState = merge({}, state, {
        // defaults
    });

    console.log("SystemContext.Provider", props);

    return (
        <SystemContext.Provider value={props}>
            {children}
        </SystemContext.Provider>
    );
};
