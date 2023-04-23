import {
    Mapping,
    BaseSchema,
    DataTypes,
    AnyOfSchema,
    OneOfSchema,
    ArraySchema,
    Entity,
} from "@elucidario/pkg-types";

import {
    table,
    toMD,
    backToTop,
    heading,
    boldItalic,
    bold,
    codeInline,
} from "@elucidario/pkg-docusaurus-md";

import { kebabCase } from "lodash-es";

import i18n from "../i18n";

export type SupportedLanguages = "en" | "pt-BR";

/**
 * Cria tabela de mapeamento
 * @param map | Mapping
 * @returns | string
 */
export const mappingTable = (map: Mapping | undefined, lang?: SupportedLanguages) => {
    i18n.setLocale(lang || 'en');
    if (!map) {
        return "";
    }
    try {
        return table({
            title: "Mapeamento",
            titleLevel: 4,
            headers: [i18n.__("Vocabulary"), i18n.__("Link")],
            rows: Object.entries(map).map(([key, value]) => [
                key,
                `<${value}>`,
            ]),
        });
    } catch {
        throw new Error(i18n.__("Error at creating mapping table"));
    }
};

/**
 *  Resolve referência de um objeto
 * @param ref | string
 * @returns | string
 */
export const resolveRef = (ref: string, code = false, lang?: SupportedLanguages) => {
    i18n.setLocale(lang || 'en');
    try {
        if (ref.startsWith("http")) {
            return `[${ref}](${ref})`;
        }

        let link = "";
        let [file, part] = ref.split("#");

        if (file) {
            link = `${file.replace(".json", "")}`;
        }

        const [__, path, section] = part.split("/");

        link += `#${section}`;

        link = `[${code ? codeInline(section) : section
            }](${link.toLocaleLowerCase()})`;

        return link;
    } catch (error) {
        console.error(error);
        throw new Error(i18n.__("Error at resolving reference"));
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
    headingLevel = 3,
    lang?: SupportedLanguages
) => {
    i18n.setLocale(lang || 'en');

    return toMD([
        entityTable(metadata as Entity),
        mappingTable((metadata as BaseSchema<DataTypes>).map),
        top ? backToTop(i18n.__("Back to top")) : "",
        "---",
    ]);
};

/**
 *  Cria linha que descreve o tipo do metadado
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const metaType = (
    metadata: BaseSchema<DataTypes> | AnyOfSchema | OneOfSchema,
    lang?: SupportedLanguages
) => {
    i18n.setLocale(lang || 'en');

    const arrayMeta = metadata as ArraySchema;
    const anyOfMeta = metadata as unknown as AnyOfSchema;
    const oneOfMeta = metadata as unknown as OneOfSchema;

    if ("$ref" in metadata) {
        const link = resolveRef(metadata.$ref as string, true);
        const type = i18n.__("type $ref(%s)", link);
        return `> ${type}`;
    }

    switch (metadata.type) {
        case "array":
            if ("anyOf" in arrayMeta.items) {
                const type = i18n.__("type %s<%s>", anyOfMeta.type, `anyOf<${anyOfMeta.items.anyOf
                    .map((anyOf) => {
                        if ("$ref" in anyOf) {
                            return `${resolveRef(anyOf.$ref, true)}`;
                        }
                    })
                    .join(" | ")}>`);
                return `> ${type}`;
                // return `> tipo \`${anyOfMeta.type
                //     }\` anyOf<${anyOfMeta.items.anyOf
                //         .map((anyOf) => {
                //             if ("$ref" in anyOf) {
                //                 return `${resolveRef(anyOf.$ref, true)}`;
                //             }
                //         })
                //         .join(" | ")}>`;
            }
            if ("oneOf" in arrayMeta.items) {
                return `> ${i18n.__("type")} \`${oneOfMeta.type
                    }\` oneOf<${oneOfMeta.items.oneOf
                        .map((oneOf) => {
                            if ("$ref" in oneOf) {
                                return `${resolveRef(oneOf.$ref, true)}`;
                            }
                        })
                        .join(" | ")}>`;
            }
            if ("title" in arrayMeta.items) {
                const type = i18n.__("type array<%s>", `[\`${arrayMeta.items.title
                    }\`](#${arrayMeta.items.title?.toLocaleLowerCase()})`);
                return `> ${type}`;
            } else {
                return `> ${i18n.__("type")} array<\`${arrayMeta.items.type}\`>`;
            }
        case "object":
            return `> ${i18n.__("type")} \`${metadata.type}\` ${i18n.__(
                "with properties"
            )}`;
        case "null":
            return `> ${i18n.__("type")} \`${metadata.type}\` ({${i18n.__("null")}})`;
        default:
            return `> ${i18n.__("type")} \`${metadata.type}\``;
    }
};

/**
 * Cria string que descreve o metadado
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const description = (
    metadata: BaseSchema<DataTypes>,
    label = "Description"
) => {
    return metadata.description ? `${bold(label)}: ${metadata.description}` : "";
};

/**
 *  Cria tabela de propriedades
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const propertiesTable = (
    metadata: BaseSchema<DataTypes>,
    title: false | string | undefined = false,
    headingLevel = 4,
    lang?: SupportedLanguages
): string => {
    i18n.setLocale(lang || 'en');
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
                    headingLevel,
                    lang
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
        headers: [i18n.__("Name"), i18n.__("Type"), i18n.__("Description"), i18n.__("Required")],
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
                                    ? description(oneOf.description)
                                    : null;
                                const nestedOneOf = propertiesTable(
                                    oneOf as BaseSchema<DataTypes>,
                                    `\`${oneOf.title}\``,
                                    headingLevel + 1,
                                    lang
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
                    if (
                        "type" in value.items &&
                        value.items.type === "object"
                    ) {
                        const nestedProperties = propertiesTable(
                            value.items as BaseSchema<DataTypes>,
                            `\`${value.items.title}\``,
                            headingLevel + 1,
                            lang
                        );
                        pushExtraData(nestedProperties);
                        return [
                            key,
                            `array<[\`${value.items.title}\`](#${kebabCase(
                                value.items.title.toLocaleLowerCase()
                            )})>`,
                            value.description,
                            required,
                        ];
                    }

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
                                    } else {
                                        return `\`${JSON.stringify(anyOf)}\``;
                                    }
                                })
                                .join(" - ")}>`,
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
                        heading(headingLevel + 1, `\`${value.title}\``),
                        metaType(value as BaseSchema<DataTypes>),
                        description(value.description),
                    ]);

                    pushExtraData(nestedArray);

                    const nestedArrayItem = propertiesTable(
                        value as BaseSchema<DataTypes>,
                        `\`${value.title}\``,
                        headingLevel + 1,
                        lang
                    );
                    if (value.items.type !== "string") {
                        if (value.items.type === "array") {
                            const nestedNestedArray = toMD([
                                heading(
                                    headingLevel + 2,
                                    `\`${value.items.title}\``
                                ),
                                metaType(value.items as BaseSchema<DataTypes>),
                                description(value.items.description),
                            ]);
                            pushExtraData(nestedNestedArray);
                        }
                        pushExtraData(nestedArrayItem);
                    }

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
                        headingLevel + 1,
                        lang
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
