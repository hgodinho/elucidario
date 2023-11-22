import { useContext } from "react";
import { MdorimContext } from "./MdorimProvider";
import { MdorimContext as MdorimContextType } from "@elucidario/pkg-types";

export const useMdorimContext = () => {
    const context = useContext<MdorimContextType | null>(MdorimContext);
    if (!context) {
        throw new Error(
            "useMdorimContext must be used within a MdorimProvider",
        );
    }
    return context;
};
