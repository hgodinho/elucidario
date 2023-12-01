import {
    pubGenConfig,
    packageJson,
    cleanFalsy,
    publicationPkgName,
    createREADME,
    createGitignore,
    createPubGenJson,
    createPackageJson,
} from "../lib/utils";
import testPubGenConfig from "../../../publications/publicacao-teste/pub-gen.json";
import testPackageJson from "../../../publications/publicacao-teste/package.json";

describe("pubGenConfig", () => {
    it("should return the default config", () => {
        expect(pubGenConfig("publicacao-teste")).toEqual(testPubGenConfig);
    });
    it("should throw an error if the publication doesn't exist", () => {
        expect(() => pubGenConfig("banana")).toThrow();
    });
});

describe("packageJson", () => {
    it("should return the default config", () => {
        expect(packageJson("publicacao-teste")).toEqual(testPackageJson);
    });
    it("should throw an error if the publication doesn't exist", () => {
        expect(() => packageJson("banana")).toThrow();
    });
});

describe("cleanFalsy", () => {
    it("should remove falsy values from an object", () => {
        const obj = {
            a: undefined,
            b: null,
            c: false,
            d: 0,
            e: "",
            f: "f",
            g: {
                h: undefined,
                i: null,
                j: false,
                k: 0,
                l: "",
                m: "m",
                n: {
                    o: undefined,
                    p: null,
                    q: false,
                    r: 0,
                    s: "",
                    t: "t",
                },
            },
            u: [
                {
                    v: undefined,
                    w: null,
                    x: false,
                    y: 0,
                    z: "",
                    aa: "aa",
                    ab: {
                        ac: undefined,
                        ad: null,
                        ae: false,
                        af: 0,
                        ag: "",
                        ah: "ah",
                    },
                    ai: [
                        {
                            aj: undefined,
                            ak: null,
                            al: false,
                            am: 0,
                            an: "",
                            ao: "ao",
                        },
                    ],
                },
            ],
            ap: [],
            aq: {},
            ar: true,
        };
        const clean = cleanFalsy(obj);

        expect(clean).toEqual({
            c: false,
            d: 0,
            f: "f",
            g: {
                j: false,
                k: 0,
                m: "m",
                n: {
                    q: false,
                    r: 0,
                    t: "t",
                },
            },
            u: [
                {
                    x: false,
                    y: 0,
                    aa: "aa",
                    ab: {
                        ae: false,
                        af: 0,
                        ah: "ah",
                    },
                    ai: [
                        {
                            al: false,
                            am: 0,
                            ao: "ao",
                        },
                    ],
                },
            ],
            ar: true,
        });
    });
});

describe("publicationPkgName", () => {
    it("should return the publication package name", () => {
        const packageNames = [
            "publicacao-teste",
            "publicacao teste 2",
            "Publicacao Teste 3",
        ];

        const created = [
            "@elucidario/pub-publicacao-teste",
            "@elucidario/pub-publicacao-teste-2",
            "@elucidario/pub-publicacao-teste-3",
        ];

        packageNames.forEach((pkgName, i) => {
            expect(publicationPkgName(pkgName)).toEqual(created[i]);
        });
    });
});

describe("createREADME", () => {
    it("should create a README.md file", () => {
        const pkgName = "publicacao-teste";
        const pkg = {
            name: pkgName,
            description: "Teste de publicação",
            version: "0.0.1",
        };
        const readme = createREADME(pkgName, pkg);

        expect(readme).toEqual(
            `# \`@elucidario/pub-publicacao-teste\`

> Publicação gerada com [pub-gen](https://elucidario.art/pub-gen)

Teste de publicação`
        );
    });
});

describe("createGitignore", () => {
    it("should create a .gitignore file", () => {
        const gitignore = createGitignore();

        expect(gitignore).toEqual(
            `node_modules
credentials.json
token.json
dist
~$*.*`
        );
    });
});

describe("createPubGenJson", () => {
    it("should create a pub-gen.json file", () => {
        const pkgName = "publicacao-teste";
        const pkg = {
            keywords: "teste, publicação",
            banana: "banana",
        };
        const pubGenJson = createPubGenJson(pkgName, pkg);

        expect(pubGenJson).toMatchObject({
            $schema:
                "node_modules/@elucidario/pkg-pub-gen/static/pub-gen/schemas/pub-gen-schema.json",
            version: "1.0.0",
            profile: "data-package",
            id: "https://elucidario.art/publicacoes/publicacao-teste",
            keywords: ["teste", "publicação"],
            banana: "banana",
        });
    });

    it("should create another pub-gen.json file", () => {
        const pkgName = "publicacao-teste";
        const pkg = {
            keywords: "teste; publicação", // changes the , to ;
            banana: "banana",
        };
        const pubGenJson = createPubGenJson(pkgName, pkg);

        expect(pubGenJson).toMatchObject({
            $schema:
                "node_modules/@elucidario/pkg-pub-gen/static/pub-gen/schemas/pub-gen-schema.json",
            version: "1.0.0",
            profile: "data-package",
            id: "https://elucidario.art/publicacoes/publicacao-teste",
            keywords: ["teste", "publicação"],
            banana: "banana",
        });
    });
});

describe("createPackageJson", () => {
    it("should create a package.json file", () => {
        const pkgName = "publicacao-teste";
        const packageJson = createPackageJson(pkgName);

        expect(packageJson).toMatchObject({
            name: "@elucidario/pub-publicacao-teste",
            version: "0.1.0",
            private: true,
            scripts: {
                "add-author": "pub-gen add-author -p publicacao-teste",
                authenticate: "pub-gen authenticate -p publicacao-teste",
                build: "pnpm clean && pub-gen build -p publicacao-teste",
                clean: "rm -rf dist/*",
                convert: "pub-gen convert -p publicacao-teste",
                "ref-add": "pub-gen reference add -p publicacao-teste",
                "ref-search": "pub-gen reference search -p publicacao-teste",
                "version-up": "pub-gen version -p publicacao-teste",
            },
        });
    });
});
