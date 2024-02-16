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
    "jpeg",
    "jpg",
    "png",
    "gif",
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
 *  Read image file
 * @param filePath | path to file
 * @returns | image file contents
 */
export function readImage(filePath: string) {
    return fs.readFileSync(path.resolve(filePath));
}

/**
 * Read file contents
 *
 * @returns | file contents
 */
export function readFile(file: string | ReadFileProps): File {
    let enc: BufferEncoding = "utf8";
    let ext: string | undefined;
    let filePath: string;
    let returnType: string | undefined = "content";
    let stats: boolean = false;

    if (typeof file === "string") {
        filePath = file;
    } else {
        filePath = file.filePath;
        enc = file.enc ? file.enc : enc;
        ext = file.ext;
        returnType = file.returnType ? file.returnType : returnType;
        stats = file.stats ? file.stats : stats;
    }

    const parsed = path.parse(filePath);
    if (typeof ext === "undefined") ext = parsed.ext.replace(".", "");

    const read: File = {
        name: parsed.name,
        path: filePath,
        ext,
        value: "",
        ...(stats ? fs.statSync(path.resolve(filePath)) : {}),
    };

    try {
        if (returnType === "path") return read;

        if (!supportedExtensions.includes(ext))
            throw new Error(`Unsupported file extension: ${ext}`);

        switch (ext) {
            case "json":
                read.value = readJSON(path.resolve(filePath), enc);
                break;

            case "jpeg":
            case "jpg":
            case "png":
            case "gif":
                read.value = readImage(filePath);
                break;

            case "md":
            case "txt":
            case "html":
            case "xml":
            case "csl":
            default:
                read.value = readText(filePath, enc);
                break;
        }

        return read;
    } catch (err: any) {
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
    chmod?: number,
): string {
    let filePath: string;
    if (typeof file === "string") {
        filePath = file;
    } else {
        filePath = file.filePath;
    }

    if (typeof chmod === "undefined") chmod = 0o666; // default to 666 that is readable and writable by everyone

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

            case "jpeg":
            case "jpg":
            case "png":
            case "gif":
            case "docx":
            case "pdf":
            case "epub":
                // contents = new Uint8Array(contents;
                console.log({ contents });
                break;

            case "md":
            case "txt":
            case "html":
            default:
                contents = contents.toString();
                break;
        }
        fs.writeFileSync(resolvedPath, contents, options);
        fs.chmodSync(resolvedPath, chmod);
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
                if (typeof file.value === "object") {
                    file.value = JSON.stringify(file.value, null, 4);
                }
                break;

            case "md":
            case "txt":
            case "html":
            default:
                file.value = file.value ? file.value.toString() : "";
                break;
        }
        fs.writeFileSync(resolvedPath, file.value, options);

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
        value: props.value,
    };
    return file;
}
