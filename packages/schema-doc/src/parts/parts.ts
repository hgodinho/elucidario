import {
    AnyOfSchema,
    ArraySchema,
    BaseSchema,
    DataTypes,
    Entity,
    Mapping,
    ObjectSchema,
    OneOfSchema,
    Schema,
} from "@elucidario/pkg-types";

import {
    backToTop,
    bold,
    codeBlock,
    codeInline,
    heading,
    table,
    toMD,
} from "@elucidario/pkg-docusaurus-md";

import path from "path";

import { kebabCase } from "lodash-es";

import i18n from "../i18n";

export type SupportedLanguages = "en" | "pt-BR";

/**
 * Cria tabela de mapeamento
 * @param map | Mapping
 * @param lang | SupportedLanguages
 * @returns | string
 */
export const mappingTable = (
    map?: Mapping | undefined,
    lang?: SupportedLanguages,
) => {
    i18n.setLocale(lang || "en");
    if (!map) {
        return "";
    }
    return table({
        title: i18n.__("Mapping"),
        titleLevel: 4,
        headers: [i18n.__("Vocabulary"), i18n.__("Link")],
        rows: Object.entries(map).map(([key, value]) => [key, `<${value}>`]),
    });
};

/**
 * Resolve referência de um metadado
 * @param ref | string
 * @param code | boolean
 * @param lang | SupportedLanguages
 * @returns | string
 */
export const resolveRef = (
    ref: string,
    code = false,
    base?: string,
    lang?: SupportedLanguages,
) => {
    i18n.setLocale(lang || "en");
    try {
        if (ref.startsWith("http")) {
            return `[${code ? codeInline(ref) : ref}](${ref})`;
        }
        let link = "";
        const pathObject = path.parse(ref);

        if (pathObject.dir && pathObject.dir.includes("<local>")) {
            if (!base) {
                throw new Error(
                    i18n.__(
                        `Found <local> definition but no base parameter. ref: %s`,
                        ref,
                    ),
                );
            }
            link = `[${
                code ? codeInline(pathObject.name) : pathObject.name
            }](${pathObject.dir.replace("<local>", base)}/${
                pathObject.name ? pathObject.name.toLocaleLowerCase() : ""
            })`;
        } else {
            link = `[${
                code ? codeInline(pathObject.name) : pathObject.name
            }](#${pathObject.name.toLocaleLowerCase()})`;
        }

        return link;
    } catch (error) {
        throw error;
    }
};

/**
 * Cria linha que descreve o tipo do metadado
 * @param metadata | BaseSchema<DataTypes> | AnyOfSchema | OneOfSchema
 * @param lang | SupportedLanguages
 * @returns | string
 */
export const metaType = (
    metadata: BaseSchema<DataTypes> | AnyOfSchema | OneOfSchema,
    lang?: SupportedLanguages,
    custom?: (
        metadata: BaseSchema<DataTypes> | AnyOfSchema | OneOfSchema,
    ) => string,
    base?: string,
) => {
    i18n.setLocale(lang || "en");

    if (custom) {
        return custom(metadata);
    }

    if ("$ref" in metadata) {
        const link = resolveRef(metadata.$ref as string, true, base);
        const type = i18n.__("type $ref(%s)", link);
        return `> ${type}`;
    }

    switch (metadata.type) {
        case "array":
            if ("anyOf" in (metadata as ArraySchema).items) {
                const type = i18n.__(
                    "type %s<%s>",
                    metadata.type,
                    `anyOf<${(metadata as AnyOfSchema).items.anyOf
                        .map((anyOf) => {
                            if ("$ref" in anyOf) {
                                return `${resolveRef(anyOf.$ref, true, base)}`;
                            }
                        })
                        .join(" | ")}>`,
                );
                return `> ${type}`;
                // return `> tipo \`${metadata.type
                //     }\` anyOf<${metadata.items.anyOf
                //         .map((anyOf) => {
                //             if ("$ref" in anyOf) {
                //                 return `${resolveRef(anyOf.$ref, true, base)}`;
                //             }
                //         })
                //         .join(" | ")}>`;
            }
            if ("oneOf" in (metadata as ArraySchema).items) {
                return `> ${i18n.__("type")} \`${metadata.type}\` oneOf<${(
                    metadata as OneOfSchema
                ).items.oneOf
                    .map((oneOf) => {
                        if ("$ref" in oneOf) {
                            return `${resolveRef(oneOf.$ref, true, base)}`;
                        }
                    })
                    .join(" | ")}>`;
            }
            if ("title" in (metadata as ArraySchema).items) {
                const type = i18n.__(
                    "type array<%s>",
                    `[\`${(metadata as ArraySchema).items.title}\`](#${
                        (metadata as ArraySchema).items.title
                            ? (
                                  (metadata as ArraySchema).items
                                      .title as string
                              ).toLocaleLowerCase()
                            : (metadata as ArraySchema).items.type
                    })`,
                );
                return `> ${type}`;
            } else {
                return `> ${i18n.__("type")} array<\`${
                    (metadata as ArraySchema).items.type
                }\`>`;
            }
        case "object":
            return `> ${i18n.__("type")} \`${metadata.type}\` ${i18n.__(
                "with properties",
            )}`;
        case null:
            return `> ${i18n.__("type")} \`${metadata.type}\``;
        case undefined:
            return "";
        default:
            return `> ${i18n.__("type")} \`${metadata.type}\``;
    }
};

