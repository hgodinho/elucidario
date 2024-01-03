import * as unist from "../lib/components.js";

describe("unist", () => {
    it("node", () => {
        expect(unist.node("text", { hello: "world" })).toEqual({
            type: "text",
            data: { hello: "world" },
        });
    });

    it("literal", () => {
        expect(unist.literal("text", "hello")).toEqual({
            type: "text",
            value: "hello",
        });
    });

    it("parent", () => {
        expect(unist.parent("paragraph", [unist.text("hello")])).toEqual({
            type: "paragraph",
            children: [{ type: "text", value: "hello" }],
        });
    });

    it("text", () => {
        expect(unist.text("hello")).toEqual({ type: "text", value: "hello" });
    });

    it("bold", () => {
        expect(unist.bold([unist.text("hello")])).toEqual({
            type: "strong",
            children: [{ type: "text", value: "hello" }],
        });
    });

    it("italic", () => {
        expect(unist.italic([unist.text("hello")])).toEqual({
            type: "emphasis",
            children: [{ type: "text", value: "hello" }],
        });
    });

    it("paragraph", () => {
        expect(unist.paragraph([unist.text("hello")])).toEqual({
            type: "paragraph",
            children: [{ type: "text", value: "hello" }],
        });
    });

    it("definition", () => {
        expect(unist.definition("id", "label", "url", "title")).toEqual({
            type: "definition",
            label: "label",
            identifier: "id",
            url: "url",
            title: "title",
        });
    });

    it("heading", () => {
        expect(unist.heading(1, [unist.text("hello")])).toEqual({
            type: "heading",
            depth: 1,
            children: [{ type: "text", value: "hello" }],
        });
    });

    it("html", () => {
        expect(unist.html("<p>hello</p>")).toEqual({
            type: "html",
            value: "<p>hello</p>",
        });
    });

    it("image", () => {
        expect(unist.image({ url: "url", title: "title", alt: "alt" })).toEqual(
            {
                type: "image",
                url: "url",
                title: "title",
                alt: "alt",
            },
        );
    });

    it("table", () => {
        const table = unist.table("left", [
            unist.tableRow([
                unist.tableCell([unist.text("1")]),
                unist.tableCell([unist.text("2")]),
            ]),
            unist.tableRow([
                unist.tableCell([unist.text("3")]),
                unist.tableCell([unist.text("4")]),
            ]),
        ]);

        expect(table).toEqual({
            type: "table",
            align: ["left"],
            children: [
                {
                    type: "tableRow",
                    children: [
                        {
                            type: "tableCell",
                            children: [{ type: "text", value: "1" }],
                        },
                        {
                            type: "tableCell",
                            children: [{ type: "text", value: "2" }],
                        },
                    ],
                },
                {
                    type: "tableRow",
                    children: [
                        {
                            type: "tableCell",
                            children: [{ type: "text", value: "3" }],
                        },
                        {
                            type: "tableCell",
                            children: [{ type: "text", value: "4" }],
                        },
                    ],
                },
            ],
        });
    });
});
