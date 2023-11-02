import path from "path";
import { URL } from "url";
import { readContents, getPaths } from "@elucidario/pkg-paths";
import type { Mdorim, MdorimInstance, Entity, Translation, Translations, MdorimTypes } from '@elucidario/pkg-types';

const { packages } = getPaths();

const __dirname = path.resolve(packages, "mdorim", "static", "mdorim");

export const isSchema = (json: Record<string, any>) => {
    if (json.hasOwnProperty("$schema")) {
        return true;
    }
    return false;
};

export const init = (context?: MdorimTypes): MdorimInstance => {
    const mdorim = readContents({
        dirPath: __dirname,
        extensions: ["json"],
        index: false,
    }) as MdorimInstance;

    if (context) {
        context = mdorim.schemas.mdorim.hasOwnProperty(context)
            ? mdorim.schemas.mdorim[context]
            : null;
    }

    return {
        ...mdorim,
        context,
    };
};

const MdorimSingleton: Mdorim = (() => {
    let instance: MdorimInstance | null = null;

    return {
        getInstance: (context): MdorimInstance => {
            if (!instance || instance.context !== context) {
                instance = init(context);
            }
            return instance;
        },

        getSchema: (name): Entity => {
            const mdorim = MdorimSingleton.getInstance();
            return mdorim.schemas.mdorim[name];
        },

        getTranslation: (name: string): Translation => {
            const mdorim = MdorimSingleton.getInstance();
            return mdorim.translations[name];
        },

        getTranslations: (): Translations => {
            const mdorim = MdorimSingleton.getInstance();
            return mdorim.translations;
        }
    };
})();

export { MdorimSingleton as Mdorim };

// const schemas = Object.entries(mdorim).reduce((acc, [name, schema]) => {
//     // console.log({
//     //     acc,
//     //     name,
//     //     schema,
//     // });
//     if (isSchema(schema)) {
//         acc[name] = schema;
//     } else {
//         Object.entries(schema).map(([schemaName, schemaValue]) => {
//             if (isSchema(schemaValue)) {
//                 acc[`${name}.${schemaName}`] = schemaValue;
//             }
//         });
//     }
//     return acc;
// }, {});
