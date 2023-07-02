import { readContents } from "../dist";
import { jest } from "@jest/globals";

const fs = {};

beforeAll(() => {
    fs.readdirSync = jest.fn(() => ["arquivo1", "arquivo2", "subdiretorio"]);

    fs.readFileSync = jest.fn((filePath) => {
        if (filePath.endsWith("arquivo1")) return "conteúdo do arquivo 1";
        if (filePath.endsWith("arquivo2")) return "conteúdo do arquivo 2";
        if (filePath.endsWith("subdiretorio/subarquivo"))
            return "conteúdo do subarquivo";
    });

    global.fs = fs;
});

describe("readContents", () => {
    test("Deve ler o conteúdo do diretório corretamente", () => {
        const dirPath = "caminho/do/diretorio";
        const expectedOutput = {
            arquivo1: "conteúdo do arquivo 1",
            arquivo2: "conteúdo do arquivo 2",
            subdiretorio: {
                subarquivo: "conteúdo do subarquivo",
            },
        };

        const result = readContents({ dirPath });

        expect(result).toEqual(expectedOutput);
    });
});
