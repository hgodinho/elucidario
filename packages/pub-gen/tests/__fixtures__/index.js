import path from "path";
import { readFile, getPaths, createFile } from "@elucidario/pkg-paths";

export function createFixture(name, content) {
    createFile(
        path.resolve(
            getPaths().packages,
            "pub-gen",
            "tests",
            "__fixtures__",
            name,
        ),
        content,
    );
}

export function getFixture(name) {
    return readFile(
        path.resolve(
            getPaths().packages,
            "pub-gen",
            "tests",
            "__fixtures__",
            name,
        ),
    ).value;
}
