import React, { useEffect } from "react"
import { Object as ObjectType } from "@elucidario/pkg-types"
import { useMdorimContext } from "@elucidario/pkg-mdorim-react"

export const Object: ObjectType = (props) => {
    const { mdorim, loading } = useMdorimContext();

    useEffect(() => {
        console.warn({
            mdorim, loading
        })
    }, [mdorim, loading])

    return (
        <div className="object pl-3 border-l-2 border-gray-500">
            <p>aleleluiaaaaasdasd asd asd</p>
        </div>
    )
}