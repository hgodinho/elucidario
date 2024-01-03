import CSL from "citeproc";
import path from "path";
import { Console } from "@elucidario/pkg-console";
import { getPaths, readFile } from "@elucidario/pkg-paths";

const paths = getPaths();
const packageJson = readFile(
    path.resolve(paths.packages, "pub-gen", "package.json"),
).value;
const console = new Console(packageJson);

export const engine = (references, lang, style) => {
    try {
        if (
            typeof lang === "undefined" ||
            typeof style === "undefined" ||
            typeof references === "undefined"
        ) {
            throw new Error(
                `Some properties are undefined [${[
                    `lang: ${lang}`,
                    `style: ${style}`,
                    `references: ${references}`,
                ].join(", ")}]`,
            );
        }
        const localeXml = readFile({
            filePath: path.resolve(
                paths.packages,
                "pub-gen",
                "cache",
                "locales",
                `locales-${lang}.xml`,
            ),
            ext: "xml",
        }).value;

        const styleXml = readFile({
            filePath: path.resolve(
                paths.packages,
                "pub-gen",
                "cache",
                "styles",
                style,
            ),
            ext: "csl",
        }).value;

        const sys = {
            retrieveLocale: function () {
                return localeXml;
            },
            retrieveItem: function (id) {
                const selected = references.find((ref) => ref.id === id);
                return selected;
            },
        };

        const cslEdit = new CSL.Engine(sys, styleXml);
        return cslEdit;
    } catch (error) {
        throw new Error(error);
    }
};
