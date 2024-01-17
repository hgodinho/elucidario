import {
    asyncReadText,
    asyncReadJSON,
    asyncReadImage,
    asyncReadFile,
} from "../dist/mjs/index.mjs";

describe("asyncFile", () => {
    describe("asyncReadText", () => {
        it("should return Promise that resolve text", async () => {
            const processed = await asyncReadText("tests/data/hello-world.md");
            expect(processed).toBe("hello world\r\n");
        });
    });

    describe("asyncReadJSON", () => {
        it("should return Promise that resolve JSON", async () => {
            const processed = await asyncReadJSON(
                "tests/data/hello-world.json",
            );
            expect(processed).toEqual({ hello: "world" });
        });
    });

    describe("asyncReadImage", () => {
        it("should return Promise that resolve image", async () => {
            const processed = await asyncReadImage(
                "tests/data/hello-world.jpg",
            );
            expect(processed).toBeInstanceOf(Buffer);
        });
    });

    describe("asyncReadFile", () => {
        it("should return Promise that resolve file", async () => {
            const processed = await asyncReadFile("tests/data/hello-world.md");
            expect(processed).toMatchObject({
                name: "hello-world",
                path: "tests/data/hello-world.md",
                ext: "md",
                value: "hello world\r\n",
                size: 13,
            });
        });
    });
});
