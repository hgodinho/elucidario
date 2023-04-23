import { JSONSchema7 } from 'json-schema';

import { merge } from 'lodash-es';
import $RefParser from '@apidevtools/json-schema-ref-parser';

export const mergeAllOfSchema = async (schema: JSONSchema7): Promise<JSONSchema7 | Error> => {
    try {
        schema = await $RefParser.dereference(schema) as JSONSchema7;

        let newSchema = merge({}, schema.allOf?.reduce((acc, curr) => {
            return merge(curr, acc);
        })) as JSONSchema7;

        newSchema = merge({}, newSchema, schema);
        delete newSchema.allOf;

        return newSchema;
    } catch (e: unknown) {
        return new Error(e as string);
    }
}