---
filename: "{{entity_a}}-{{entity_b}}"
title: "Fig. X - Diagrama EK entre wp_lcdr_{{entity_a}} e wp_lcdr_{{entity_a}}_{{entity_b}}"
source: "**Fonte:** Elaborado pelo autor."
width: 1920
background: transparent
---

```mermaid
    erDiagram
        wp_lcdr_{{entity_a}}_{{entity_b}} {
            int id "ID da relação"
            int id_{{entity_a}}
            int id_{{entity_b}}
            string name "nome da propriedade"
            int order "Ordem"
        }

        wp_lcdr_{{entity_a}} }|--|{ wp_lcdr_{{entity_a}}_{{entity_b}} : "{{relation_a}}"

        wp_lcdr_{{entity_b}} }|--|{ wp_lcdr_{{entity_a}}_{{entity_b}} : "{{relation_b}}"

        wp_lcdr_{{entity_a}}

        wp_lcdr_{{entity_b}}
```
