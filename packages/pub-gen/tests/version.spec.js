import { version } from "../lib/version.js";

describe("version", () => {
    it("should prompt to version up", () => {
        version({
            publication: "publicacao-teste",
        });
    });
});
