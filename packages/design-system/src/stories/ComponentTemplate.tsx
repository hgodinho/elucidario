import React from "react";
import { Box, Form } from "@/components";

type ComponentTemplateProps = {
    children?: React.ReactNode;
};

export const ComponentTemplate = (props: ComponentTemplateProps) => {
    return <Form><Box className="p-10">{props.children}</Box></Form>;
};
