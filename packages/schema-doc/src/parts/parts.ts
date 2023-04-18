import {
    Mapping,
    BaseSchema,
    DataTypes,
    AnyOfSchema,
    OneOfSchema,
    ArraySchema,
    Entity,
} from "@elucidario/types";

import {
    table,
    toMD,
    backToTop,
    heading,
    boldItalic,
    codeInline,
} from "@elucidario/pkg-docusaurus-md";

/**
 * Cria tabela de mapeamento
 * @param map | Mapping
 * @returns | string
 */
export const mappingTable = (map: Mapping | undefined) => {
    if (!map) {
        return "";
    }
    try {
        return table({
            title: "Mapeamento",
            titleLevel: 4,
            headers: ["Vocabulário", "Link"],
            rows: Object.entries(map).map(([key, value]) => [key, `<${value}>`]),
        });
    } catch {
        throw new Error("Erro ao criar tabela de mapeamento");
    }
};

/**
 *  Resolve referência de um objeto
 * @param ref | string
 * @returns | string
 */
export const resolveRef = (ref: string, code = false) => {
    try {
        if (ref.startsWith('http')) {
            return `[${ref}](${ref})`;
        }

        let link = "";
        let [file, part] = ref.split("#");

        if (file) {
            link = `${file.replace(".json", "")}`;
        }

        const [__, path, section] = part.split("/");

        link += `#${section}`;

        link = `[${code ? codeInline(section) : section}](${link.toLocaleLowerCase()})`;

        return link;
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao resolver referência");
    }
};

