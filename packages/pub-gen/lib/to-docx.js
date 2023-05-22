import path from "path";
import fs from "fs";

import { pubGenRemarkProcessor } from "./remark/processor.js";

import { readContents } from "@elucidario/pkg-schema-doc";
import { getPaths } from "./getPaths.js";
import { Console } from "@elucidario/pkg-console";
const paths = getPaths();
import { engine } from "./reference/csl-engine.js";

// import docx from "remark-docx";

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);

const console = new Console(packageJson);

export const toDocx = async (options) => {
    const { publication } = options;

    if (!publication) {
        const error = "No publication specified";
        console.log(
            { error },
            { defaultLog: true, type: "error", title: "toDocx" }
        );
        throw new Error(error);
    }

    const contents = readContents(
        path.resolve(paths.publications, publication, "content"),
        "md"
    );

    console.log(
        { contents },
        { defaultLog: true, type: "info", title: "toDocx" }
    );
};

// toDocx({
//     publication: "interseccoes-entre-linked-art-e-spectrum",
// });
