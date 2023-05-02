import path from "path";
import fs from "fs";

import { getPaths } from "../getPaths.js";
import { addReference } from "./addReference.js";

import { Console } from "@elucidario/pkg-console";

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

export const reference = async (args) => {
    try {
        console.log(paths, {
            title: "Paths",
            type: "success",
            defaultLog: true,
        });
        const { publication } = args;

        if (publication) {
            if (!fs.existsSync(path.resolve(paths.references, publication))) {
                throw new Error(
                    `The publication "${publication}" doesn't exists.`
                );
            } else {
                console.log(
                    `Adding reference to publication "${publication}"`,
                    {
                        type: "warning",
                        title: "ainda não implementado",
                        defaultLog: true,
                    }
                );
                throw new Error("ainda não implementado");
            }
        } else {
            try {
                addReference(args, paths);
            } catch (error) {
                console.log(error, { type: "error" });
            }
        }
    } catch (error) {
        console.log(error, { type: "error" });
    }
};
