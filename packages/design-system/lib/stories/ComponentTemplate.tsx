import React, { ReactNode } from "react";
import { Box, Form } from "@/components";
import { Body } from "@/templates";

type ComponentTemplateProps = {
    children?: ReactNode;
    form?: boolean;
};

export const ComponentTemplate = (props: ComponentTemplateProps) => {
    let { children, form } = props;
    form = form !== undefined ? form : false;
    const Component = <Box className="p-10">{children}</Box>;

    return (
        <Body>
            {form ? <Form.Form>{Component}</Form.Form> : Component}
        </Body>
    )
};