/**
 * Cria string que descreve o metadado
 * @param metadata | Schema
 * @param label | string
 * @returns | string
 */
export const description = (
    metadata: Schema<DataTypes>,
    label = "Description",
) => {
    return metadata.description
        ? `${bold(label)}: ${metadata.description}`
        : "";
};

/**
 * Cria linha que representa a descrição do metadado
 * @param metadata | Schema
 * @param headingLevel | number
 * @param lang | SupportedLanguages
 * @returns | string
 */
export const baseMetadata = (
    metadata: Schema<DataTypes>,
    headingLevel = 3,
    lang?: SupportedLanguages,
    base?: string,
) => {
    i18n.setLocale(lang || "en");
    return toMD([
        heading(headingLevel, metadata.title ? `\`${metadata.title}\`` : ""),
        metaType(metadata),
        description(metadata),
        // mappingTable((metadata as BaseSchema<DataTypes>).map),
        backToTop(i18n.__("Back to top")),
        "---",
    ]);
};

/**
 * Cria linha que representa a descrição do metadado do tipo array
 * @param metadata | ArraySchema
 * @param headingLevel | number
 * @param lang | SupportedLanguages
 * @returns | string
 */
export const arrayMetadata = (
    metadata: ArraySchema,
    headingLevel = 3,
    lang?: SupportedLanguages,
    base?: string,
) => {
    i18n.setLocale(lang || "en");
    return toMD([
        heading(headingLevel, metadata.title ? `\`${metadata.title}\`` : ""),
        metaType(metadata),
        description(metadata),
        // mappingTable(metadata.map),
        backToTop(i18n.__("Back to top")),
        "---",
    ]);
};

export const examples = (
    metadata: BaseSchema<DataTypes>,
    headingLevel: number,
    lang?: SupportedLanguages,
) => {
    i18n.setLocale(lang || "en");
    if (metadata.examples) {
        const examples = metadata.examples.map((example) => {
            return codeBlock(JSON.stringify(example, null, 2), "json");
        });
        return toMD([heading(headingLevel, i18n.__("Examples")), ...examples]);
    }
    return "";
};

/**
 * Cria linha que representa um metadado do tipo object
 * @param schema | ObjectSchema
 * @returns | string
 */
