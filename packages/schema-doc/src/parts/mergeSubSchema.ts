import { JSONSchema7 } from 'json-schema';

import { merge } from 'lodash-es';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import type $RefParserOptions from '@apidevtools/json-schema-ref-parser/dist/lib/options';

export const mergeSubSchema = async (schema: JSONSchema7, options?: $RefParserOptions): Promise<JSONSchema7 | Error> => {
    try {
        schema = await $RefParser.dereference(schema, options as $RefParserOptions) as JSONSchema7;
        console.log('mergeSubSchema', { schema, options })
        let keyOf: string = '';
        if ('allOf' in schema) {
            keyOf = 'allOf';
        } else if ('anyOf' in schema) {
            keyOf = 'anyOf';
        } else if ('oneOf' in schema) {
            keyOf = 'oneOf';
        }

        const schemasToBeReduced = (schema as JSONSchema7 & { [key: string]: any })[keyOf] as JSONSchema7[];

        let newSchema = merge({}, schema, schemasToBeReduced.reduce((acc, curr) => {
            return merge(curr, acc);
        })) as JSONSchema7;

        newSchema = merge({}, newSchema, schema);
        delete (newSchema as JSONSchema7 & { [key: string]: any })[keyOf];

        return newSchema;
    } catch (e: unknown) {
        return new Error(e as string);
    }
}