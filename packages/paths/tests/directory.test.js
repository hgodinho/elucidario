import { describe } from "node:test";
import { dirExists } from "../dist/mjs";

describe("dirExists", () => {
    it("should return true if the folder exists", async () => {
        const exists = await dirExists("src");
        expect(exists).toBe(true);
    });
    it("should return false if the folder does not exist", async () => {
        const exists = await dirExists("banana");
        expect(exists).toBe(false);
    });
});
