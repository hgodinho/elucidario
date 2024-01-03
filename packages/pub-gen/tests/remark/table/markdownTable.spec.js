import markdownTable from "../../../lib/remark/table/markdownTable.js";

describe("markdownTable", () => {
    it("should return a table", async () => {
        const table = await markdownTable({
            title: "Table",
            fields: [
                {
                    name: "a",
                    type: "string",
                },
                {
                    name: "b",
                    type: "string",
                },
                {
                    name: "c",
                    type: "string",
                },
            ],
            data: [
                ["a", "b", "c"],
                ["d", "e", "f"],
                ["g", "h", "i"],
            ],
        });

        expect(table).toEqual(`**Table**

| a | b | c |
| --- | --- | --- |
| d | e | f |
| g | h | i |`);
    });
});
