import { readFile } from "../dist/mjs";

describe("readFile", () => {
    it("should return a string for markdown", () => {
        const contents = readFile("tests/data/hello-world.md");
        expect(contents).toBe("hello world\r\n");
    });
    it("should return a object for json", () => {
        const contents = readFile("tests/data/hello-world.json");
        expect(contents).toEqual({ hello: "world" });
    });
});
