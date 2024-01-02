import { JSONSchema7 } from "json-schema";

import { merge } from "lodash-es";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import type $RefParserOptions from "@apidevtools/json-schema-ref-parser/dist/lib/options";
import { Console } from "@elucidario/pkg-console";
import fs from "fs";
import path from "path";
import { getPaths } from "@elucidario/pkg-paths";

const paths = getPaths();

const packageJson = JSON.parse(
    fs.readFileSync(
        path.resolve(paths.packages, "schema-doc", "package.json"),
        "utf8",
    ),
);
const console = new Console(packageJson);

export const mergeSubSchema = async (
    schema: JSONSchema7,
    options?: $RefParserOptions,
    method?: "dereference" | "bundle",
): Promise<JSONSchema7 | Error> => {
    try {
        method = method || "dereference";
        const parser = $RefParser[method];
        schema = (await parser(
            schema,
            options as $RefParserOptions,
        )) as JSONSchema7;

        let keyOf: string = "";
        if ("allOf" in schema) {
            keyOf = "allOf";
        } else if ("anyOf" in schema) {
            keyOf = "anyOf";
        } else if ("oneOf" in schema) {
            keyOf = "oneOf";
        }

        const schemasToBeReduced = (
            schema as JSONSchema7 & { [key: string]: any }
        )[keyOf] as JSONSchema7[];
        if (!schemasToBeReduced) {
            return schema;
        }

        let newSchema = merge(
            {},
            schema,
            schemasToBeReduced.reduce((acc, curr) => {
                return merge(curr, acc);
            }),
        ) as JSONSchema7;

        newSchema = merge({}, newSchema, schema);
        delete (newSchema as JSONSchema7 & { [key: string]: any })[keyOf];

        return newSchema;
    } catch (e: unknown) {
        console.log(e, {
            type: "error",
            defaultLog: true,
            title: "Error (mergeSubSchema)",
        });
        throw new Error(e as string, {
            cause: {
                schema,
                properties: schema.properties,
                options,
                method,
            },
        });
    }
};
