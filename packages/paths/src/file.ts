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
 * Read file contents
 *
 * @returns | file contents
 */
export function readFile<T>(file: string | ReadFileProps): File<T> {
    let enc: BufferEncoding | undefined;
    let ext: string | undefined;
    let filePath: string;
    if (typeof file === "string") {
        filePath = file;
    } else {
        filePath = file.filePath;
        enc = file.enc;
        ext = file.ext;
    }
    if (typeof enc === "undefined") enc = "utf-8";
    const parsed = path.parse(filePath);
    if (typeof ext === "undefined") ext = parsed.ext.replace(".", "");

    const { size, atime, mtime, ctime, birthtime } = fs.statSync(
        path.resolve(filePath),
    );

    const read: File<T> = {
        name: parsed.name,
        path: filePath,
        ext,
        content: "" as T,
        size,
        atime,
        mtime,
        ctime,
        birthtime,
    };

    try {
        switch (ext) {
            case "json":
                read.content = JSON.parse(
                    fs.readFileSync(path.resolve(filePath), enc).toString(),
                ) as T;
                break;

            case "md":
            case "txt":
            case "html":
                read.content = fs
                    .readFileSync(path.resolve(filePath), enc)
                    .toString() as T;
                break;
        }

        return read;
    } catch (err: any) {
        throw new Error(`Cannot read file at ${filePath}: ${err}`);
    }
}

/**
 * Create a file if it doesn't exist, overwriting it if it does.
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
        throw new Error(`Cannot create file at ${file}: ${err}`);
    }
}

/**
 * Parse file
 *
 * @param props | file contents
 * @returns | file contents
 */
export function parseFile(props: ParseFileProps): File<string> {
    const ext = props.ext
        ? props.ext
        : path.parse(props.path).ext.replace(".", "");
    const file: File<string> = {
        name: props.name,
        path: props.path,
        ext,
        content: props.content,
    };
    return file;
}
