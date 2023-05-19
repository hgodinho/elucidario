import fs from "fs";
import path from "path";

export const getPaths = () => {
    if (process.cwd().includes("publications")) {
        // estamos em algum diretório filho do diretório publications
        const rootPath = path.resolve(process.cwd().split("publications")[0]);
        return generatePaths(rootPath);
    } else if (process.cwd().includes("pub-gen")) {
        // estamos em algum diretório filho do diretório pub-gen
        const rootPath = path.resolve(process.cwd().split("pub-gen")[0], "..");
        return generatePaths(rootPath);
    } else {
        // estamos em qualquer outro diretório
        const pathObject = path.parse(process.cwd());
        if (pathObject.name === "elucidario") {
            // estamos na raiz do monorepo elucidario
            return generatePaths(process.cwd());
        } else {
            // estamos sei la onde
            console.log(pathObject, {
                defaultLog: true,
                type: "error",
                title: "não implementado",
            });
            // return generatePaths(process.cwd());
        }
    }
    return false;
};

const generatePaths = (root) => {
    let paths = {
        pubGen: path.resolve(root, "packages", "pub-gen"),
    };
    try {
        if (!fs.existsSync(path.resolve(root, "pub-gen-config.json"))) {
            throw new Error(
                "Não foi encontrado o arquivo pub-gen-config.json. Por favor, crie um arquivo pub-gen-config.json com o comando pub-gen init"
            );
        } else {
            const pubGenConfig = JSON.parse(
                fs.readFileSync(path.resolve(root, "pub-gen-config.json"))
            );
            paths = Object.keys(pubGenConfig).reduce((acc, cur) => {
                acc[cur] = path.resolve(root, pubGenConfig[cur]);
                return acc;
            }, paths);
        }
    } catch (error) {
        console.log(error.message, {
            type: "error",
            defaultLog: true,
            title: "Error",
        });
    }
    return paths;
};
