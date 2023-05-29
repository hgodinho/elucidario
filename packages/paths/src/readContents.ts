import fs from "fs";
import path from "path";
import type { PackageProps } from "@elucidario/pkg-types";

import { getPaths } from "./getPaths";
import { Console } from "@elucidario/pkg-console";

type ReadContentsReturn = { [key: string]: string | any };

type ReadContentsProps = {
    dirPath: string;
    index?: boolean;
    extensions?: string[];
    names?: boolean;
    exclude?: string[];
    log?: boolean;
    package?: PackageProps;
};

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

/**
 * Lê o conteúdo de um diretório e retorna um objeto com o conteúdo dos arquivos ou um array com os nomes dos arquivos
 * @param {ReadContentsProps} props
 * @returns {object|Array} Objeto com o conteúdo dos arquivos
 */
export const readContents = ({
    dirPath,
    index = true,
    extensions = ["json", "md"],
    names = false,
    exclude,
    log,
    package: pkg,
}: ReadContentsProps): ReadContentsReturn => {
    const result: ReadContentsReturn = {};

    if (!pkg) {
        pkg = JSON.parse(
            fs.readFileSync(
                path.resolve(getPaths().packages, "paths", "package.json"),
                "utf-8"
            )
        );
    }

    const console = new Console(pkg as PackageProps);

    // ler todos os arquivos na pasta atual
    let files: string[] = [];

    try {
        if (index && fs.existsSync(path.resolve(dirPath, "index.json"))) {
            const index = JSON.parse(
                fs.readFileSync(path.resolve(dirPath, "index.json"), "utf-8")
            );
            files = index.files.map((file: string) => {
                if (fs.existsSync(path.resolve(dirPath, `${file}.md`))) {
                    return `${file}.md`;
                } else {
                    return file;
                }
            });
        } else {
            files = fs.readdirSync(dirPath);
        }
    } catch (err) {
        console.log(
            { files, err, },
            {
                defaultLog: true,
                type: "error",
                title: "readContents",
            }
        );
    }

    if (!files) {
        try {
            files = fs.readdirSync(dirPath);
        } catch (err) {
            console.log(
                { err },
                {
                    defaultLog: true,
                    type: "error",
                    title: "readContents",
                }
            );
        }
    }

    // iterar sobre cada arquivo encontrado
    const ignored: string[] = [];

    try {
        files.forEach((file: string) => {
            const filePath = path.join(dirPath, file);

            if (exclude && exclude.includes(file)) {
                ignored.push(filePath);
                return;
            }

            // se o arquivo for um diretório, ler seu conteúdo recursivamente
            if (fs.statSync(filePath).isDirectory()) {
                if (names) {
                    result[file] = Object.entries(
                        readContents({ dirPath: filePath, extensions, names, log, exclude, package: pkg })
                    ).map(([key, value]) => key);
                } else {
                    result[file] = readContents({
                        dirPath: filePath,
                        extensions,
                        names,
                        exclude,
                        log,
                        package: pkg,
                    });
                }
            } else {
                // verifica o tipo de arquivo
                const file = path.parse(filePath);
                const ext = file.ext.replace(".", "");

                if (extensions.includes(ext) && ext === "json") {
                    if (names) {
                        result[file.name] = filePath;
                    } else {
                        const fileContent = JSON.parse(
                            fs.readFileSync(filePath, "utf-8")
                        );

                        result[file.name] = fileContent;
                    }
                } else if (extensions.includes(ext) && ext === "md") {
                    if (names) {
                        result[file.name] = filePath;
                    } else {
                        const fileContent = fs.readFileSync(filePath, "utf-8");
                        result[file.name] = fileContent;
                    }
                } else if (
                    extensions.includes(ext) &&
                    imagesExtensions.includes(ext)
                ) {
                    // é uma imagem, deve retornar sempre somente o path, ao invés do conteúdo
                    if (names) {
                        result[file.name] = filePath;
                    } else {
                        throw new Error(
                            "Não é possível ler o conteúdo de uma imagem, defina names como true"
                        );
                    }
                }
            }
        });
    } catch (err) {
        console.log(
            { err },
            {
                defaultLog: true,
                type: "error",
                title: "readContents",
            }
        );
    }

    if (typeof log === "undefined") {
        log = true;
    }
    if (log) {
        if (ignored.length > 0) {
            console.log(ignored, {
                defaultLog: true,
                type: "warning",
                title: "Ignored files",
            });
        }
    }

    return result;
};
