import {
    Mapping,
    BaseSchema,
    DataTypes,
    AnyOfSchema,
    OneOfSchema,
    ArraySchema,
} from "@elucidario/types";

import { table, toMD, backToTop } from "@elucidario/docusaurus-md";

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
    top: boolean
) => {
    return toMD([
        `### \`${key}\``,
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
                return `> tipo \`${
                    anyOfMeta.type
                }\` anyOf<${anyOfMeta.items.anyOf
                    .map((anyOf) => {
                        if ("$ref" in anyOf) {
                            return `${resolveRef(anyOf.$ref, true)}`;
                        }
                    })
                    .join(" | ")}>`;
            }
            if ("oneOf" in arrayMeta.items) {
                return `> tipo \`${
                    oneOfMeta.type
                }\` oneOf<${oneOfMeta.items.oneOf
                    .map((oneOf) => {
                        if ("$ref" in oneOf) {
                            return `${resolveRef(oneOf.$ref)}`;
                        }
                    })
                    .join(" | ")}>`;
            }
            return `> tipo \`${arrayMeta.type}\``;
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
export const propertiesTable = (metadata: BaseSchema<DataTypes>) => {
    if (!metadata.properties) {
        return "";
    }
    return toMD([
        "#### Propriedades",
        toMD(
            [
                "| Nome | Tipo | Descrição | Obrigatório? |",
                "| ---- | ---- | --------- | ------------ |",
                ...Object.entries(metadata.properties).map(([key, value]) => {
                    if ("$ref" in value) {
                        const link = resolveRef(value.$ref);
                        return `| ${link} |  |  | ${
                            metadata.required && metadata.required.includes(key)
                                ? "Sim"
                                : "Não"
                        } |`;
                    }
                    return `| ${key} | ${value.type} | ${value.description} | ${
                        metadata.required && metadata.required.includes(key)
                            ? "Sim"
                            : "Não"
                    } |`;
                }),
            ],
            "\n"
        ),
    ]);
};
