import { toDocx } from "../../lib/toDocx.js";

describe.skip("toDocx", () => {
    it("should be defined", async () => {
        const docxPath = await toDocx({
            publication: "publicacao-teste",
            language: "pt-BR",
            // output: ".",
            // title: "Publicação de Teste",
        });

        console.log(docxPath);
        expect(toDocx).toBeDefined();
    });
});
