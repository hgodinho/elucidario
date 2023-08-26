import React from "react";
import { Box, Form } from "@/components";

type ComponentTemplateProps = {
    children?: React.ReactNode;
    form?: boolean;
};

export const ComponentTemplate = (props: ComponentTemplateProps) => {
    let { children, form } = props;
    form = form !== undefined || false;
    const Component = <Box className="p-10">{children}</Box>;
    return form ? <Form>{Component}</Form> : Component;
};
