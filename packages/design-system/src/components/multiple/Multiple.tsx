import React from "react";
import { MultipleProps } from "@elucidario/pkg-types"

export const Multiple = ({ schema, fields }: MultipleProps) => {
    console.log('Multiple', {
        schema,
        fields
    })
    return (
        <div className="multiple">
            'ola mundo'
        </div>
    )
}