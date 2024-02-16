import { asyncProcessDocs } from "../../lib/build/asyncProcessDocs.js";
import { packageJson } from "../../lib/utils.js";
import { createFixture, getFixture } from "../__fixtures__/index.js";

describe("asyncProcessDocs", () => {
    const pkg = packageJson("publicacao-teste");

    let expected = {};
    let assets = {};

    beforeEach(() => {
        expected = getFixture("asyncProcessDocs.expected.json");
        assets = getFixture("assets.json");
    });

    afterEach(() => {
        expected = {};
        assets = {};
    });

    it("should process docs", async () => {
        const processed = await asyncProcessDocs({
            publication: "publicacao-teste",
            lang: "pt-BR",
            type: "dissertation",
            style: {
                name: "abnt",
                csl: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
            },
            version: "1.0.0",
            assets,
            pkg,
        });

        expect(processed).toMatchObject(expected);
    });
});
