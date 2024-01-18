import fs from "fs/promises";
import { statSync } from "fs";
import path from "path";

import type {
    PackageProps,
    ReadContentsProps,
    ReadContentsReturn,
} from "@elucidario/pkg-types";

import { getPaths } from "./getPaths";
import { readFile, hasIndex, supportedExtensions } from "./file";
import { asyncReadFile } from "./asyncFile";
import { readContents } from "./readContents";

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
export async function asyncReadContents({
    dirPath,
    index = true,
    extensions = [],
    returnType = "content",
    exclude,
    pkg,
}: ReadContentsProps): Promise<ReadContentsReturn> {
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

    if (index === true && !hasIndex(dirPath)) {
        console.warn(
            new Error(
                `Directory ${dirPath} does not have an index.json file. Reading directory recursively.`,
            ),
        );
        index = false;
    }

    const files = readContents({
        dirPath,
        index,
        extensions,
        returnType: "path",
        exclude,
        pkg,
    });

    if (returnType === "path") {
        return Promise.resolve(files);
    }

    return await Promise.all(
        files.map(async (file) => {
            const content = await asyncReadFile({
                filePath: file.path,
                returnType,
            }).then((res) => res);
            return content;
        }),
    );
}
