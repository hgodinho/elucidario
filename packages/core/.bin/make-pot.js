import wpPot from "wp-pot";

const generatePot = () => {
    wpPot({
        destFile: "languages/lcdr-php.pot",
        domain: "lcdr",
        package: "@elucidario/core",
        src: ["src/php/**/*.php"],
    });
};

generatePot();
