import type { Mapping, BaseSchema, DataTypes, Status } from "../types";
/**
 *  Convert array of strings to markdown string
 * @param values | string[]
 * @param join | string
 * @returns string
 */
export declare const toMD: (values: string[], join?: string) => string;
/**
 *  Cria cabeçalho do markdown
 * @param title | string
 * @param description | string
 * @returns | string
 */
export declare const headerTemplate: (title: string, description: string) => string;
export declare const status: (status: Status) => string;
/**
 * Cria tabela de mapeamento
 * @param map | Mapping
 * @returns | string
 */
export declare const mappingTable: (map: Mapping | undefined) => string;
/**
 *  Resolve referência de um objeto
 * @param ref | string
 * @returns | string
 */
export declare const resolveRef: (ref: string) => string;
/**
 *  Define o bloco de documentação de um metadado
 * @param key | string
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export declare const metadata: (key: string, metadata: BaseSchema<DataTypes>, top: string) => string;
/**
 *  Cria linha que descreve o tipo do metadado
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export declare const metaType: (metadata: BaseSchema<DataTypes>) => string;
/**
 *  Cria tabela de propriedades
 * @param metadata | BaseSchema<DataTypes>
 * @returns | string
 */
export declare const metadataProperties: (metadata: BaseSchema<DataTypes>) => string;
//# sourceMappingURL=markdown.d.ts.map