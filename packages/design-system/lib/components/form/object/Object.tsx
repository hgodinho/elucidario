import React, { useEffect } from "react"
import { Object as ObjectType } from "@elucidario/pkg-types"
import { Box, Field } from "@/components"
import useFieldContext from "../field/useFieldContext"

const ObjectComponent: ObjectType = (props) => {

    const { schema } = useFieldContext();

    const { properties } = schema;

    const className = [
        "object",
        "pl-3",
        "mb-3",
        "border-l-2",
        "border-blue",
    ];

    return (
        <Box className={className.join(' ')}>
            <>
                {Object.entries(properties).map(([name, schema], index) => {
                    return (
                        <Field.Root
                            key={index}
                            name={name}
                            schema={schema}
                        >
                            {name}
                        </Field.Root>
                    )
                })}
            </>
        </Box>
    )
}

export { ObjectComponent as Object };