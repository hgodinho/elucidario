import path from "path";
import { pubGenProcessor } from "../../lib/remark/pubGenProcessor";
import {
    readContents,
    getPaths,
    readFile,
    dirExists,
    parseFile,
} from "@elucidario/pkg-paths";
import { packageJson } from "../../lib/utils";

describe("pubGenProcessor", () => {
    const content = readFile({
        filePath: path.resolve(
            getPaths().publications,
            "publicacao-teste",
            "content",
            "pt-br",
            "internal",
            "body",
            "hello-world.md",
        ),
        ext: "md",
    }).content;

    const mermaidNode = readFile({
        filePath: path.resolve(
            getPaths().publications,
            "publicacao-teste",
            "content",
            "pt-br",
            "internal",
            "body",
            "nodes",
            "mermaid-node.md",
        ),
        ext: "md",
    }).content;

    const pkg = packageJson("publicacao-teste");

    it("should rejects promise without content", async () => {
        expect.assertions(1);
        await expect(() => pubGenProcessor()).rejects.toThrow(
            "No content provided.",
        );
    });

    it("should rejects promise without options", async () => {
        expect.assertions(1);
        await expect(() => pubGenProcessor(content)).rejects.toThrow(
            "No options provided.",
        );
    });

    it("should rejects promise without options.publication", async () => {
        expect.assertions(1);
        await expect(() => pubGenProcessor(content, {})).rejects.toThrow(
            "No publication provided.",
        );
    });

    it("should rejects promise without options.lang", async () => {
        expect.assertions(1);
        await expect(() =>
            pubGenProcessor(content, {
                publication: "publicacao-teste",
            }),
        ).rejects.toThrow("No lang provided.");
    });

    it("should rejects promise without options.style", async () => {
        expect.assertions(1);
        await expect(() =>
            pubGenProcessor(content, {
                publication: "publicacao-teste",
                lang: "pt-br",
            }),
        ).rejects.toThrow("No style provided.");
    });

    it("should rejects promise without options.assets", async () => {
        expect.assertions(1);
        await expect(() =>
            pubGenProcessor(content, {
                publication: "publicacao-teste",
                lang: "pt-br",
                style: {
                    name: "abnt",
                    csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                },
            }),
        ).rejects.toThrow("No assets provided.");
    });

    it("should rejects promise without options.assetsTitles", async () => {
        expect.assertions(1);
        await expect(() =>
            pubGenProcessor(content, {
                publication: "publicacao-teste",
                lang: "pt-br",
                style: {
                    name: "abnt",
                    csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                },
                assets: {},
            }),
        ).rejects.toThrow("No assetsTitles provided.");
    });

    it("should rejects promise without options.pkg", async () => {
        expect.assertions(1);
        await expect(() =>
            pubGenProcessor(content, {
                publication: "publicacao-teste",
                lang: "pt-br",
                style: {
                    name: "abnt",
                    csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                },
                assets: {},
                assetsTitles: {
                    mermaid: "Diagrama",
                },
            }),
        ).rejects.toThrow("No package.json provided.");
    });

    it("should return processed value", async () => {
        const processed = await pubGenProcessor(content, {
            publication: "publicacao-teste",
            lang: "pt-br",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            assets: {},
            assetsTitles: {
                mermaid: "Diagrama",
            },
            pkg,
        });

        expect(processed.value).toMatchSnapshot();
    });
});
