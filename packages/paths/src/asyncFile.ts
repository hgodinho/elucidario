import path from "path";
import fs from "fs/promises";
import { statSync } from "fs";
import type { File, ReadFileProps } from "@elucidario/pkg-types";

import { supportedExtensions } from "./file";

/**
 *  Read JSON file
 * @param filePath | path to file
 * @param enc | encoding
 * @returns | json file contents
 */
export async function asyncReadJSON(filePath: string, enc: BufferEncoding) {
    try {
        const c = await fs.readFile(path.resolve(filePath), enc);
        return JSON.parse(c.toString());
    } catch (er) {
        throw er;
    }
}

/**
 *  Read text file
 * @param filePath | path to file
 * @param enc | encoding
 * @returns | text file contents
 */
export async function asyncReadText(
    filePath: string,
    enc: BufferEncoding = "utf8",
) {
    try {
        const c = await fs.readFile(path.resolve(filePath), enc);
        return c.toString();
    } catch (er) {
        throw er;
    }
}

/**
 *  Read image file
 * @param filePath | path to file
 * @returns | image file contents
 */
export async function asyncReadImage(filePath: string) {
    try {
        return await fs.readFile(path.resolve(filePath));
    } catch (er) {
        throw er;
    }
}

/**
 * Read file contents
 *
 * @returns | file contents
 */
export async function asyncReadFile(
    file: string | ReadFileProps,
): Promise<File> {
    let enc: BufferEncoding | undefined = "utf8";
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
    if (typeof ext === "undefined") {
        ext = parsed.ext.replace(".", "");
        if (".gh-token" === parsed.name) {
            ext = "json";
        }
    }

    const read: File = {
        name: parsed.name,
        path: filePath,
        ext,
        value: "",
        ...(stats ? statSync(path.resolve(filePath)) : {}),
    };

    try {
        if (returnType === "path") return read;

        if (!supportedExtensions.includes(ext))
            throw new Error(`Unsupported file extension: ${ext} (${filePath})`);

        switch (ext) {
            case "json":
                read.value = await asyncReadJSON(path.resolve(filePath), enc);
                break;

            case "jpeg":
            case "jpg":
            case "png":
            case "gif":
                read.value = await asyncReadImage(filePath);
                break;

            case "md":
            case "txt":
            case "html":
            case "xml":
            case "csl":
            default:
                read.value = await asyncReadText(filePath, enc);
                break;
        }

        return read;
    } catch (err: any) {
        console.error(err);
        throw new Error(`Cannot read file at ${filePath}: ${err}`);
    }
}
