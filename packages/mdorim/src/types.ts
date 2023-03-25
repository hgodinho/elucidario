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
    [x: string]: unknown;
};

export type Metadata = {
    '$schema': string;
    description: string;
    definitions: Record<string, BaseSchema<DataTypes>>
}

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
    "@type": "WebPage" extends string ? "WebPage" : string;
    title: string;
    description: string;
    mainEntity: MainEntity;
};
