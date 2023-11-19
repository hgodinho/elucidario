import Mdorim from "../../lib/mjs";

import mdorimCore from "../../static/mdorim/schemas/mdorim/core.json";
import mdorimConcept from "../../static/mdorim/schemas/mdorim/concept.json";

import linkedArtCore from "../../static/mdorim/schemas/linked-art/core.json";
import linkedArtObject from "../../static/mdorim/schemas/linked-art/object.json";

describe("Mdorim", () => {
    test("Mdorim instance", () => {
        const mdorim = Mdorim.getInstance();

        // expect(mdorim).toHaveProperty("examples");
        expect(mdorim).toHaveProperty("schemas");
        expect(mdorim).toHaveProperty("translations");
        expect(mdorim).toHaveProperty("index");
        expect(mdorim.index).toHaveProperty("linkedArt");
        expect(mdorim.index).toHaveProperty("mdorim");
        expect(mdorim.index).toHaveProperty("translation");
        expect(mdorim.schemas).toHaveProperty("mdorim");
        expect(mdorim.schemas).toHaveProperty("linkedArt");
        expect(mdorim.schemas).toHaveProperty("translation");
    });

    test("Mdorim getFromId from mdorim definitions", () => {
        const mdorim = Mdorim.getFromId(
            "https://elucidario.art/mdorim/schemas/mdorim/core.json#/definitions/entity_id",
        );
        expect(mdorim).toMatchObject(mdorimCore.definitions.entity_id);
    });

    test("Mdorim getFromId entity mdorim", () => {
        const mdorim = Mdorim.getFromId(
            "https://elucidario.art/mdorim/schemas/mdorim/concept.json",
        );
        expect(mdorim).toMatchObject(mdorimConcept);
    });

    test("Mdorim getFromId entity linked-art", () => {
        const linkedArt = Mdorim.getFromId(
            "https://elucidario.art/mdorim/schemas/linked-art/object.json",
        );
        expect(linkedArt).toMatchObject(linkedArtObject);
    });

    test("Mdorim getFromId entity linked-art with context", () => {
        const identified_by = Mdorim.getFromId(
            "#/definitions/identified_byProp",
            "linkedArt/core",
        );
        expect(identified_by).toMatchObject(
            linkedArtCore.definitions.identified_byProp,
        );
    });

    test("Mdorim getFromId from definitions linked-art", () => {
        const mdorim = Mdorim.getFromId(
            "https://elucidario.art/mdorim/schemas/linked-art/core.json#/definitions/identified_byProp",
        );
        expect(mdorim).toMatchObject(
            linkedArtCore.definitions.identified_byProp,
        );
    });
});
