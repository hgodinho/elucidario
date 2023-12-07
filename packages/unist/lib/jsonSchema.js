import { u } from "unist-builder";

export function jsonSchema(schema) {
    return u("text", JSON.stringify(schema));
}
