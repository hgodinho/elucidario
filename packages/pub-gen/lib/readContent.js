import fs from "fs";
import path from "path";

const readContent = (directoryPath) => {
    const result = {};

    // ler todos os arquivos na pasta atual
    const files = fs.readdirSync(directoryPath);

    // iterar sobre cada arquivo encontrado
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        // se o arquivo for um diretório, ler seu conteúdo recursivamente
        if (fs.statSync(filePath).isDirectory()) {
            result[file] = readContent(filePath);
        } else {
            // verifica o tipo de arquivo
            const ext = path.extname(filePath).toLowerCase();
            if (ext === ".json") {
                const fileContent = JSON.parse(
                    fs.readFileSync(filePath, "utf-8")
                );
                const fileName = path.parse(filePath).name;
                result[fileName] = fileContent;
            } else if (ext === ".md") {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                const fileName = path.parse(filePath).name;
                result[fileName] = fileContent;
            } else {
                // ignora outros tipos de arquivos
                console.log(`Ignorando arquivo ${filePath}`);
            }
        }
    });

    return result;
};

export default readContent;
