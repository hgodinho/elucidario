import CSL from "citeproc";
import fs from "fs";
import path from "path";
import { Console } from "@elucidario/pkg-console";
import { getPaths } from "../getPaths.js";

const paths = getPaths();
const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(paths.pubGen, "package.json"))
);
const console = new Console(packageJson);

export const engine = (references, lang, style) => {
    try {
        const localeXml = fs
            .readFileSync(
                path.resolve(
                    paths.pubGen,
                    "cache",
                    "locales",
                    `locales-${lang}.xml`
                )
            )
            .toString();

        const styleXml = fs
            .readFileSync(
                path.resolve(paths.pubGen, "cache", "styles", `${style}.csl`)
            )
            .toString();

        const sys = {
            retrieveLocale: function () {
                return localeXml;
            },
            retrieveItem: function (id) {
                const selected = references.find((ref) => ref.id === id);
                return selected;
            },
        };

        return new CSL.Engine(sys, styleXml);
    } catch (error) {
        console.log({ error }, { defaultLog: true, type: "error" });
    }
};
