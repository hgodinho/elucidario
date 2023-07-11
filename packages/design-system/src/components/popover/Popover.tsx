import React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import type { PopoverProps } from "@elucidario/pkg-types";
import { Cross2Icon } from "@radix-ui/react-icons";

export const Popover = ({ Trigger, Content, contentProps }: PopoverProps) => {
    return (
        <RadixPopover.Root>
            <RadixPopover.Trigger>
                <Trigger className='popover-trigger ml-1' />
            </RadixPopover.Trigger>
            {/* <RadixPopover.Anchor>Anchor</RadixPopover.Anchor> */}
            <RadixPopover.Portal>
                <RadixPopover.Content className='popover-content w-64 ml-5 p-2 bg-white border-solid border border-gray-950' sideOffset={8}>
                    {Content ? <Content {...contentProps} /> : null}
                    <RadixPopover.Close className='popover-close absolute top-2 right-2'>
                        <Cross2Icon />
                    </RadixPopover.Close>
                    <RadixPopover.Arrow />
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
};