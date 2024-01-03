import { describe } from "node:test";
import { fileExists, readFile } from "../dist/mjs";

describe("readFile", () => {
    it("should return a File object if only path received", () => {
        const contents = readFile("tests/data/hello-world.md");
        expect(contents).toMatchObject({
            name: "hello-world",
            path: "tests/data/hello-world.md",
            ext: "md",
            value: "hello world\r\n",
            size: 13,
            // atime: new Date("2023-11-28T20:19:03.371Z"),
            // mtime: new Date("2023-11-26T21:30:03.977Z"),
            // ctime: new Date("2023-11-26T21:40:16.360Z"),
            // birthtime: new Date("2023-11-26T21:29:58.582Z"),
        });
    });

    it("should return a File object for non-standard files", () => {
        const contents = readFile({
            filePath: "tests/data/.gh-token",
            ext: "json",
        });
        expect(contents).toMatchObject({
            name: ".gh-token",
            path: "tests/data/.gh-token",
            ext: "json",
            value: {
                token: "some-fake-token",
            },
            size: 38,
            // atime: new Date("2023-11-28T20:19:03.371Z"),
            // mtime: new Date("2023-11-26T21:30:03.977Z"),
            // ctime: new Date("2023-11-26T21:40:16.360Z"),
            // birthtime: new Date("2023-11-26T21:29:58.582Z"),
        });
    });

    it("should return a File object for markdown", () => {
        const contents = readFile({ filePath: "tests/data/hello-world.md" });
        expect(contents).toMatchObject({
            name: "hello-world",
            path: "tests/data/hello-world.md",
            ext: "md",
            value: "hello world\r\n",
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
            value: {
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
