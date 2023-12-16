import { buildPublication } from "../../lib/build/buildPublication.js";

describe("buildPublication", () => {
    test("should build the docs", async () => {
        const manifest = await buildPublication({
            publication: "publicacao-teste",
        });

        expect(manifest).toMatchObject({
            "pt-br": {
                indexFiles: ["charts.md", "figures.md", "acronyms.md"],
                content: [
                    "really\\first-level.md",
                    "really\\deep\\second-level.md",
                    "really\\deep\\nested\\third-level.md",
                    "really\\deep\\nested\\file\\file.md",
                    "hello-world.md",
                ],
                assets: ["..\\..\\files\\static\\lorem-ipsum.jpeg"],
            },
        });
    });
});
