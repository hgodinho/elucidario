import { JSXElementConstructor } from 'react';

export type PopoverProps = {
    Trigger: JSXElementConstructor<any>;
    Content: JSXElementConstructor<any>;
    contentProps?: Record<string, any>;
}
