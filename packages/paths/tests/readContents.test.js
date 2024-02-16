import { readContents } from "../dist/mjs";

describe("readContents", () => {
    it("should return an Array of File object from index (default)", () => {
        const contents = readContents({
            dirPath: "tests/data",
        });
        expect(contents).toHaveLength(2);
        expect(contents[0]).toMatchObject({
            name: "hello-world",
            path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\hello-world.md",
            ext: "md",
            value: "hello world\r\n",
        });
    });

    it("should return an Array of File object without index", () => {
        const contents = readContents({
            dirPath: "tests/data",
            index: false,
        });

        expect(contents).toHaveLength(6);
    });
});
