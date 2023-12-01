import fs from "fs";
import path from "path";

import type {
    PackageProps,
    ReadContentsProps,
    ReadContentsReturn,
} from "@elucidario/pkg-types";

import { getPaths } from "./getPaths";
import { readFile } from "./file";

import { Console } from "@elucidario/pkg-console";

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
export function readContents<T>({
    dirPath,
    index = true,
    extensions = ["json", "md"],
    returnType = "content",
    exclude,
    log,
    package: pkg,
}: ReadContentsProps): ReadContentsReturn<T> {
    const result: ReadContentsReturn<T> = [];

    // Selecionar o package.json do projeto, caso não seja recebido como parâmetro
    if (!pkg) {
        pkg = readFile<PackageProps>({
            filePath: path.resolve(
                getPaths().packages,
                "paths",
                "package.json",
            ),
        }).content;
    }

    const console = new Console(pkg);

    // caso index seja false lê o diretório
    if (!index) {
        try {
            const files = fs.readdirSync(dirPath);

            files.forEach((file: string) => {
                const filePath = path.parse(file);
                const stat = fs.statSync(path.resolve(dirPath, file));

                // se for um diretório, chama a função recursivamente
                if (stat.isDirectory()) {
                    try {
                        const folder = readContents<T>({
                            dirPath: path.resolve(dirPath, file),
                            index,
                            extensions,
                            returnType,
                            exclude,
                            log,
                            package: pkg,
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
                        const ext = filePath.ext
                            ? filePath.ext.replace(".", "")
                            : "json";
                        result.push(
                            readFile<T>({
                                filePath: path.resolve(dirPath, file),
                                ext,
                            }),
                        );
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
                        ...readContents<T>({
                            dirPath: path.resolve(dirPath, file),
                            index,
                            extensions,
                            returnType,
                            exclude,
                            log,
                            package: pkg,
                        }),
                    );
                } else {
                    // se for um arquivo, lê o conteúdo
                    const ext = filePath.ext.replace(".", "");
                    result.push(
                        readFile<T>({
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
