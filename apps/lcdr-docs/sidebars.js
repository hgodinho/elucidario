// @ts-check

const mdorim = require("../../packages/mdorim/src/sidebars.cjs");

const pubGen = require("../../packages/pub-gen/lib/sidebars/sidebars.cjs");

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    sidebar: [
        "doc",
        // "glossario/glossario",
        {
            type: "category",
            label: "Pacotes",
            items: [
                {
                    type: "category",
                    label: "Mdorim",
                    items: mdorim.sidebar,
                },
                {
                    type: "category",
                    label: "pub-gen",
                    items: pubGen.sidebar,
                },
            ],
        },
    ],
};

module.exports = sidebars;
