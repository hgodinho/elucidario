import {
    Mdorim as MdorimType,
    MdorimInstance,
    MdorimTypes,
    Index,
    Entity,
    Schema,
    MdorimProperties,
    parseId as parsedIdType,
    Definitions,
    DataTypes,
    isSchema as isSchemaType,
    SchemaType,
} from "@elucidario/pkg-types";

import { mdorim, translation, translations, linkedArt } from "./json-imports";

/**
 * Verifica se o json é um schema
 * @param json | Record<string, any>
 * @returns boolean
 */
export const isSchema: isSchemaType = (json): json is Schema<DataTypes> => {
    if (json.hasOwnProperty("$schema")) {
        return true;
    }
    return false;
};

/**
 * Realiza o parse de um id
 * @param id | string
 * @returns ParsedId
 */
export const parseId: parsedIdType = (id) => {
    let url;
    try {
        url = new URL(id);
        const { origin, pathname, hash } = url;
        return {
            origin,
            pathname,
            hash,
            entityId: origin + pathname,
        };
    } catch {
        return false;
    }
};

/**
 * Gera o index de um schema
 * @param schemas | Record<string, any>
 * @returns | Record<string, string>
 */
export const generateIndex = (schemas: Record<string, any>) => {
    return Object.entries(schemas).reduce(
        (acc, [name, schema]) => {
            if (isSchema(schema)) {
                acc[schema.$id as string] = name;
            }
            return acc;
        },
        {} as Record<string, string>,
    );
};

export const index: Index = {
    mdorim: generateIndex(mdorim),
    linkedArt: generateIndex(linkedArt),
    translation: generateIndex(translation),
};

export const mdorimInstance: MdorimInstance = {
    // examples,
    translations,
    schemas: {
        mdorim,
        linkedArt,
        translation,
    },
    index,
};

const kebabize = (str: string) =>
    str.replace(
        /[A-Z]+(?![a-z])|[A-Z]/g,
        ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
    );

/**
 * GlobalMdorim
 */
export const GlobalMdorim: MdorimType = {
    /**
     * Retorna a instância do Mdorim
     * @returns | MdorimInstance
     */
    getInstance: () => {
        return mdorimInstance;
    },

    /**
     * Retorna um schema do Mdorim
     * @param name | string
     * @returns Entity
     */
    getSchema: (name, type = "mdorim") => {
        typeof type === "undefined" ? (type = "mdorim") : (type = type);
        return mdorimInstance.schemas[type][name];
    },

    /**
     * Retorna um schema do Mdorim a partir de um contexto
     * @param context | string
     * @returns Entity
     */
    getContext: (context) => {
        const [type, name] = context.split("/") as [SchemaType, string];
        return mdorimInstance.schemas[type][name];
    },

    /**
     * Retorna um schema a partir de um id
     * @param id | string
     * @param context | (string | undefined)
     * @returns Entity | Schema | null
     */
    getFromId: (id, context) => {
        const url = parseId(id);

        let entity: Entity | Schema<DataTypes> | null = null;

        if (url === false) {
            // id is not a url
            if (!context) {
                throw new Error(
                    "You must provide a context when id is not a url",
                );
            }
            const [type, name] = context.split("/") as [SchemaType, string];
            const uri = `https://elucidario.art/mdorim/schemas/${kebabize(
                type,
            )}/${name}.json${id}`;

            entity = GlobalMdorim.getFromId(uri);
        } else {
            // id is a url
            if (url.pathname.includes("schemas/mdorim")) {
                entity = GlobalMdorim.getEntityFromIndex(url.entityId);
            }
            if (url.pathname.includes("schemas/linked-art")) {
                entity = GlobalMdorim.getEntityFromIndex(
                    url.entityId,
                    "linkedArt",
                );
            }
            if (url.hash.startsWith("#/") && entity) {
                const [type, id] = url.hash.split("/").slice(1);
                if (
                    entity.hasOwnProperty("definitions") &&
                    type === "definitions"
                ) {
                    entity = (entity.definitions as Definitions)[
                        id as MdorimProperties
                    ] as Schema<DataTypes>;
                }
            }
        }

        return entity;
    },

    /**
     * Retorna um schema do Mdorim a partir de um index
     * @param indexId | string
     * @param type | linkedArt | mdorim
     * @returns Entity
     */
    getEntityFromIndex: (indexId, type = "mdorim") => {
        const entityName = mdorimInstance.index[type][indexId];
        return GlobalMdorim.getSchema(entityName as MdorimTypes, type);
    },

    /**
     * Retorna uma tradução de uma propriedade
     * @param name | string
     * @returns Translation
     */
    getTranslation: (name) => {
        return mdorimInstance.translations[name];
    },

    /**
     * Retorna todas as traduções
     * @returns Translations
     */
    getTranslations: () => {
        return mdorimInstance.translations;
    },
};
