import fs from "fs";
import path from "path";

import { Console } from "@elucidario/pkg-console";

import { getPaths } from "../getPaths.js";
import { prepareData } from "./search.js";

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

export const validateReferences = async (options) => {
    let { publication } = options;

    if (!publication) {
        console.log("No publication provided. Validating all references.");
    }
    try {
        const references = await prepareData(
            publication
                ? path.resolve(paths.publications, publication, "references")
                : path.resolve(paths.references)
        );
        if (typeof references === "boolean" && !references) {
            console.log({ references }, { defaultLog: true });
            throw new Error("No index.json for references found.", {
                cause: "no-index-json",
            });
        }

        // tudo ok
        console.log("All references are valid.", { type: "success" });
    } catch (error) {
        publication = publication ? publication : "monorepo";
        let title = "Error!";
        if (error.cause) {
            title = `There are ${
                error.cause.length ?? 1
            } errors in references for "${publication}" [validateReferences()].`;
        } else {
            title = `There is an error in references for "${publication}" [validateReferences()].`;
        }

        console.log(error.cause || error, {
            defaultLog: true,
            type: "error",
            title,
        });
    }
};
