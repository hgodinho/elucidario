import fs from "fs";
import path from "path";
import { readFile, fileExists, getPaths } from "@elucidario/pkg-paths";

const paths = getPaths();

export function generateManifest({ publication, lang, assets }) {
    const srcPath = path.resolve(
        paths.publications,
        publication,
        "content",
        lang,
    );

    console.log(srcPath);

    // se não houver um index.json no srcPath,
    // cria um index.json com os nomes dos arquivos
    // se houver, adiciona references ao index.json
    if (fileExists(path.resolve(srcPath, "index.json"))) {
        const index = readFile(path.resolve(srcPath, "index.json"));

        console.log(index);
        const assetsKeys = Object.keys(assets)
            .map((key) => {
                if (assets[key].length > 0) return key;
            })
            .filter((key) => key !== undefined);

        if (fileExists(path.resolve(srcPath, "acronyms.json"))) {
            assetsKeys.push("acronyms");
        }

        let position = 0;
        let offset = 2;
        if (assetsKeys.length > 0) {
            assetsKeys.forEach((key) => {
                if (!index.files.includes(key))
                    index.files.splice(position + offset, 0, key);
                position++;
            });
        }

        if (!index.files.includes("references")) index.files.push("references");

        index.files = index.files.map((file) => {
            const filePath = path.parse(file);
            if (filePath.ext === "") return `${file}.md`;
            return file;
        });

        // fs.writeFileSync(
        //     path.resolve(distPath, lang, "index.json"),
        //     JSON.stringify(index)
        // );
    } else {
        console.log("não tem index.json");
        // fs.writeFileSync(
        //     path.resolve(distPath, lang, "index.json"),
        //     JSON.stringify({
        //         files: [
        //             fs.readdirSync(path.resolve(distPath, lang)),
        //             "references",
        //         ],
        //     })
        // );
    }
}
