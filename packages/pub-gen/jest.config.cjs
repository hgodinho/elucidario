module.exports = {
    roots: ["."],
    transform: {
        "^.+\\.js$": [
            "babel-jest",
            {
                configFile: "./babel.config.cjs",
            },
        ],
    },
    moduleDirectories: ["node_modules"],
    modulePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/src/"],
};
