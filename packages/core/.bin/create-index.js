import fs from "fs";
import path from "path";

const root = path.resolve();

const packageJson = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8")
);

const generateIndex = () => {
    const template = fs.readFileSync(
        path.resolve(root, "src", "php", "index.php"),
        "utf8"
    );

    const index = template
        .toString()
        .replaceAll("<!PLUGIN_NAME>", packageJson.wp_plugin.name)
        .replaceAll("<!VERSION>", packageJson.version)
        .replaceAll("<!DESCRIPTION>", packageJson.description)
        .replaceAll("<!WP_AT_LEAST>", packageJson.wp_plugin.wp_at_least)
        .replaceAll("<!MIN_PHP>", packageJson.wp_plugin.min_php)
        .replaceAll("<!AUTHOR>", packageJson.author)
        .replaceAll("<!LICENSE>", packageJson.license)
        .replaceAll("<!TEXT_DOMAIN>", packageJson.wp_plugin.text_domain)
        .replaceAll("<!DOMAIN_PATH>", packageJson.wp_plugin.domain_path);

    fs.writeFileSync(path.resolve(root, "index.php"), index);
    console.log("index.php generated");
};

generateIndex();
