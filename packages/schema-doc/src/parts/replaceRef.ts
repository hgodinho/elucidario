import { Schema, DataTypes } from "@elucidario/pkg-types";

/**
 * Replace references in a schema.
 *
 * @param schema The schema to replace references in.
 * @param paths An array of paths to replace, in the form of `[[needle, replace]]`.
 * @returns The schema with replaced references.
 *
 * @example
 * ```ts
 *  const schema = {
 *     type: "object",
 *     properties: {
 *        foo: {
 *           $ref: "<example>/bar",
 *        },
 *     },
 * };
 *
 * const paths = [["example", "https://example.com/"]];
 *
 * const replaced = replaceRef(schema, paths);
 *
 * // {
 * //    type: "object",
 * //    properties: {
 * //        foo: {
 * //          $ref: "https://example.com/bar",
 * //        },
 * //     },
 * // }
 * ```
 */
export function replaceRef(
    schema: Schema<DataTypes>,
    paths: [string, string][],
) {
    return Object.fromEntries(
        Object.entries(schema).map(([key, value]) => {
            if ("$ref" === key) {
                const found = paths.find(([needle, replace]) => {
                    return (value as string).includes(`<${needle}>`);
                });
                if (found) {
                    value = (value as string).replace(
                        `<${found[0]}>`,
                        found[1],
                    );
                }
            } else if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                value = replaceRef(value as Schema<DataTypes>, paths);
            } else if (Array.isArray(value)) {
                value = value.map((v) =>
                    typeof v === "object" && v !== null
                        ? replaceRef(v as Schema<DataTypes>, paths)
                        : v,
                );
            }

            return [key, value];
        }),
    );
}
