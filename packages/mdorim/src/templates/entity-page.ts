export const pageTemplate = `---
title: {{title}}
description: {{description}}
---

# {{title}}

::: {{status.type}} {{status.title}} 
{{#if status.description}} 
{{status.description}} 
{{/if}}
:::

## Descrição

{{description}}

---

## Classes

{{definitionRef}}

{{definition}}
`;
