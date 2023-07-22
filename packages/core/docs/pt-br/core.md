# `@elucidario.art/core`

Plugin Elucidário.art

Sistema de Gestão de Coleções

## LCDR\Abstracts\Mdorim\Entity

```mermaid
    classDiagram

        Entity "1" --* "1" Schema : possui
        Entity "1" --* "1" History : possui
        Entity "1" --* "1" Meta : possui

        History "1" --* "*" Event : possui

        class Entity {
            <<abstract>>

            +int ID
            +string type
            +Schema schema
            +object data
            +Meta meta
            +History history

            +get() mixed
            +set_type()
            +set_data(data, validate = true)
            +get_data() object
            +get_schema() Schema
            +get_meta() Meta
        }

        class Schema {
            <<final>>

            +string type
            +object data
            #object schema

            +set_schema()
            +get_schema() object
            +set_data(data)
            +validate() true|Exception
        }

        class History {
            <<final>>

            +List~Event~ events

            +add_event(event)
            +get_events() array
            +get_event(ID) Event
            +remove_event(ID) bool
        }

        class Event {
            <<final>>

            +int ID
            +date timestamp
            +string type
            +int entity
            +int user
            +string name
            +int reference
            +mixed previous
            +mixed current

            +set_previous(previous)
            +set_current(current)
        }

        class Meta {
            <<final>>

            +int ID
            +string type
            +string uri
            +string slug
            +int author
            +string status
        }
```
