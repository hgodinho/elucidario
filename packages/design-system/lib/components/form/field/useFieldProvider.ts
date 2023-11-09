import { useContext } from "react";

import { FieldContext } from "./FieldProvider";

export const useFieldProvider = () => {
    const context = useContext(FieldContext);

    if (!context) {
        throw new Error(
            "Field components cannot be rendered outside the Field component"
        );
    }

    return context;
}