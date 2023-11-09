import { ElementType } from "react";

export type PopoverProps = {
    Trigger: ElementType;
    Content: ElementType;
    contentProps?: Record<string, any>;
};
