import fs from "fs";
import path from "path";

import { getPaths } from "../getPaths.js";

import { Console } from "@elucidario/pkg-console";

const paths = getPaths();

const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);

const console = new Console(packageJson);

export const listTemplates = async (args) => {
    const templates = fs.readdirSync(
        path.resolve(paths.pubGen, "template", "docx")
    );
    console.log(templates, {
        defaultLog: true,
        title: "Available templates",
        type: "info",
    });
};
