import fs from "fs";
import path from "path";

import type {
    PackageProps,
    ReadContentsProps,
    ReadContentsReturn,
} from "@elucidario/pkg-types";

import { getPaths } from "./getPaths";
import { readFile, hasIndex } from "./file";

import { Console } from "@elucidario/pkg-console";

import { supportedExtensions } from "./file";

/**
 * Lê o conteúdo de um diretório recursivamente, retornando um objeto com o conteúdo de cada arquivo ou path
 *
 * @param {Object} props - Propriedades
 * @param {string} props.dirPath - Path do diretório a ser lido
 * @param {boolean} [props.index=true] - Se deve ler o index.json ou não
 * @param {string[]} [props.extensions=["json", "md"]] - Extensões dos arquivos a serem lidos
 * @param {string} [props.returnType="content"] - Tipo de retorno: "content" ou "path"
 * @param {string[]} [props.exclude] - Arquivos a serem excluídos
 * @param {PackageProps} [props.pkg] - Objeto package.json
 *
 * @returns {Object} - Objeto com o conteúdo de cada arquivo ou path
 */
export function readContents({
    dirPath,
    index = true,
    extensions = [],
    returnType = "content",
    exclude,
    pkg,
}: ReadContentsProps): ReadContentsReturn {
    const result: ReadContentsReturn = [];

    if (extensions.length === 0) {
        extensions = supportedExtensions;
    }

    // Selecionar o package.json do projeto, caso não seja recebido como parâmetro
    if (typeof pkg === "undefined") {
        pkg = readFile({
            filePath: path.resolve(
                getPaths().packages,
                "paths",
                "package.json",
            ),
        }).value as PackageProps;
    }

    const console = new Console(pkg);

    if (index === true && !hasIndex(dirPath)) {
        console.warn(
            new Error(
                `Directory ${dirPath} does not have an index.json file. Reading directory recursively.`,
            ),
        );
        index = false;
    }

    // caso index seja false lê o diretório
    if (!index) {
        try {
            const files = fs.readdirSync(dirPath);

            files.forEach((file: string) => {
                const filePath = path.parse(file);
                const stat = fs.statSync(path.resolve(dirPath, file));

                const ext = filePath.ext
                    ? filePath.ext.replace(".", "")
                    : "json";

                // se for um diretório, chama a função recursivamente
                if (stat.isDirectory()) {
                    try {
                        const folder = readContents({
                            dirPath: path.resolve(dirPath, file),
                            index: hasIndex(path.resolve(dirPath, file)),
                            extensions,
                            returnType,
                            exclude,
                            pkg,
                        });

                        result.push(...folder);
                    } catch (err: any) {
                        console.log(
                            { err },
                            { defaultLog: true, type: "error" },
                        );
                        throw new Error(
                            `Cannot read recursive directory: ${path.resolve(
                                dirPath,
                                file,
                            )}`,
                        );
                    }
                } else {
                    try {
                        // se for um arquivo e não estiver na lista de extensões, retorna.
                        // se a lista de extensões estiver vazia, retorna todos os tipos de arquivos.
                        if (!extensions.includes(ext)) {
                            return;
                        } else {
                            result.push(
                                readFile({
                                    filePath: path.resolve(dirPath, file),
                                    ext,
                                    returnType,
                                }),
                            );
                        }
                    } catch (err: any) {
                        throw new Error(
                            `Cannot read file at ${path.resolve(
                                dirPath,
                                file,
                            )}: ${err}`,
                        );
                    }
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
                fs.readFileSync(path.resolve(dirPath, "index.json"), "utf-8"),
            );

            indexJson.files.forEach((file: string) => {
                const filePath = path.parse(file);

                // se for um diretório, chama a função recursivamente
                if (filePath.ext === "") {
                    result.push(
                        ...readContents({
                            dirPath: path.resolve(dirPath, file),
                            index: hasIndex(path.resolve(dirPath, file)),
                            extensions,
                            returnType,
                            exclude,
                            pkg,
                        }),
                    );
                } else {
                    // se for um arquivo, lê o conteúdo
                    const ext = filePath.ext.replace(".", "");
                    result.push(
                        readFile({
                            filePath: path.resolve(dirPath, file),
                            ext,
                        }),
                    );
                }
            });
        } catch {
            throw new Error(`Cannot read index.json in directory: ${dirPath}`);
        }
    }

    // caso seja passado um array de arquivos a serem ignorados, remove-os do resultado
    if (exclude) {
        exclude.forEach((file: string) => {
            result.forEach((item: any, index: number) => {
                if (item.name === file) {
                    result.splice(index, 1);
                }
            });
        });
    }

    return result;
}
