import { Page } from "../types";
import { toMD, headerTemplate, status } from "@elucidario/docusaurus-md";
import { resolveRef, metaType, propertiesTable } from "./parts/parts";

export const pageTemplate = (page: Page) => {
    return toMD([
        headerTemplate(`${page.title}`, `${page.title}`),
        `# ${page.title}`,
        status(page.status),
        "## Descrição",
        page.description,
        "---",
        "## Classes",
        toMD(
            Object.entries(page.mainEntity.ref.definitions).map(
                ([key, definition]) => {
                    return toMD([
                        `### \`${definition.title}\``,
                        definition.type ? metaType(definition) : "",
                        definition.description,
                        definition.$ref ? resolveRef(definition.$ref) : "",
                        propertiesTable(definition),
                        "---",
                    ]);
                }
            )
        ),
    ]);
};
