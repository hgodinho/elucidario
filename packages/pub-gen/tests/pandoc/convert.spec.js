import { convert } from "../../lib/pandoc/convert.js";

describe.skip("convert", () => {
    it("convert create docx", () => {
        const docx = convert({
            publication: "publicacao-teste",
        });

        // console.log({ docx });
    });
});
