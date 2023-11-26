import { readContents } from "../dist/mjs";

describe("readContents", () => {
    it("should return a object from index (default)", () => {
        const contents = readContents({
            dirPath: "tests/data",
        });
        expect(contents).toMatchObject({
            "hello-world": "hello world\r\n",
        });
    });

    it("should return a object", () => {
        const contents = readContents({
            dirPath: "tests/data",
            index: false,
        });
        expect(contents).toMatchObject({
            "hello-world": "hello world\r\n",
        });
    });
});
