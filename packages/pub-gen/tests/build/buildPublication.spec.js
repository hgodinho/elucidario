import { buildPublication } from "../../lib/build/buildPublication.js";
import { createFixture, getFixture } from "../__fixtures__/index.js";

describe("buildPublication", () => {
    test("should build the docs", async () => {
        const manifest = await buildPublication({
            publication: "publicacao-teste",
        });

        const fixture = getFixture("buildPublication.expected.json");

        expect(manifest).toMatchObject(fixture);
    });
});
