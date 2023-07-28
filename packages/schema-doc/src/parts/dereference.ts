import $RefParser from "@apidevtools/json-schema-ref-parser";
import { JSONSchema7 } from "json-schema";
import type $RefParserOptions from "@apidevtools/json-schema-ref-parser/dist/lib/options";

export const dereference = async (
    schema: JSONSchema7,
    options?: $RefParserOptions,
): Promise<JSONSchema7 | Error> => {
    try {
        schema = await $RefParser.dereference(
            schema,
            options as $RefParserOptions
        ) as JSONSchema7;
    } catch (e: unknown) {
        throw new Error(e as string);
    }
    return schema;
};
