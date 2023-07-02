import React from 'react';

export type Component = {
    as?: keyof JSX.IntrinsicElements;
    children?: React.ReactNode;
    id?: string;
    className?: string;
}