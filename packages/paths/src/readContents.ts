import fs from "fs";
import path from "path";

import type { PackageProps, ReadContentsProps, ReadContentsReturn } from "@elucidario/pkg-types";

import { getPaths } from "./getPaths";
import { Console } from "@elucidario/pkg-console";

const imagesExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "svg",
    "webp",
    "bmp",
    "ico",
];

export const readFile = (filePath: string, ext: string): ReadContentsReturn | string => {
    try {
        switch (ext) {
            case 'json':
                return JSON.parse(
                    fs.readFileSync(
                        path.resolve(filePath),
                        "utf-8"
                    ).toString()
                );

            default:
                return fs.readFileSync(
                    path.resolve(filePath),
                    "utf-8"
                ).toString();
        }
    } catch (err: any) {
        throw new Error(`Cannot read file at ${filePath}: ${err}`);
    }
}

/**
 * Lê o conteúdo de um diretório recursivamente, retornando um objeto com o conteúdo de cada arquivo ou path
 * 
 * @param {Object} props - Propriedades
 * @param {string} props.dirPath - Path do diretório a ser lido
 * @param {boolean} [props.index=true] - Se deve ler o index.json ou não
 * @param {string[]} [props.extensions=["json", "md"]] - Extensões dos arquivos a serem lidos
 * @param {string} [props.returnType="content"] - Tipo de retorno: "content" ou "path"
 * @param {string[]} [props.exclude] - Arquivos a serem excluídos
 * @param {boolean} [props.log=false] - Se deve logar no console ou não
 * @param {PackageProps} [props.package] - Objeto package.json
 * 
 * @returns {Object} - Objeto com o conteúdo de cada arquivo ou path
 */
export const readContents = ({
    dirPath,
    index = true,
    extensions = ["json", "md"],
    returnType = 'content',
    exclude,
    log,
    package: pkg,
}: ReadContentsProps): ReadContentsReturn => {
    const result: ReadContentsReturn = {};

    // Selecionar o package.json do projeto, caso não seja recebido como parâmetro
    if (!pkg) {
        pkg = JSON.parse(
            fs.readFileSync(
                path.resolve(getPaths().packages, "paths", "package.json"),
                "utf-8"
            )
        );
    }

    const console = new Console(pkg as PackageProps);

    // caso index seja false lê o diretório
    if (!index) {
        try {
            const files = fs.readdirSync(dirPath);
            files.forEach((file: string) => {
                const filePath = path.parse(file);

                // se for um diretório, chama a função recursivamente
                if (filePath.ext === "") {
                    try {
                        result[filePath.name] = readContents({
                            dirPath: path.resolve(dirPath, file),
                            index,
                            extensions,
                            returnType,
                            exclude,
                            log,
                            package: pkg,
                        });
                    } catch (err: any) {
                        console.log({ err }, { defaultLog: true, type: "error" })
                        throw new Error(`Cannot read recursive directory: ${path.resolve(dirPath, file)}`);
                    }
                }

                try {
                    // se for um arquivo, lê o conteúdo
                    const ext = filePath.ext.replace(".", "");
                    if (extensions.includes(ext)) {
                        switch (returnType) {
                            case 'path':
                                result[filePath.name] = path.resolve(dirPath, file);
                                break;
                            case 'content':
                                result[filePath.name] = readFile(path.resolve(dirPath, file), ext);
                        }
                    }
                } catch (err: any) {
                    throw new Error(`Cannot read file at ${path.resolve(dirPath, file)}: ${err}`);
                }
            });

        } catch (err: any) {
            throw new Error(`Cannot read directory at ${dirPath}: ${err}`);
        }
    }

    // caso index seja true, lê o index.json
    else {
        try {
            const indexJson = JSON.parse(
                fs.readFileSync(path.resolve(dirPath, "index.json"), "utf-8")
            );

            indexJson.files.forEach((file: string) => {
                const filePath = path.parse(file);

                // se for um diretório, chama a função recursivamente
                if (filePath.ext === "") {
                    const content = readContents({
                        dirPath: path.resolve(dirPath, file),
                        index,
                        extensions,
                        returnType,
                        exclude,
                        log,
                        package: pkg,
                    });
                    result[filePath.name] = content;
                } else {
                    // se for um arquivo, lê o conteúdo
                    const ext = filePath.ext.replace(".", "");
                    if (extensions.includes(ext)) {

                        switch (returnType) {
                            case 'path':
                                result[filePath.name] = path.resolve(dirPath, file);
                                break;
                            case 'content':
                                result[filePath.name] = readFile(path.resolve(dirPath, file), ext);
                        }
                    }
                }
            });
        } catch {
            throw new Error(`Cannot read index.json in directory: ${dirPath}`);
        }
    }

    // caso seja passado um array de arquivos a serem ignorados, remove-os do resultado
    if (exclude) {
        exclude.forEach((file: string) => {
            delete result[file];
        });
    }

    return result;
};
