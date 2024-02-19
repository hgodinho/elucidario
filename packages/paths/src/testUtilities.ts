import path from "path";
import { readFile, getPaths, createFile } from ".";

export function createFixture(name: string, content: any, pkg: string) {
    createFile(
        path.resolve(getPaths().packages, pkg, "tests", "__fixtures__", name),
        content,
    );
}

export function getFixture(name: string, pkg: string) {
    return readFile(
        path.resolve(getPaths().packages, pkg, "tests", "__fixtures__", name),
    ).value;
}
