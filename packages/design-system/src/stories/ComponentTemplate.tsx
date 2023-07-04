import React from "react";
import { Box } from "@/components";

type ComponentTemplateProps = {
    children?: React.ReactNode;
};

export const ComponentTemplate = (props: ComponentTemplateProps) => {
    return <Box className="p-10">{props.children}</Box>;
};
