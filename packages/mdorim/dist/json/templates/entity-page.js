"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageTemplate = void 0;
exports.pageTemplate = `---
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
//# sourceMappingURL=entity-page.js.map