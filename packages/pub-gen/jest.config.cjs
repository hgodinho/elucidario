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
    moduleDirectories: ["node_modules", "lib"],
};
