import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { getPaths } from "../lib/getPaths";

const paths = getPaths();
const pubGenJson = JSON.parse(
    fs.readFileSync(
        path.resolve(
            paths.pubGen,
            "static",
            "pub-gen",
            "schemas",
            "pub-gen-schema.json"
        )
    )
);

// ("../static/pub-gen/schema/pub-gen-schema.json");

describe("pub-gen-schema", () => {
    it("should have a valid draft04 $schema", () => {
        expect(pubGenJson.$schema).toBe(
            "https://json-schema.org/draft-04/schema#"
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
