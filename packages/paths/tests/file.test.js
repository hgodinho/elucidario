import { describe } from "node:test";
import { fileExists } from "../dist/mjs";

describe("fileExists", () => {
    it("should return true if the file exists", async () => {
        const exists = await fileExists("README.md");
        expect(exists).toBe(true);
    });
    it("should return false if the file does not exist", async () => {
        const exists = await fileExists("README2.md");
        expect(exists).toBe(false);
    });
});
