import type { Metadata } from "../types";
import { headerTemplate, toMD, } from "@elucidario/docusaurus-md";
import { metadata } from "./parts/parts";

export const metadataTemplate = (meta: Metadata) =>
    toMD([
        headerTemplate("Metadata", meta.description),
        `# Metadados`,
        meta.description,
        `## Definições`,
        ...Object.entries(meta.definitions).map(([key, value]) => {
            return metadata(key, value, 'metadados');
        }),
    ]);
