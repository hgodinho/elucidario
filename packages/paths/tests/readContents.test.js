import { readContents } from "../dist/mjs";

describe("readContents", () => {
    it("should return an Array of File object from index (default)", () => {
        const contents = readContents({
            dirPath: "tests/data",
        });
        expect(contents).toHaveLength(1);
        expect(contents[0]).toMatchObject({
            name: "hello-world",
            path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\hello-world.md",
            ext: "md",
            value: "hello world\r\n",
            size: 13,
            //   atime: 2023-11-28T20:50:57.399Z,
            //   mtime: 2023-11-26T21:30:03.977Z,
            //   ctime: 2023-11-26T21:40:16.360Z,
            //   birthtime: 2023-11-26T21:29:58.582Z
        });
    });

    it("should return an Array of File object without index", () => {
        const contents = readContents({
            dirPath: "tests/data",
            index: false,
        });

        expect(contents).toHaveLength(5);

        expect(contents).toMatchObject([
            {
                name: ".gh-token",
                path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\.gh-token",
                ext: "json",
                value: {
                    token: "some-fake-token",
                },
                size: 38,
                // atime: new Date("2023-11-28T20:19:03.371Z"),
                // mtime: new Date("2023-11-26T21:30:03.977Z"),
                // ctime: new Date("2023-11-26T21:40:16.360Z"),
                // birthtime: new Date("2023-11-26T21:29:58.582Z"),
            },
            {
                name: "file",
                path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\deep\\nested\\file.md",
                ext: "md",
                value: "end.\r\n",
                size: 6,
                // atime: 2023-11-28T22:23:09.806Z,
                // mtime: 2023-11-28T21:20:40.745Z,
                // ctime: 2023-11-28T21:20:40.745Z,
                // birthtime: 2023-11-28T21:03:07.743Z
            },
            {
                name: "hello-world",
                path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\hello-world.json",
                ext: "json",
                value: {
                    hello: "world",
                },
                size: 28,
                //   atime: 2023-11-28T20:56:40.529Z,
                //   mtime: 2023-11-26T21:42:12.439Z,
                //   ctime: 2023-11-26T21:42:12.439Z,
                //   birthtime: 2023-11-26T21:42:05.997Z
            },
            {
                name: "hello-world",
                path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\hello-world.md",
                ext: "md",
                value: "hello world\r\n",
                size: 13,
                //   atime: 2023-11-28T20:57:33.234Z,
                //   mtime: 2023-11-26T21:30:03.977Z,
                //   ctime: 2023-11-26T21:40:16.360Z,
                //   birthtime: 2023-11-26T21:29:58.582Z
            },
            {
                name: "index",
                path: "C:\\Users\\55119\\Elucidário.art\\elucidario\\packages\\paths\\tests\\data\\index.json",
                ext: "json",
                value: {
                    files: ["hello-world.md"],
                },
                size: 39,
                //   atime: 2023-11-28T20:57:33.234Z,
                //   mtime: 2023-11-26T21:47:48.941Z,
                //   ctime: 2023-11-26T21:47:48.941Z,
                //   birthtime: 2023-11-26T21:47:29.978Z
            },
        ]);
    });
});
