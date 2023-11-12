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
    const url = new URL(id);
    const { origin, pathname, hash } = url;
    return {
        origin,
        pathname,
        hash,
        entityId: origin + pathname,
    };
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
     * Retorna um schema a partir de um id
     * @param id | string
     * @returns Entity | Schema | null
     */
    getFromId: (id) => {
        const { entityId, pathname, hash } = parseId(id);
        let entity: Entity | Schema<DataTypes> | null = null;
        if (pathname.includes("schemas/mdorim")) {
            entity = GlobalMdorim.getEntityFromIndex(entityId);
        }
        if (pathname.includes("schemas/linked-art")) {
            entity = GlobalMdorim.getEntityFromIndex(entityId, "linkedArt");
        }
        if (hash.startsWith("#/") && entity) {
            const [type, id] = hash.split("/").slice(1);
            if (
                entity.hasOwnProperty("definitions") &&
                type === "definitions"
            ) {
                entity = (entity.definitions as Definitions)[
                    id as MdorimProperties
                ] as Schema<DataTypes>;
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
