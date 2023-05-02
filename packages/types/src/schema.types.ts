export type DataTypes =
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "array"
    | "object"
    | "null";

export type Mapping = {
    [x: string]: string;
};

export type BaseSchema<T extends DataTypes> = {
    type: T;
    description: string;
    title?: string;
    map?: Mapping;
    required?: string[];
    examples?: any[];
    [x: string]: unknown;
};

export type ObjectSchema = BaseSchema<"object"> & {
    properties?: Record<string, Schema>;
    additionalProperties?: boolean;
};

export type ArraySchema = BaseSchema<"array"> & {
    items: Pick<Schema, "type" | "title"> & {
        anyOf?: Schema[];
        oneOf?: Schema[];
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

export type Schema = BaseSchema<DataTypes> | ObjectSchema | ArraySchema | OneOfSchema | AnyOfSchema;

export type Entity = BaseSchema<DataTypes> & {
    definitions?: Record<string, Schema>;
};

export type Status = {
    type: "success" | "info" | "warning" | "danger";
    title: string;
    description: string;
};
