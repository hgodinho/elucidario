import type { Metadata } from "../types";
import { mappingTable } from "./mapping-table";

export const metadataTemplate = (metadata: Metadata) =>
    [
        `---
title: "Metadata"
description: ${metadata.description}
---

# Metadados

${metadata.description}

## Definições`,
        ...Object.entries(metadata.definitions).map(([key, value]) => {
            return `### ${key}

> Tipo de dado: ${value.type} 

${value.description}

${mappingTable(value.map)}`;
        }),
    ].join("\n\n");
