import { Page } from "../types";
import { toMD, headerTemplate, status, metaType, metadataProperties, resolveRef } from "./markdown";

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
            Object.entries(page.mainEntity.ref.definitions).map(([key, definition]) => {
                return toMD([
                    `### \`${definition.title}\``,
                    definition.type ? metaType(definition) : "",
                    definition.description,
                    definition.$ref ? resolveRef(definition.$ref) : "",
                    metadataProperties(definition),
                    '---',
                ]);
            }
        )),
    ]);
};
