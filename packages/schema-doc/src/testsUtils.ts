import path from "path";
import { readFile, getPaths, createFile } from "@elucidario/pkg-paths";

export function createFixture(name: string, content: any) {
    createFile(
        path.resolve(
            getPaths().packages,
            "schema-doc",
            "tests",
            "__fixtures__",
            name,
        ),
        content,
    );
}

export function getFixture(name: string) {
    return readFile(
        path.resolve(
            getPaths().packages,
            "schema-doc",
            "tests",
            "__fixtures__",
            name,
        ),
    ).value;
}
