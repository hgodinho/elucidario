import { text, bold, italic } from "../lib/components.js";

describe("unist", () => {
    it("text", () => {
        expect(text("hello")).toEqual({ type: "text", value: "hello" });
    });

    it("bold", () => {
        expect(bold("hello")).toEqual({
            type: "strong",
            children: [{ type: "text", value: "hello" }],
        });
    });

    it("italic", () => {
        expect(italic("hello")).toEqual({
            type: "emphasis",
            children: [{ type: "text", value: "hello" }],
        });
    });
});
