import { useContext } from "react";
import { MdorimContext } from "./MdorimProvider";
import { MdorimProviderState } from "@elucidario/pkg-types";

export const useMdorimContext = (): MdorimProviderState => {
    const context = useContext<MdorimProviderState | null>(MdorimContext);
    if (!context) {
        throw new Error(
            "useMdorimContext must be used within a MdorimProvider",
        );
    }
    return context;
};
