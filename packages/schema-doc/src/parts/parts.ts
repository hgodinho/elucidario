import {
    Mapping,
    BaseSchema,
    DataTypes,
    AnyOfSchema,
    OneOfSchema,
    ArraySchema,
} from "@elucidario/types";

import {
    table,
    toMD,
    backToTop,
    heading,
    boldItalic,
} from "@elucidario/docusaurus-md";

/**
 * Cria tabela de mapeamento
 * @param map | Mapping
 * @returns | string
 */
export const mappingTable = (map: Mapping | undefined) => {
    if (!map) {
        return "";
    }
    return table({
        title: "Mapeamento",
        titleLevel: 4,
        headers: ["Vocabulário", "Link"],
        rows: Object.entries(map).map(([key, value]) => [key, `<${value}>`]),
    });
};

/**
 *  Resolve referência de um objeto
 * @param ref | string
 * @returns | string
 */
export const resolveRef = (ref: string, code = false) => {
    let link = "";
    let [base, topicBase] = ref.split("#");
    const [__, path, file] = base.split("/");
    if (base) {
        link = `./${file.split(".")[0]}.md`;
    }
    if (topicBase.startsWith("/")) {
        topicBase = topicBase.slice(1);
    }
    let [definitions, topic] = topicBase.split("/");
    link += `#${topic}`;
    if (code) {
        topic = `\`${topic}\``;
    }
    link = `[${topic}](${link.toLocaleLowerCase()})`;

    return link;
};

/**
 *  Define o bloco de documentação de um metadado
 * @param key | string
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const metadata = (
    key: string,
    metadata: BaseSchema<DataTypes>,
    top: boolean = false,
    headingLevel = 3
) => {
    return toMD([
        heading(headingLevel, `\`${key}\``),
        metaType(metadata),
        metadata.description,
        propertiesTable(metadata),
        mappingTable(metadata.map),
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
            return `> tipo array\\<[\`${arrayMeta.items.title}\`](#${arrayMeta.items.title?.toLocaleLowerCase()})\\>`;
        case "object":
            return `> tipo \`${metadata.type}\` com propriedades`;
        case "null":
            return `> tipo \`${metadata.type}\` (nulo)`;
        default:
            return `> tipo \`${metadata.type}\``;
    }
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
        switch (metadata.type) {
            case "array":
                const items = metadata.items as BaseSchema<DataTypes>;
                return propertiesTable(items, `\`${items.title}\``, 4);
            case "string":
                return toMD([
                    heading(
                        headingLevel,
                        metadata.title ? `\`${metadata.title}\`` : ""
                    ),
                    metaType(metadata),
                    `${boldItalic("Descrição:")} ${metadata.description}`,
                ]);
            default:
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
                const link = resolveRef(value.$ref);
                return [link, "", "", "", required];
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
                        `${boldItalic("Descrição:")} ${value.description}`,
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
                            `${boldItalic("Descrição:")} ${value.items.description}`,
                        ]);
                        pushExtraData(nestedNestedArray);
                    }

                    pushExtraData(nestedArrayItem);

                    return [
                        key,
                        `[\`${value.title}\`](#${value.title.toLocaleLowerCase()})`,
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
                        `[\`${value.title}\`](#${value.title.toLocaleLowerCase()})`,
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
        `${boldItalic("Descrição:")} ${metadata.description}`,
        tableData,
        extraData.length > 0 ? "---" : "",
        toMD(extraData),
    ]);
};
