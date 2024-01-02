import { describe, it, expect } from "@jest/globals";
import path from "path";

import { getPaths, readFile } from "@elucidario/pkg-paths";
import { SchemaValidator } from "@elucidario/pkg-schema-validator";

const paths = getPaths();
const pubGenJson = readFile(
    path.resolve(
        paths.packages,
        "pub-gen",
        "static",
        "pub-gen",
        "schemas",
        "pub-gen-schema.json",
    ),
).content;

const validator = new SchemaValidator();

describe("pub-gen-schema", () => {
    it("should have a valid draft04 $schema", () => {
        expect(pubGenJson.$schema).toBe(
            "https://json-schema.org/draft-04/schema#",
        );
    });

    it("should have a valid $id", () => {
        expect(pubGenJson.$id).toBe(
            "https://elucidario.art/pub-gen/schema/pub-gen-schema.json",
        );
    });

    it("should have a valid title", () => {
        expect(pubGenJson.title).toBe("PubGen");
    });

    it("should have a valid description", () => {
        expect(pubGenJson.description).toBe("Configuration file for pub-gen");
    });

    it("should have a valid type", () => {
        expect(pubGenJson.type).toBe("object");
    });

    it("should have a valid property version", () => {
        expect(pubGenJson.properties.version).toEqual({
            title: "Version",
            type: "string",
            description: "Version of the configuration file.",
        });
    });

    it("should have a valid property type", () => {
        expect(pubGenJson.properties.type).toEqual({
            title: "Type",
            type: "string",
            enum: [
                "book",
                "article",
                "chapter",
                "conference",
                "dissertation",
                "thesis",
                "manual",
                "misc",
            ],
            description: "Type of the publication.",
        });
    });

    it("should have a valid property year", () => {
        expect(pubGenJson.properties.year).toEqual({
            title: "Year",
            type: "string",
            description: "Publication year.",
        });
    });

    it("pub-gen schema should validate against data", () => {
        const teste = readFile(
            path.resolve(
                getPaths().packages,
                "pub-gen",
                "tests",
                "schema",
                "data",
                "teste-1.json",
            ),
        ).content;

        const validate = validator.validate({
            schema: pubGenJson,
            data: teste,
        });

        if (!validate) console.log(validator.getErrors());

        expect(validate).toBeTruthy();
    });
});
