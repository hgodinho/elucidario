---
filename: "{{entity}}-{{entity}}"
title: "Fig. X - Diagrama ER entre wp_lcdr_{{entity}} e wp_lcdr_{{entity}}_{{entity}}"
source: "**Fonte:** Elaborado pelo autor."
width: 1920
background: transparent
---

```mermaid
    erDiagram
        wp_lcdr_{{entity}}_{{entity}} {
            int id "ID da relação"
            int id_{{entity}}_a
            int id_{{entity}}_b
            string name "nome da propriedade"
            int order "Ordem"
        }

        wp_lcdr_{{entity}} }|--|{ wp_lcdr_{{entity}}_{{entity}} : "{{relation}}"

        wp_lcdr_{{entity}}
```
