import type { Metadata } from "../types";
import { headerTemplate, toMD, metadata } from "./markdown";

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
