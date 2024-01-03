import CSL from "citeproc";
import { engine } from "../../lib/reference/csl-engine.js";

import { referencesFrom } from "../../lib/utils.js";

const references = referencesFrom("publicacao-teste");

describe("csl-engine", () => {
    it("should throw error without parameters", () => {
        expect(() => engine()).toThrow();
    });

    it("should return CSL engine", () => {
        const engineInstance = engine(references, "pt-BR", "apa.csl");
        expect(engineInstance).toBeDefined();
        expect(engineInstance).toBeInstanceOf(CSL.Engine);
    });
});
