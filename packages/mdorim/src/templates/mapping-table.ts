import type { Mapping } from "../types";

export const mappingTable = (map: Mapping | undefined) => {
    if (!map) {
        return "";
    }
    return `
#### Mapeamento

| Vocabulário | Link |
| ----- | --------- |
${Object.entries(map)
    .map(([key, value]) => `| ${key} | <${value}> |`)
    .join("\n")}`;
};