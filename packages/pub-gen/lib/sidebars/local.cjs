/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebar = {
    sidebar: [
        {
            type: "link",
            label: "Home",
            href: "/",
        },
        "pub-gen",
        "publicacao",
        "referencia",
        "versionamento",
        "google-drive",
        {
            type: "category",
            label: "schemas",
            items: [
                "schemas/pub-gen-schema",
                "schemas/reference-schema",
                "schemas/table-schema",
            ],
        },
    ],
};
module.exports = sidebar;
