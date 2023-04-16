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
    [x: string]: unknown;
};

export type ArraySchema = BaseSchema<"array"> & {
    items: Pick<BaseSchema<DataTypes>, "type" | "title"> & {
        anyOf?: BaseSchema<DataTypes>[];
        oneOf?: BaseSchema<DataTypes>[];
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

export type Metadata = {
    $schema: string;
    title?: string;
    description: string;
    definitions: Record<string, BaseSchema<DataTypes>>;
};

export type Schema = BaseSchema<DataTypes>;

export type Definitions<T> = BaseSchema<
    T extends DataTypes ? DataTypes : "object"
> & {
    properties?: {
        [x: string]: BaseSchema<DataTypes>;
    };
    $ref?: string;
    required?: string[];
};

export type Entity = BaseSchema<"object"> & {
    definitions: Record<string, Definitions<DataTypes>>;
};

export type MainEntity = {
    "@type": "DigitalDocument";
    ref: Entity;
};

export type Status = {
    type: "success" | "info" | "warning" | "danger";
    title: string;
    description: string;
};

export type Page = {
    "@type": "WebPage" extends string ? "WebPage" : string;
    title: string;
    description: string;
    mainEntity: MainEntity;
    status: Status;
};
