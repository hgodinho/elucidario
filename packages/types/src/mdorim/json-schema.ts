import { MdorimProperties } from "./mdorim";

export type DataTypes =
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "array"
    | "object"
    | null;

export type Mapping = {
    [x: string]: string;
};

export type BaseSchema<T extends DataTypes> = {
    type: T;
    description?: string;
    title?: string;
    required?: string[] | boolean;
    examples?: any[];
    [x: string]: unknown;
};

export type ObjectSchema = BaseSchema<"object"> & {
    properties: Record<string, Schema<DataTypes>>;
    additionalProperties?: boolean;
};

export type ArraySchema = BaseSchema<"array"> & {
    items: Pick<Schema<DataTypes>, "type" | "title"> & {
        anyOf?: Schema<DataTypes>[];
        oneOf?: Schema<DataTypes>[];
    };
};

export type Ref = {
    $ref: string;
};

export type OneOfSchema = Omit<ArraySchema, "type"> & {
    type: "array";
    items: {
        oneOf: Ref[];
    };
};

export type AnyOfSchema = Omit<ArraySchema, "type"> & {
    type: "array";
    items: {
        anyOf: Ref[];
    };
};

export type Schema<T extends DataTypes> =
    | BaseSchema<T>
    | ObjectSchema
    | ArraySchema
    | OneOfSchema
    | AnyOfSchema;

export type Definitions = {
    [x in MdorimProperties]: Schema<DataTypes>;
};

export type Entity = ObjectSchema & {
    $schema: string;
    $id: string;
    definitions?: Definitions;
};

export type Status = {
    type: "success" | "info" | "warning" | "danger";
    title: string;
    description: string;
};

export type isSchema = (json: Record<string, any>) => json is Schema<DataTypes>;