export const objectMetadata = (
    schema: ObjectSchema,
    headingLevel = 4,
    lang?: SupportedLanguages,
    base?: string,
): string => {
    i18n.setLocale(lang || "en");

    if (!schema.properties) {
        if (schema.$ref) {
            return toMD([
                heading(
                    headingLevel,
                    schema.title ? `\`${schema.title}\`` : "",
                ),
                metaType(schema),
                description(schema),
            ]);
        }

        if ("anyOf" in schema || "oneOf" in schema) {
            const subSchema = (schema.anyOf || schema.oneOf) as ObjectSchema[];
            return toMD([
                heading(
                    headingLevel,
                    schema.title ? `\`${schema.title}\`` : "",
                ),
                metaType(schema, lang, (metadata) => {
                    if ("anyOf" in metadata) {
                        return `> ${i18n.__("type")} \`${
                            metadata.type
                        }\` ${i18n.__("with `anyOf` properties")}`;
                    } else {
                        return `> ${i18n.__("type")} \`${
                            metadata.type
                        }\` ${i18n.__("with `oneOf` properties")}`;
                    }
                }),
                description(schema),
                heading(headingLevel + 2, i18n.__("Properties")),
                toMD(
                    subSchema.map((subSchema) => {
                        return objectMetadata(
                            subSchema,
                            headingLevel + 3,
                            lang,
                            base,
                        );
                    }),
                ),
                // mappingTable((schema as BaseSchema<DataTypes>).map),
                "---",
            ]);
        }

        return toMD([
            heading(headingLevel, schema.title ? `\`${schema.title}\`` : ""),
            metaType(schema),
            description(schema),
            examples(schema, headingLevel + 1, lang),
            // mappingTable((schema as BaseSchema<DataTypes>).map),
            "---",
        ]);

        // switch (schema.type) {
        //     case "array":
        //         const items = schema.items as BaseSchema<DataTypes>;

        //         if ("anyOf" in items || "oneOf" in items) {
        //             return toMD([
        //                 heading(
        //                     headingLevel,
        //                     schema.title ? `\`${schema.title}\`` : ""
        //                 ),
        //                 metaType(schema),
        //                 description(schema),
        //                 mappingTable((schema as BaseSchema<DataTypes>).map),
        //             ]);
        //         }

        //         return objectMetadata(
        //             items,
        //             `\`${items.title}\``,
        //             headingLevel,
        //             lang,
        // base
        //         );
        // }
    }

    const extraData: string[] = [];
    const pushExtraData = (data: string) => {
        if (data) {
            extraData.push(data);
            extraData.push("---");
        }
    };

    const headers = [
        i18n.__("Name"),
        i18n.__("Type"),
        i18n.__("Description"),
        i18n.__("Required"),
    ];

    const tableData = table({
        headers,
        rows: Object.entries(schema.properties ? schema.properties : {}).map(
            ([key, value]) => {
                const required =
                    schema.required &&
                    (typeof schema.required !== "boolean"
                        ? schema.required.includes(key)
                            ? i18n.__("Yes")
                            : i18n.__("No")
                        : schema.required === true
                          ? i18n.__("Yes")
                          : i18n.__("No"));

                if ("$ref" in value) {
                    const link = resolveRef(value.$ref as string, true, base);
                    return [key, `$ref(${link})`, "", required];
                }

                if (value.oneOf) {
                    const oneOf = value as OneOfSchema;

                    const type = oneOf.items.oneOf
                        .map((oneOf: any) => {
                            if ("$ref" in oneOf) {
                                return `${resolveRef(oneOf.$ref, true, base)}`;
                            }
                            switch (oneOf.type) {
                                case "array":
                                    const nestedDescription =
                                        description(oneOf);

                                    const nestedOneOf = objectMetadata(
                                        oneOf,
                                        headingLevel + 1,
                                        lang,
                                        base,
                                    );
                                    pushExtraData(nestedOneOf);
                                    pushExtraData(nestedDescription);

                                    return `array<[\`${
                                        oneOf.items.title
                                    }\`](#${oneOf.items.title.toLocaleLowerCase()})>`;

                                default:
                                    return `[\`${
                                        oneOf.title
                                    }\`](#${oneOf.title.toLocaleLowerCase()})`;
                            }
                        })
                        .join(" \\| ");

                    return [key, `oneOf<${type}>`, value.description, required];
                }

                const arrayMeta = value as ArraySchema;
                const objectMeta = value as ObjectSchema;

                switch (value.type) {
                    case "array":
                        if (
                            "type" in arrayMeta.items &&
                            arrayMeta.items.type === "object"
                        ) {
                            // if ("$ref"! in arrayMeta.items) {
                            //     const nestedProperties = objectMetadata(
                            //         arrayMeta.items as unknown as ObjectSchema,
                            //         headingLevel + 1,
                            //         lang
                            //     );
                            //     pushExtraData(nestedProperties);
                            // }
                            return [
                                key,
                                `array<[\`${
                                    arrayMeta.items.title
                                }\`](#${kebabCase(
                                    (
                                        arrayMeta.items.title as string
                                    )?.toLocaleLowerCase(),
                                )})>`,
                                arrayMeta.description,
                                required,
                            ];
                        }

                        if ("anyOf" in arrayMeta.items) {
                            return [
                                key,
                                `anyOf<${
                                    arrayMeta.items.anyOf
                                        ? arrayMeta.items.anyOf
                                              .map((anyOf: any) => {
                                                  if ("$ref" in anyOf) {
                                                      return `${resolveRef(
                                                          anyOf.$ref,
                                                          true,
                                                          base,
                                                      )}`;
                                                  } else {
                                                      return `\`${JSON.stringify(
                                                          anyOf,
                                                      )}\``;
                                                  }
                                              })
                                              .join(" - ")
                                        : ""
                                }>`,
                                arrayMeta.description,
                                required,
                            ];
                        }
                        if ("oneOf" in arrayMeta.items) {
                            return [
                                key,
                                `oneOf<${
                                    arrayMeta.items.oneOf
                                        ? arrayMeta.items.oneOf
                                              .map((oneOf: any) => {
                                                  if ("$ref" in oneOf) {
                                                      return `${resolveRef(
                                                          oneOf.$ref,
                                                          true,
                                                          base,
                                                      )}`;
                                                  }
                                              })
                                              .join(" | ")
                                        : ""
                                }>`,
                                arrayMeta.description,
                                required,
                            ];
                        }

                        if (
                            arrayMeta.items.type !== "string" &&
                            arrayMeta.items.type !== "number" &&
                            arrayMeta.items.type !== "boolean"
                        ) {
                            const nestedArray = arrayMetadata(
                                arrayMeta,
                                headingLevel + 1,
                                lang,
                            );

                            pushExtraData(nestedArray);
                            const nestedArrayItem = objectMetadata(
                                value as ObjectSchema,
                                headingLevel + 1,
                                lang,
                                base,
                            );
                            if (arrayMeta.items.type === "array") {
                                const nestedNestedArray = toMD([
                                    heading(
                                        headingLevel + 2,
                                        `\`${arrayMeta.items.title}\``,
                                    ),
                                    metaType(
                                        arrayMeta.items as BaseSchema<DataTypes>,
                                    ),
                                    description(arrayMeta),
                                ]);
                                pushExtraData(nestedNestedArray);
                            }
                            pushExtraData(nestedArrayItem);
                        } else {
                            return [
                                key,
                                `array<\`${arrayMeta.items.type}\`>`,
                                arrayMeta.description,
                                required,
                            ];
                        }

                        return [
                            key,
                            `[\`${
                                arrayMeta.title
                            }\`](#${arrayMeta.title?.toLocaleLowerCase()})`,
                            arrayMeta.description,
                            required,
                        ];

                    case "object":
                        const nestedObject = objectMetadata(
                            objectMeta,
                            headingLevel + 1,
                            lang,
                            base,
                        );
                        pushExtraData(nestedObject);

                        return [
                            key,
                            `[\`${
                                objectMeta.title
                            }\`](#${objectMeta.title?.toLocaleLowerCase()})`,
                            objectMeta.description,
                            required,
                        ];

                    default:
                        return [key, value.type, value.description, required];
                }
            },
        ) as string[][],
    });

    return toMD([
        heading(headingLevel, schema.title ? `\`${schema.title}\`` : ""),
        metaType(schema),
        description(schema),
        tableData,
        examples(schema, headingLevel + 1, lang),
        // mappingTable((schema as BaseSchema<DataTypes>).map),
        extraData.length > 0 ? "---" : "",
        toMD(extraData),
    ]);
};

