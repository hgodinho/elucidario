import path from "path";
import fs, { WriteFileOptions } from "fs";
import { createDir } from "./folder";
import type {
    File,
    ReadFileProps,
    ParseFileProps,
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
export function readFile<T>({ filePath, ext, enc }: ReadFileProps): File<T> {
    if (typeof enc === "undefined") enc = "utf-8";

    const parsed = path.parse(filePath);
    if (!ext) ext = parsed.ext.replace(".", "");

    const { size, atime, mtime, ctime, birthtime } = fs.statSync(
        path.resolve(filePath),
    );

    const file: File<T> = {
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
                file.content = JSON.parse(
                    fs.readFileSync(path.resolve(filePath), enc).toString(),
                ) as T;
                break;

            case "md":
            case "txt":
            case "html":
                file.content = fs
                    .readFileSync(path.resolve(filePath), enc)
                    .toString() as T;
                break;
        }

        return file;
    } catch (err: any) {
        throw new Error(`Cannot read file at ${filePath}: ${err}`);
    }
}

/**
 * Create a file if it doesn't exist, overwriting it if it does.
 *
 * @param filePath The path to the file.
 * @param contents The contents of the file.
 * @returns {string}
 */
export function createFile(
    filePath: string,
    contents: any,
    options?: WriteFileOptions,
): string {
    const resolvedPath = path.resolve(filePath);
    const { dir } = path.parse(resolvedPath);
    createDir(dir);
    fs.writeFileSync(resolvedPath, contents, options);
    return resolvedPath;
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
