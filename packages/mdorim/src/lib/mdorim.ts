import path from "path";
import { URL } from "url";
import { readContents, getPaths } from "@elucidario/pkg-paths";
import type {
    Mdorim,
    MdorimInstance,
    MdorimTypes,
    Index,
    Entity,
    Schema,
    MdorimProperties,
    parseId as parsedIdType,
    Definitions,
    LinkedArtTypes,
} from "@elucidario/pkg-types";

const { packages } = getPaths();

const __dirname = path.resolve(packages, "mdorim", "static", "mdorim");

/**
 * Verifica se o json é um schema
 * @param json | Record<string, any>
 * @returns boolean
 */
export const isSchema = (json: Record<string, any>) => {
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
                acc[schema.$id] = name;
            }
            return acc;
        },
        {} as Record<string, string>,
    );
};

/**
 * Inicializa o Mdorim
 * @param context | MdorimTypes Nome do contexto
 * @returns MdorimInstance
 */
export const init = (context?: MdorimTypes): MdorimInstance => {
    const contents = readContents({
        dirPath: __dirname,
        extensions: ["json"],
        index: false,
    });

    const mdorim = {
        ...contents,
        schemas: {
            ...contents.schemas,
            linkedArt: contents.schemas["linked-art"],
        } as MdorimInstance["schemas"],
    } as MdorimInstance;

    const index: Index = {
        mdorim: generateIndex(contents.schemas.mdorim),
        linkedArt: generateIndex(contents.schemas["linked-art"]),
        translation: generateIndex(contents.schemas.translation),
    };

    if (context) {
        context = mdorim.schemas.mdorim.hasOwnProperty(context)
            ? mdorim.schemas.mdorim[context]
            : null;
    }

    return {
        ...mdorim,
        context,
        index,
    };
};

/**
 * Singleton do Mdorim
 */
const MdorimSingleton: Mdorim = (() => {
    let instance: MdorimInstance | null = null;

    return {
        /**
         * Retorna a instância do Mdorim
         * @param context | MdorimTypes Nome do contexto
         * @returns | MdorimInstance
         */
        getInstance: (context) => {
            if (!instance || instance.context !== context) {
                instance = init(context);
            }
            return instance;
        },

        /**
         * Retorna um schema do Mdorim
         * @param name | string
         * @returns Entity
         */
        getSchema: (name, type = "mdorim") => {
            const mdorim = MdorimSingleton.getInstance();
            return mdorim.schemas[type][name];
        },

        /**
         * Retorna um schema a partir de um id
         * @param id | string
         * @returns Entity | Schema | null
         */
        getFromId: (id) => {
            const { entityId, pathname, hash } = parseId(id);
            let entity: Entity | Schema | null = null;
            if (pathname.includes("schemas/mdorim")) {
                entity = MdorimSingleton.getEntityFromIndex(entityId);
            }
            if (pathname.includes("schemas/linked-art")) {
                entity = MdorimSingleton.getEntityFromIndex(
                    entityId,
                    "linkedArt",
                );
            }
            if (hash.startsWith("#/") && entity) {
                const [type, id] = hash.split("/").slice(1);
                if (
                    entity.hasOwnProperty("definitions") &&
                    type === "definitions"
                ) {
                    entity = (entity.definitions as Definitions)[
                        id as MdorimProperties
                    ] as Schema;
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
            const mdorim = MdorimSingleton.getInstance();
            const entityName = mdorim.index[type][indexId];
            return MdorimSingleton.getSchema(entityName as MdorimTypes, type);
        },

        /**
         * Retorna uma tradução de uma propriedade
         * @param name | string
         * @returns Translation
         */
        getTranslation: (name) => {
            const mdorim = MdorimSingleton.getInstance();
            return mdorim.translations[name];
        },

        /**
         * Retorna todas as traduções
         * @returns Translations
         */
        getTranslations: () => {
            const mdorim = MdorimSingleton.getInstance();
            return mdorim.translations;
        },
    };
})();

export { MdorimSingleton as Mdorim };
