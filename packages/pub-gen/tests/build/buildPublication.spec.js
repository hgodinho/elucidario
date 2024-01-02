import { buildPublication } from "../../lib/build/buildPublication.js";

describe("buildPublication", () => {
    test("should build the docs", async () => {
        const manifest = await buildPublication({
            publication: "publicacao-teste",
        });

        expect(manifest).toMatchObject({
            "pt-br": {
                content: {
                    internal: {
                        body: [
                            "\\internal\\body\\hello-world.md",
                            "\\internal\\body\\really\\first-level.md",
                            "\\internal\\body\\really\\deep\\second-level.md",
                            "\\internal\\body\\really\\deep\\nested\\third-level.md",
                            "\\internal\\body\\really\\deep\\nested\\file\\file.md",
                        ],
                        pre: [
                            "\\internal\\pre\\folha-rosto.md",
                            "\\internal\\pre\\ficha-catalografica.md",
                            "\\internal\\pre\\folha-avaliacao.md",
                            "\\internal\\pre\\resumo-lingua-vernacula.md",
                            "\\internal\\pre\\resumo-lingua-estrangeira.md",
                            "\\internal\\pre\\lista-quadros.md",
                            "\\internal\\pre\\lista-figuras.md",
                            "\\internal\\pre\\lista-abreviaturas-siglas.md",
                        ],
                        pos: ["\\internal\\pos\\referencias.md"],
                    },
                    external: {},
                },
                assets: ["..\\..\\files\\static\\lorem-ipsum.jpeg"],
            },
        });
    });
});
