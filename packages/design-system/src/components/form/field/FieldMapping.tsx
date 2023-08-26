import React from "react";
import type { FieldMappingProps } from "@elucidario/pkg-types";

import { Popover } from "@/components/popover";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export const FieldMapping = ({ map, ...props }: FieldMappingProps) => {
    return (
        <Popover
            Trigger={InfoCircledIcon}
            Content={() => (
                <table className='table-auto' {...props}>
                    <thead>
                        <tr>
                            <td colSpan={2}><b>mapeamento</b> {map.version}</td>
                        </tr>
                        {map && map.mapping.length > 0 ? (
                            <tr>
                                <td><b>padrão</b></td>
                                <td><b>metadado</b></td>
                            </tr>
                        ) : null}
                    </thead>
                    <tbody>
                        {map && map.mapping.length > 0 ? (
                            map.mapping.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.standard}</td>
                                    <td><a href={row.link}>{row.metadata}</a></td>
                                </tr>
                            ))
                        ) : null}
                    </tbody>
                </table >
            )}
            contentProps={map}
        />
    )
}