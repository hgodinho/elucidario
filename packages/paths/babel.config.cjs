// eslint-disable-next-line no-undef
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current",
                },
            },
        ],
    ],
    plugins: [
        "@babel/plugin-syntax-import-attributes",
        "@babel/plugin-transform-json-strings",
    ],
};
