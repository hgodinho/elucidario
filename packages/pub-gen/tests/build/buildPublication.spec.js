import { buildPublication } from "../../lib/build/buildPublication.js";

describe("buildPublication", () => {
    test("should build the docs", async () => {
        const manifests = await buildPublication({
            publication: "publicacao-teste",
        });
        expect(manifests).toMatchObject({
            "pt-br": {
                indexFiles: ["figures.md", "charts.md", "acronyms.md"],
                content: [
                    "hello-world.md",
                    "really\\deep\\second-level.md",
                    "really\\deep\\nested\\third-level.md",
                    "really\\deep\\nested\\file\\file.md",
                    "really\\first-level.md",
                ],
                assets: ["..\\..\\files\\static\\lorem-ipsum.jpeg"],
            },
        });
    });
});
