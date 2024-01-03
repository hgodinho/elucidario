// import { migrate } from "../../lib/migration/migration-helper";
import migrate from "../../lib/migration/1.0.0";

describe("1.0.0", () => {
    it("should migrate", async () => {
        const config = {
            $schema:
                "https://elucidario.art/pub-gen/schemas/pub-gen-schema.json",
            name: "dissertacao-mestrado",
            version: "1.0.0",
            profile: "data-package",
            id: "https://elucidario.art/publicacoes/dissertacao-mestrado",
            title: "Dissertação mestrado",
            type: "dissertation",
            year: "2023",
            description: "Adicionar descrição",
            homepage: "https://elucidario.art",
            keywords: ["adicionar", "palavras", "chaves"],
            languages: ["pt-br"],
            publications: [
                {
                    title: "Dissertação mestrado",
                    language: "pt-br",
                    style: {
                        name: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                        url: "https://github.com/citation-style-language/styles/blob/6b7fdff8cb0fb45b342e8ac319634bf18168c73d/universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                    },
                },
            ],
            contributors: [
                {
                    title: "Henrique Godinho Lopes Costa",
                    email: "henrique@hgod.in",
                    organization:
                        "Programa de Pós-graduação em Ciência da Informação da Escola de Comunicação e Artes da Universidade de São Paulo",
                    role: "author",
                },
            ],
            created: "2023-05-05T01:51:25.830Z",
        };
        const migrated = await migrate(config);

        expect(migrated).toEqual({
            added: ["private", "documents"],
            modified: ["$schema", "version"],
            removed: ["publications", "languages"],
            config: {
                $schema:
                    "node_modules/@elucidario/pkg-pub-gen/static/pub-gen/schemas/pub-gen-schema.json",
                name: "dissertacao-mestrado",
                version: "1.0.0",
                profile: "data-package",
                id: "https://elucidario.art/publicacoes/dissertacao-mestrado",
                title: "Dissertação mestrado",
                type: "dissertation",
                year: "2023",
                private: false,
                description: "Adicionar descrição",
                homepage: "https://elucidario.art",
                keywords: ["adicionar", "palavras", "chaves"],
                documents: [
                    {
                        title: "Dissertação mestrado",
                        language: "pt-br",
                        style: {
                            name: "universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                            url: "https://github.com/citation-style-language/styles/blob/6b7fdff8cb0fb45b342e8ac319634bf18168c73d/universidade-de-sao-paulo-escola-de-comunicacoes-e-artes-abnt.csl",
                        },
                    },
                ],
                contributors: [
                    {
                        title: "Henrique Godinho Lopes Costa",
                        email: "henrique@hgod.in",
                        organization:
                            "Programa de Pós-graduação em Ciência da Informação da Escola de Comunicação e Artes da Universidade de São Paulo",
                        role: "author",
                    },
                ],
                created: "2023-05-05T01:51:25.830Z",
            },
        });
    });
});
