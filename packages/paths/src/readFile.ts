import fs from "fs";
import path from "path";

import type { ReadContentsReturn } from "@elucidario/pkg-types";

/**
 *  Read file contents
 * @param filePath | path to file
 * @param ext | file extension
 * @returns | file contents
 */
export const readFile = (
    filePath: string,
    ext?: string,
): ReadContentsReturn | string => {
    const file = path.parse(filePath);
    if (!ext) ext = file.ext.replace(".", "");
    try {
        switch (ext) {
            case "json":
                return JSON.parse(
                    fs.readFileSync(path.resolve(filePath), "utf-8").toString(),
                );

            default:
                return fs
                    .readFileSync(path.resolve(filePath), "utf-8")
                    .toString();
        }
    } catch (err: any) {
        throw new Error(`Cannot read file at ${filePath}: ${err}`);
    }
};
