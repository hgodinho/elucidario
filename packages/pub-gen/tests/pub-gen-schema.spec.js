import { describe, it, expect } from "@jest/globals";

import pubGenJson from "../dist/pub-gen-schema.json";

describe("pub-gen-schema", () => {
    it("should have a valid draft07 $schema", () => {
        expect(pubGenJson.$schema).toBe(
            "https://json-schema.org/draft-07/schema#"
        );
    });

    it("should have a valid $id", () => {
        expect(pubGenJson.$id).toBe(
            "https://elucidario.art/pub-gen/schema/pub-gen-schema.json"
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
});
