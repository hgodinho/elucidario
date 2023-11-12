import React from "react";

import type { FieldDescriptionProps } from "@elucidario/pkg-types";

import { Box } from "@/components";

import { useFieldProvider } from "./useFieldProvider";

export const FieldDescription = (props: FieldDescriptionProps) => {

    const { description } = useFieldProvider();

    return description !== undefined ? (
        <Box className="flex flex-row items-center">
            {/* <InfoCircledIcon className="w-5 h-5 mr-2" /> */}
            <p className="text-sm"><>{description}</></p>
        </Box>
    ) : null;
}