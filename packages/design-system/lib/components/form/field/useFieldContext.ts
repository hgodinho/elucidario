import React, { useContext } from "react";

import { FieldContext } from "./FieldProvider";

const useFieldContext = () => {
    const context = useContext(FieldContext);
    if (!context) {
        throw new Error(
            "Field components cannot be rendered outside the Field component",
        );
    }
    return context;
};

export default useFieldContext;
