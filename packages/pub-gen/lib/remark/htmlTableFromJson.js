import Ajv from "ajv";
import { JSDOM } from "jsdom";
import prettier from "prettier";
import { Table } from "./Table.js";

export const mdGridTableFromJSON = (jsonData) => {
    const table = new Table(jsonData);

    const tableString = table.toString();

    console.log("tableString", tableString);
};

// export const htmlTableFromJSON = (jsonData) => {
//     // validate JSON against schema
//     const ajv = new Ajv();
//     const valid = ajv.validate(tableSchema, jsonData);
//     if (!valid) {
//         throw new Error("Invalid JSON schema: " + ajv.errorsText());
//     }

//     const dom = new JSDOM();
//     const document = dom.window.document;

//     const totalColumns = jsonData.rows.reduce((count, row) =>
//         row.reduce((rowCount, cell) => rowCount + (cell.colspan || 1), 0), 0);

//     const headerColumns = jsonData.header.reduce((count, column) => count + (column.colspan || 1), 0);

//     if (totalColumns !== headerColumns) {
//         throw new Error("Table is invalid: number of columns does not match number of header columns.");
//     }

//     // create table element
//     const table = document.createElement("table");

//     // create table caption
//     if (jsonData.title) {
//         const caption = document.createElement("caption");
//         const strong = document.createElement("strong");
//         strong.textContent = jsonData.title;
//         caption.appendChild(strong);
//         table.appendChild(caption);
//     }

//     // create table summary
//     if (jsonData.description) {
//         table.setAttribute("summary", jsonData.description);
//     }

//     // create table header
//     const headerRow = document.createElement("tr");
//     for (let i = 0; i < jsonData.header.length; i++) {
//         const headerCell = document.createElement("th");
//         headerCell.setAttribute("colspan", jsonData.header[i].colspan);
//         headerCell.textContent = jsonData.header[i].text;
//         headerRow.appendChild(headerCell);
//     }
//     table.appendChild(document.createElement("thead")).appendChild(headerRow);

//     // create table body
//     const tbody = document.createElement("tbody");
//     for (let i = 0; i < jsonData.rows.length; i++) {
//         const row = document.createElement("tr");
//         for (let j = 0; j < jsonData.rows[i].length; j++) {
//             const cell = document.createElement("td");
//             if (jsonData.rows[i][j].rowspan) {
//                 cell.setAttribute("rowspan", jsonData.rows[i][j].rowspan);
//             }
//             if (jsonData.rows[i][j].colspan) {
//                 cell.setAttribute("colspan", jsonData.rows[i][j].colspan);
//             }
//             cell.textContent = jsonData.rows[i][j].text;
//             row.appendChild(cell);
//         }
//         tbody.appendChild(row);
//     }
//     table.appendChild(tbody);

//     // create table footnote
//     if (jsonData.note) {
//         const tfoot = document.createElement("tfoot");
//         const row = document.createElement("tr");
//         const cell = document.createElement("td");
//         const strong = document.createElement("strong");
//         strong.textContent = jsonData.note;
//         cell.setAttribute("colspan", totalColumns);
//         cell.appendChild(strong);
//         row.appendChild(cell);
//         tfoot.appendChild(row);
//         table.appendChild(tfoot);
//     }

//     // format table
//     const formatted = prettier.format(table.outerHTML, {
//         parser: "html",
//     });
//     return formatted;
// }
