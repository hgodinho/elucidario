import fs from "fs";
import path from "path";

/**
 * Create a directory if it doesn't exist.
 *
 * @param folderPath The path to the directory.
 */
export function createDir(folderPath: string): void {
    try {
        const stats = fs.statSync(path.resolve(folderPath));
        if (!stats.isDirectory()) {
            fs.mkdirSync(path.resolve(folderPath), { recursive: true });
        }
    } catch (err) {
        fs.mkdirSync(path.resolve(folderPath), { recursive: true });
    }
}

/**
 * Check if a directory exists.
 *
 * @param dirPath The path to the dir.
 * @returns True if the dir exists, false otherwise.
 */
export function dirExists(dirPath: string): boolean {
    try {
        const stats = fs.statSync(path.resolve(dirPath));
        return stats.isDirectory();
    } catch (err) {
        return false;
    }
}
