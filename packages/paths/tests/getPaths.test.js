import { getPaths } from "../dist/mjs";

describe("getPaths", () => {
    const paths = getPaths();

    it("should return an object", () => {
        expect(paths).toHaveProperty("root");
        expect(paths).toHaveProperty("current");
        expect(paths).toHaveProperty("packages");
        expect(paths).toHaveProperty("publications");
        expect(paths).toHaveProperty("references");
        expect(paths).toHaveProperty("monorepo");
        expect(paths.monorepo).toHaveProperty("packages");
        expect(paths.monorepo).toHaveProperty("apps");
        expect(paths.monorepo).toHaveProperty("publications");
    });
});
