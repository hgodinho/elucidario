const path = require("path");

const env = process.env.ENV || "localhost";

const url =
    env === "codespace"
        ? "https://hgodinho-refactored-space-garbanzo-q4qq76v9rvc9px7-3000.preview.app.github.dev"
        : env === "production"
        ? "https://hgodinho.github.io"
        : "http://localhost:3000";

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Elucidário.art",
    tagline: "Aplicativo para documentação e divulgação museológica",
    favicon: "img/elucidario.ico",
    trailingSlash: false,
    deploymentBranch: "gh-pages",
    // Set the production url of your site here
    url: url,
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "hgodinho", // Usually your GitHub org/user name.
    projectName: "elucidario", // Usually your repo name.

    onBrokenLinks: "log",
    onBrokenMarkdownLinks: "log",

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "pt-br",
        locales: ["pt-br"],
    },

    staticDirectories: [
        "static",
        path.resolve(__dirname, "../../packages/mdorim/static"),
        path.resolve(__dirname, "../../packages/pub-gen/static"),
    ],

    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    path: "docs", // Path to docs data on filesystem, relative to workspace dir.
                    routeBasePath: "/", // Set this value to '/'.
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl:
                        "https://github.com/hgodinho/elucidario/tree/main/apps/mdorim-docs",
                },
                blog: false,
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
    plugins: [
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "mdorim",
                path: "../../packages/mdorim/docs",
                routeBasePath: "mdorim",
                editUrl:
                    "https://github.com/hgodinho/elucidario/tree/main/packages/mdorim",
                sidebarPath: "../../packages/mdorim/docs/localSidebars.cjs",
                showLastUpdateTime: true,
                showLastUpdateAuthor: true,
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                id: "pub-gen",
                path: "../../packages/pub-gen/docs",
                routeBasePath: "pub-gen",
                editUrl:
                    "https://github.com/hgodinho/elucidario/tree/main/packages/pub-gen",
                sidebarPath: "../../packages/pub-gen/lib/sidebars/local.cjs",
                showLastUpdateTime: true,
                showLastUpdateAuthor: true,
            },
        ],
    ],

    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "Elucidário.art",
            items: [
                {
                    href: "https://github.com/hgodinho/elucidario",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Home",
                            to: "/",
                        },
                    ],
                },
            ],
            copyright: `${new Date().getFullYear()} Elucidario.art.`,
        },
    },
};

module.exports = config;
