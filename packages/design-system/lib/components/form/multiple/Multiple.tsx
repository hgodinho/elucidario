import React from "react";
import { MultipleProps, Multiple as MultipleType } from "@elucidario/pkg-types"
import { Button } from "../../button";
// import { Field } from "../field";

export const Multiple: MultipleType = ({ schema, fields }) => {

    console.log('Multiple', {
        schema,
        fields
    })

    const className = [
        "multiple",
        "pl-3",
        "mb-3",
        "border-l-2",
        "border-blue",
    ];

    return (
        <div className={className.join(' ')}>
            {!fields ? null :
                fields.map((field: any, index: number) => {
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