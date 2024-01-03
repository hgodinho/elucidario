import { I18n } from "i18n";
import path from "path";
import { getPaths } from "@elucidario/pkg-paths";
import type { GetPathsReturn } from "@elucidario/pkg-types";

const paths = getPaths();

const i18n = new I18n({
    locales: ["en", "pt-BR"],
    directory: path.resolve(paths.packages, "schema-doc", "locales"),
    defaultLocale: "en",
});

export default i18n;
