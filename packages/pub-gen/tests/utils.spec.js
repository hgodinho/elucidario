import { pubGenConfig } from "../lib/utils";
import testPubGenConfig from "../../../publications/publicacao-teste/pub-gen.json";

describe("pubGenConfig", () => {
    it("should return the default config", () => {
        expect(pubGenConfig("publicacao-teste")).toEqual(testPubGenConfig);
    });
});
