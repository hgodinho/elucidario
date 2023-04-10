import { visit } from 'unist-util-visit';
import path from 'path';
import fs from 'fs';
import { htmlTableFromJSON } from './htmlTableFromJson.js';

export default function remarkPubGen(options) {
    return function transformer(tree, file) {
        visit(tree, 'text', (node) => {
            if (node.value.startsWith('{{') && node.value.endsWith('}}')) {
                const value = node.value.replace('{{', '').replace('}}', '');
                if (value.includes('table')) {
                    const tableName = value.replace('table:', '');
                    const tableData = JSON.parse(fs.readFileSync(path.resolve(options.path, tableName)));
                    const tableHtml = htmlTableFromJSON(tableData);

                    node.value = tableHtml;
                    node.type = 'html';
                }
            };
        });
    }
}