import fs from "fs";
import path from "path";
import chalk from "chalk";

type ObjectOrArray = { [key: string]: any } | any[];

/**
 * Lê o conteúdo de um diretório e retorna um objeto com o conteúdo dos arquivos ou um array com os nomes dos arquivos
 * @param {string} directoryPath | Caminho do diretório
 * @param {string[]} extensions | Extensões dos arquivos a serem lidos
 * @param {boolean} names | Se true, retorna apenas os nomes dos arquivos
 * @returns {object|Array} | Objeto com o conteúdo dos arquivos
 */
export const readContents = (
    directoryPath: string,
    extensions = ["json", "md"],
    names = false,
    exclude?: string[]
): ObjectOrArray => {
    const result: ObjectOrArray = names ? [] : {};

    // ler todos os arquivos na pasta atual
    const files = fs.readdirSync(directoryPath);

    // iterar sobre cada arquivo encontrado
    const ignored: string[] = [];
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        if (exclude && exclude.includes(file)) {
            ignored.push(filePath)
            return;
        }

        // se o arquivo for um diretório, ler seu conteúdo recursivamente
        if (fs.statSync(filePath).isDirectory()) {
            if (names) {
                readContents(filePath, extensions, names).forEach((file: string) => {
                    (result as any[]).push(file);
                });
            } else {
                (result as { [key: string]: any })[file] = readContents(filePath, extensions, names);
            }
        } else {
            // verifica o tipo de arquivo
            const ext = path.extname(filePath).toLowerCase().replace(".", "");
            if (extensions.includes(ext) && ext === "json") {
                if (names) {
                    result.push(filePath);
                } else {
                    const fileContent = JSON.parse(
                        fs.readFileSync(filePath, "utf-8")
                    );
                    const fileName = path.parse(filePath).base;

                    (result as { [key: string]: any })[fileName] = fileContent;
                }
            } else if (extensions.includes(ext) && ext === "md") {
                if (names) {
                    result.push(filePath);
                } else {
                    const fileContent = fs.readFileSync(filePath, "utf-8");
                    const fileName = path.parse(filePath).name;
                    (result as { [key: string]: any })[fileName] = fileContent;
                }
            } else {
                // ignora outros tipos de arquivos
                ignored.push(filePath);
            }
        }
    });
    if (ignored.length > 0) {
        console.log(chalk.bgMagenta("Ignored files:"), ignored);
    }
    return result;
};
