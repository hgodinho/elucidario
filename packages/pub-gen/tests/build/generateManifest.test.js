import { generateManifest } from "../../lib/build/generateManifest.js";

describe.skip("generateManifest", () => {
    it("should return the manifest", async () => {
        const manifest = generateManifest({
            publication: "publicacao-teste",
            lang: "pt-BR",
            style: "abnt",
            version: "1.0.0",
            attachmentIndex: {
                images: ["imagem-1", "imagem-2"],
                figures: ["figura-1", "figura-2"],
                tables: ["tabela-1", "tabela-2"],
                charts: ["grafico-1", "grafico-2"],
                acronyms: {
                    ABNT: "Associação Brasileira de Normas Técnicas;",
                    APA: "American Psychological Association.",
                },
            },
        });

        // console.log(manifest);
    });
});
