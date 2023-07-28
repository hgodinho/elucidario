import React from "react";
import { MultipleProps } from "@elucidario/pkg-types"
import { Button } from "../button";
import { Field } from "../field";

export const Multiple = ({ schema, fields }: MultipleProps) => {
    console.log('Multiple', {
        schema,
        fields
    })
    return (
        <div className="multiple pl-3 border-l-2 border-gray-500">
            {!fields ? <p>no fields</p> : fields.map((field: any, index: number) => {
                return (
                    <div key={index} className="multiple__item">
                        {field}
                    </div>
                )
            })}
            <Button>{'Adicionar'}</Button>
        </div>
    )
}