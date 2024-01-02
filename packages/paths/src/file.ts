import path from "path";
import fs, { WriteFileOptions } from "fs";
import { createDir } from "./folder";
import type {
    File,
    ReadFileProps,
    ParseFileProps,
    CreateFileProps,
} from "@elucidario/pkg-types";

/**
 * Supported file extensions
 */
export const supportedExtensions = [
    "json",
    "md",
    "txt",
    "html",
    "xml",
    "csl",
    "js",
    "ts",
    "php",
    "css",
    "scss",
];

/**
 * Check if a file exists.
 *
 * @param filePath The path to the file.
 * @returns True if the file exists, false otherwise.
 */
export function fileExists(filePath: string): boolean {
    try {
        const stats = fs.statSync(path.resolve(filePath));
        return stats.isFile();
    } catch (err) {
        return false;
    }
}

/**
 * Check if a directory has an index.json file.
 *
 * @param dirPath The path to the directory.
 * @returns True if the directory has index.json, false otherwise.
 */
export function hasIndex(dirPath: string): boolean {
    const index = path.resolve(dirPath, "index.json");
    return fileExists(index);
}

/**
 *  Read JSON file
 * @param filePath | path to file
 * @param enc | encoding
 * @returns | json file contents
 */
export function readJSON(filePath: string, enc: BufferEncoding) {
    return JSON.parse(fs.readFileSync(path.resolve(filePath), enc).toString());
}

/**
 *  Read text file
 * @param filePath | path to file
 * @param enc | encoding
 * @returns | text file contents
 */
export function readText(filePath: string, enc: BufferEncoding) {
    return fs.readFileSync(path.resolve(filePath), enc).toString();
}

/**
 * Read file contents
 *
 * @returns | file contents
 */
export function readFile(file: string | ReadFileProps): File {
    let enc: BufferEncoding | undefined = "utf-8";
    let ext: string | undefined;
    let filePath: string;
    let returnType: string | undefined = "content";

    if (typeof file === "string") {
        filePath = file;
    } else {
        filePath = file.filePath;
        enc = file.enc ? file.enc : enc;
        ext = file.ext;
        returnType = file.returnType ? file.returnType : returnType;
    }

    const parsed = path.parse(filePath);
    if (typeof ext === "undefined") ext = parsed.ext.replace(".", "");

    const { size, atime, mtime, ctime, birthtime } = fs.statSync(
        path.resolve(filePath),
    );

    const read: File = {
        name: parsed.name,
        path: filePath,
        ext,
        content: "",
        size,
        atime,
        mtime,
        ctime,
        birthtime,
    };

    try {
        if (returnType === "path") return read;

        if (!supportedExtensions.includes(ext))
            throw new Error(`Unsupported file extension: ${ext}`);

        switch (ext) {
            case "json":
                read.content = readJSON(path.resolve(filePath), enc);
                break;

            case "md":
            case "txt":
            case "html":
            case "xml":
            case "csl":
            default:
                read.content = readText(filePath, enc);
                break;
        }

        return read;
    } catch (err: any) {
        console.error(err);
        throw new Error(`Cannot read file at ${filePath}: ${err}`);
    }
}

/**
 * Create a file if it doesn't exist, overwrite it if it does.
 *
 * @param file The path to the file.
 * @param contents The contents of the file.
 * @returns {string}
 */
export function createFile(
    file: string | CreateFileProps,
    contents: any,
    options?: WriteFileOptions,
): string {
    let filePath: string;
    if (typeof file === "string") {
        filePath = file;
    } else {
        filePath = file.filePath;
    }
    const resolvedPath = path.resolve(filePath);
    const { dir, ext } = path.parse(resolvedPath);

    const extension = ext
        ? ext.replace(".", "")
        : typeof file === "string"
          ? "md"
          : file.ext;

    try {
        createDir(dir);
        switch (extension) {
            case "json":
                file = file as CreateFileProps;
                contents = JSON.stringify(
                    contents,
                    file.replacer || null,
                    file.space || 4,
                );
                break;

            case "md":
            case "txt":
            case "html":
            default:
                contents = contents.toString();
                break;
        }
        fs.writeFileSync(resolvedPath, contents, options);
        return resolvedPath;
    } catch (err) {
        throw new Error(`Cannot create file at ${resolvedPath}: ${err}`);
    }
}

export function writeFile(file: File, options?: WriteFileOptions): File {
    const resolvedPath = path.resolve(file.path);
    const { dir, ext } = path.parse(resolvedPath);
    const extension = ext
        ? ext.replace(".", "")
        : typeof file === "string"
          ? "md"
          : file.ext;

    try {
        createDir(dir);
        switch (extension) {
            case "json":
                if (typeof file.content === "object") {
                    file.content = JSON.stringify(file.content, null, 4);
                }
                break;

            case "md":
            case "txt":
            case "html":
            default:
                file.content = file.content ? file.content.toString() : "";
                break;
        }
        fs.writeFileSync(resolvedPath, file.content, options);

        return readFile(resolvedPath);
    } catch (err) {
        throw new Error(`Cannot create file at ${resolvedPath}: ${err}`);
    }
}

/**
 * Parse file
 *
 * @param props | file contents
 * @returns | file contents
 */
export function parseFile(props: ParseFileProps): File {
    const ext = props.ext
        ? props.ext
        : path.parse(props.path).ext.replace(".", "");

    const file: File = {
        name: props.name,
        path: props.path,
        ext,
        content: props.content,
    };
    return file;
}