/**
 * Define o bloco de documentação de um metadado
 * @param title | string
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export const metadata = (
    schema: BaseSchema<DataTypes>,
    headingLevel = 4,
    lang?: SupportedLanguages,
    base?: string,
) => {
    switch (schema.type) {
        case "array":
            return arrayMetadata(
                schema as ArraySchema,
                headingLevel,
                lang,
                base,
            );
        case "object":
            return objectMetadata(
                schema as ObjectSchema,
                headingLevel,
                lang,
                base,
            );
        default:
            return baseMetadata(schema, headingLevel, lang, base);
    }
};

/**
 * Cria tabela de entidades
 * @param entity | Entity & { definitions?: Record<string, BaseSchema<DataTypes>> }
 * @param lang | SupportedLanguages
 * @param base | string
 * @returns | string
 */
export const entityTable = (
    entity: Entity & { definitions?: Record<string, BaseSchema<DataTypes>> },
    lang?: SupportedLanguages,
    base?: string,
): string => {
    return toMD([
        heading(2, i18n.__("Definitions")),
        ...(entity.definitions
            ? Object.entries(entity.definitions || []).map(([key, value]) => {
                  return metadata(value, 3, lang, base);
              })
            : ""),
    ]);
};

/**
 * Cria página de entidade
 * @param entity | Entity
 * @param lang | SupportedLanguages
 * @returns | string
 */
export const entityPage = (
    entity: Entity,
    lang?: SupportedLanguages,
    base?: string,
): string => {
    return toMD([
        entity.properties
            ? objectMetadata(entity as ObjectSchema, 2, lang, base)
            : "",
        entity.definitions
            ? entityTable(
                  entity as Entity & {
                      definitions: Record<string, BaseSchema<DataTypes>>;
                  },
                  lang,
                  base,
              )
            : "",
    ]);
};
