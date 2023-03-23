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
    title: string;
    description: string;
    map?: Mapping;
    [x: string]: unknown;
};

export type Schema = BaseSchema<DataTypes>;

export type Definitions<T> = BaseSchema<
    T extends DataTypes ? DataTypes : 'object'
> & {
    properties?: {
        [x: string]: BaseSchema<DataTypes>;
    };
    $ref?: string;
    required?: string[];
};

export type Entity = BaseSchema<"object"> & {
    definitions: Definitions<DataTypes>;
};

export type MainEntity = {
    "@type": "DigitalDocument";
    ref: Entity;
};

export type Page = {
    "@type": "WebPage";
    title: string;
    description: string;
    mainEntity?: MainEntity;
};
