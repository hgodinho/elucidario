import { Validator } from "jsonschema";
import type { Schema as JsonSchema, ValidationError } from "jsonschema";

import {
    ValidateProps,
    SchemaValidatorInterface,
    Schema,
    DataTypes,
} from "@elucidario/pkg-types";

/**
 * SchemaValidator
 */
export class SchemaValidator implements SchemaValidatorInterface {
    /**
     * Validator instance
     */
    validator: Validator;

    /**
     * Errors
     */
    errors: ValidationError[] | undefined;

    /**
     * Constructor
     */
    constructor() {
        this.validator = new Validator();
    }

    /**
     *  Validate data against a schema
     * @param schema | Schema to validate against
     * @param data | Data to validate
     * @param returnType | Return type of the validation
     * @param schemas | Array of schemas to add to the validator
     */
    validate({ schema, data, returnType = "boolean", schemas }: ValidateProps) {
        this.addSchemas(schemas);

        const validate = this.validator.validate(data, schema);
        this.errors = validate.errors;

        if (returnType === "boolean") {
            return validate.valid;
        }
        return validate;
    }

    /**
     *  Add schemas to the validator
     * @param schemas | Array of schemas to add to the validator
     */
    addSchemas(schemas?: Schema<DataTypes>[]): void {
        if (typeof schemas !== "undefined" && schemas.length > 0) {
            schemas.forEach((schema) =>
                this.validator.addSchema(schema as JsonSchema),
            );
        }
    }

    /**
     * Get errors
     * @returns Errors
     */
    getErrors(): ValidationError[] | undefined {
        return this.errors;
    }
}
