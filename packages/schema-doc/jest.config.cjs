/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.ts?$": [
            "ts-jest",
            {
                useESM: true,
            },
        ],
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "mjs"],
    extensionsToTreatAsEsm: [".ts", ".tsx"],
};
