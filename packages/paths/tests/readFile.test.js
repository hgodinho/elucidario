import { readFile } from "../dist/mjs";

describe("readFile", () => {
    it("should return a File object for markdown", () => {
        const contents = readFile({ filePath: "tests/data/hello-world.md" });
        expect(contents).toMatchObject({
            name: "hello-world",
            path: "tests/data/hello-world.md",
            ext: "md",
            content: "hello world\r\n",
            size: 13,
            // atime: new Date("2023-11-28T20:19:03.371Z"),
            // mtime: new Date("2023-11-26T21:30:03.977Z"),
            // ctime: new Date("2023-11-26T21:40:16.360Z"),
            // birthtime: new Date("2023-11-26T21:29:58.582Z"),
        });
    });

    it("should return a File object for json", () => {
        const contents = readFile({ filePath: "tests/data/hello-world.json" });
        expect(contents).toMatchObject({
            name: "hello-world",
            path: "tests/data/hello-world.json",
            ext: "json",
            content: {
                hello: "world",
            },
            size: 28,
            // atime: new Date("2023-11-28T20:19:03.371Z"),
            // mtime: new Date("2023-11-26T21:30:03.977Z"),
            // ctime: new Date("2023-11-26T21:40:16.360Z"),
            // birthtime: new Date("2023-11-26T21:29:58.582Z"),
        });
    });
});