/**
 *  Define o bloco de documentação de um metadado
 * @param title | string
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const metadata = (
    title: string,
    metadata: Entity | BaseSchema<DataTypes>,
    top: boolean = false,
    headingLevel = 3
) => {
    return toMD([
        entityTable(metadata as Entity),
        mappingTable((metadata as BaseSchema<DataTypes>).map),
        top ? backToTop("Voltar para o topo") : "",
        "---",
    ]);
};

/**
 *  Cria linha que descreve o tipo do metadado
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const metaType = (
    metadata: BaseSchema<DataTypes> | AnyOfSchema | OneOfSchema
) => {
    const arrayMeta = metadata as ArraySchema;
    const anyOfMeta = metadata as unknown as AnyOfSchema;
    const oneOfMeta = metadata as unknown as OneOfSchema;

    if ("$ref" in metadata) {
        const link = resolveRef(metadata.$ref as string, true);
        return `> tipo $ref(${link})`;
    }

    switch (metadata.type) {
        case "array":
            if ("anyOf" in arrayMeta.items) {
                return `> tipo \`${anyOfMeta.type
                    }\` anyOf<${anyOfMeta.items.anyOf
                        .map((anyOf) => {
                            if ("$ref" in anyOf) {
                                return `${resolveRef(anyOf.$ref, true)}`;
                            }
                        })
                        .join(" | ")}>`;
            }
            if ("oneOf" in arrayMeta.items) {
                return `> tipo \`${oneOfMeta.type
                    }\` oneOf<${oneOfMeta.items.oneOf
                        .map((oneOf) => {
                            if ("$ref" in oneOf) {
                                return `${resolveRef(oneOf.$ref, true)}`;
                            }
                        })
                        .join(" | ")}>`;
            }
            return `> tipo array<[\`${arrayMeta.items.title
                }\`](#${arrayMeta.items.title?.toLocaleLowerCase()})>`;
        case "object":
            return `> tipo \`${metadata.type}\` com propriedades`;
        case "null":
            return `> tipo \`${metadata.type}\` (nulo)`;
        default:
            return `> tipo \`${metadata.type}\``;
    }
};

/**
 * Cria string que descreve o metadado
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const description = (metadata: BaseSchema<DataTypes>) => {
    return `${boldItalic("Descrição:")} ${metadata.description}`;
};

/**
 *  Cria tabela de propriedades
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const propertiesTable = (
    metadata: BaseSchema<DataTypes>,
    title: false | string | undefined = false,
    headingLevel = 4
): string => {
    if (!metadata.properties) {

        if (metadata.$ref) {
            return toMD([
                heading(
                    headingLevel,
                    metadata.title ? `\`${metadata.title}\`` : ""
                ),
                metaType(metadata),
                description(metadata),
            ]);
        }

        switch (metadata.type) {
            case "array":
                const items = metadata.items as BaseSchema<DataTypes>;

                if ("anyOf" in items || "oneOf" in items) {
                    return toMD([
                        heading(
                            headingLevel,
                            metadata.title ? `\`${metadata.title}\`` : ""
                        ),
                        metaType(metadata),
                        description(metadata),
                        mappingTable((metadata as BaseSchema<DataTypes>).map),
                    ]);
                }

                return propertiesTable(
                    items,
                    `\`${items.title}\``,
                    headingLevel
                );

            case "string":
                return toMD([
                    heading(
                        headingLevel,
                        metadata.title ? `\`${metadata.title}\`` : ""
                    ),
                    metaType(metadata),
                    description(metadata),
                    mappingTable((metadata as BaseSchema<DataTypes>).map),
                ]);

            case "integer":
                return toMD([
                    heading(
                        headingLevel,
                        metadata.title ? `\`${metadata.title}\`` : ""
                    ),
                    metaType(metadata),
                    description(metadata),
                    mappingTable((metadata as BaseSchema<DataTypes>).map),
                ]);

            default:
                console.log("default", { metadata });
                return "";
        }
    }

    const extraData: string[] = [];
    const pushExtraData = (data: string) => {
        if (data) {
            extraData.push(data);
            extraData.push("---");
        }
    };

    const tableData = table({
        headers: ["Nome", "Tipo", "Descrição", "Obrigatório"],
        rows: Object.entries(metadata.properties).map(([key, value]) => {
            const required =
                metadata.required && metadata.required.includes(key)
                    ? "Sim"
                    : "Não";

            if ("$ref" in value) {
                const link = resolveRef(value.$ref, true);
                return [key, `$ref(${link})`, "", required];
            }

            if (value.oneOf) {
                const oneOf = value.oneOf
                    .map((oneOf: any) => {
                        if ("$ref" in oneOf) {
                            return `${resolveRef(oneOf.$ref, true)}`;
                        }
                        switch (oneOf.type) {
                            case "array":
                                const nestedDescription = oneOf.description
                                    ? `${boldItalic("Descrição:")} ${oneOf.description
                                    }`
                                    : null;
                                const nestedOneOf = propertiesTable(
                                    oneOf as BaseSchema<DataTypes>,
                                    `\`${oneOf.title}\``,
                                    4
                                );
                                pushExtraData(nestedOneOf);

                                if (nestedDescription)
                                    pushExtraData(nestedDescription);

                                return `array<[\`${oneOf.items.title
                                    }\`](#${oneOf.items.title.toLocaleLowerCase()})>`;

                            default:
                                return `[\`${oneOf.title
                                    }\`](#${oneOf.title.toLocaleLowerCase()})`;
                        }
                    })
                    .join(" \\| ");

                return [key, `oneOf<${oneOf}>`, value.description, required];
            }

            switch (value.type) {
                case "array":
                    if ("anyOf" in value.items) {
                        return [
                            key,
                            `anyOf<${value.items.anyOf
                                .map((anyOf: any) => {
                                    if ("$ref" in anyOf) {
                                        return `${resolveRef(
                                            anyOf.$ref,
                                            true
                                        )}`;
                                    }
                                })
                                .join(" | ")}>`,
                            value.description,
                            required,
                        ];
                    }
                    if ("oneOf" in value.items) {
                        return [
                            key,
                            `oneOf<${value.items.oneOf
                                .map((oneOf: any) => {
                                    if ("$ref" in oneOf) {
                                        return `${resolveRef(
                                            oneOf.$ref,
                                            true
                                        )}`;
                                    }
                                })
                                .join(" | ")}>`,
                            value.description,
                            required,
                        ];
                    }

                    const nestedArray = toMD([
                        heading(4, `\`${value.title}\``),
                        metaType(value as BaseSchema<DataTypes>),
                        description(value.description),
                    ]);
                    const nestedArrayItem = propertiesTable(
                        value as BaseSchema<DataTypes>,
                        `\`${value.title}\``,
                        4
                    );

                    pushExtraData(nestedArray);

                    if (value.items.type === "array") {
                        const nestedNestedArray = toMD([
                            heading(4, `\`${value.items.title}\``),
                            metaType(value.items as BaseSchema<DataTypes>),
                            description(value.items.description),
                        ]);
                        pushExtraData(nestedNestedArray);
                    }

                    pushExtraData(nestedArrayItem);

                    return [
                        key,
                        `[\`${value.title
                        }\`](#${value.title.toLocaleLowerCase()})`,
                        value.description,
                        required,
                    ];

                case "object":
                    const nestedObject = propertiesTable(
                        value,
                        `\`${value.title}\``,
                        4
                    );
                    pushExtraData(nestedObject);

                    return [
                        key,
                        `[\`${value.title
                        }\`](#${value.title.toLocaleLowerCase()})`,
                        value.description,
                        required,
                    ];

                default:
                    return [key, value.type, value.description, required];
            }
        }),
    });

    return toMD([
        heading(headingLevel, title ? `\`${title}\`` : ""),
        metaType(metadata),
        description(metadata),
        tableData,
        mappingTable((metadata as BaseSchema<DataTypes>).map),
        extraData.length > 0 ? "---" : "",
        toMD(extraData),
    ]);
};

/**
 * Cria tabela de entidades
 * @param entity | Entity
 * @returns | string
 */
export const entityTable = (entity: Entity): string => {
    return toMD(
        Object.entries(entity.definitions).map(([key, value]) => {
            const definition = value as BaseSchema<DataTypes>;
            return propertiesTable(definition, `\`${key}\``, 3);
        })
    );
};
