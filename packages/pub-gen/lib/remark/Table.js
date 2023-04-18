export class Table {
    constructor(tableData) {
        this.tableData = tableData;
        this.rows = tableData.rows;
        this.header = tableData.header;
        this.description = tableData.description;
        this.title = tableData.title;
        this.note = tableData.note;

        this.totalColumns = this.countColumns();
        this.totalRows = this.countRows();
        console.log("count", {
            columns: this.totalColumns,
            rows: this.totalRows,
        });
    }

    countColumns() {
        let count = 0;
        Object.values(this.header).forEach((head) => {
            count += head.colspan || 1;
        });
        return count;
    }

    countRows() {
        return this.rows.length;
    }

    getTable() {
        return this.tableData;
    }

    toString() {
        const header = this.header.map((cell) => {
            // console.log("cell", cell);
            return cell.text || "";
        });
    }
}
