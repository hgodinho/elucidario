import { DataTypes, Schema } from "@/mdorim";
import type { ValidatorResult, ValidationError } from "jsonschema";

export interface ValidateProps {
    schema: Schema<DataTypes>;
    data: any;
    returnType?: "boolean" | "object";
    schemas?: Schema<DataTypes>[];
}

export interface SchemaValidatorInterface {
    validate(props: ValidateProps): ValidatorResult | boolean;

    addSchemas(schemas?: Schema<DataTypes>[]): void;

    getErrors(): ValidationError[] | undefined;
}
