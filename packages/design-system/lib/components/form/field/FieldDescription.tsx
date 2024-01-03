import React from "react";

import type { FieldDescriptionProps } from "@elucidario/pkg-types";

import { Box } from "@/components";

import useFieldContext from "./useFieldContext";

export const FieldDescription = (props: FieldDescriptionProps) => {

    const { description } = useFieldContext();

    const classNames = [
        "field-description",
        "text-black",
        "dark:text-white",
        "flex",
        "flex-row",
        "items-center",
    ];

    return description !== undefined ? (
        <Box className={classNames.join(' ')}>
            {/* <InfoCircledIcon className="w-5 h-5 mr-2" /> */}
            <p className="text-sm"><>{description}</></p>
        </Box>
    ) : null;
}