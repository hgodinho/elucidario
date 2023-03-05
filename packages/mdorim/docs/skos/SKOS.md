```mermaid
%%{init: { 'theme': 'forest', 'themeVariables': { 'lineColor': '#fff' } } }%%
    erDiagram
        %% SKOS

        WP_Term

        ConceptScheme {
            const type "skos:ConceptScheme"
            WP_Term term
            array hasConcepts
            array notes
            array labels
        }

        AbstractConcept {
            WP_Term term
            array inScheme "conceptSchemeRef"
            array topConceptOf "conceptSchemeRef"
            array notes
            array mappings
            array labels
            array relations
        }

        Concept {
            const type "skos:Concept"
        }

        Collection {
            const type "skos:Collection"
            array members
        }

        OrderedCollection {
            const type "skos:OrderedConcept"
            array membersList
        }

        note {
            string type "skos:(note|definition|scopeNote|example|historyNote|editorialNote|changeNote)"
            string content
            string lang
        }

        label {
            string type "skos:(prefLabel|altLabel|hiddenLabel)"
            string content
            string lang
        }

        relation {
            string type "skos:(semanticRelation|broader|broaderTransitive|narrower|narrowerTransitive|related)"
            object conceptRef
        }

        AbstractConcept ||--|| WP_Term : "use"
        ConceptScheme ||--|| WP_Term : "use"

        Concept ||--|| AbstractConcept : "extends"
        Collection ||--|| AbstractConcept : "extends"
        OrderedCollection ||--|| AbstractConcept : "extends"

        %% CONCEPT-SCHEME-REF
        conceptSchemeRef {
            int ID
        }
        conceptSchemeRef ||--|| ConceptScheme : "ID"

        %% CONCEPT-REF
        conceptRef {
            string relation "hasConcept~inScheme|hasTopConcept~topConceptOf"
            int ID
        }
        conceptRef ||--|| Concept : "term->ID"
        conceptRef ||--|| Collection : "term->ID"
        conceptRef ||--|| OrderedCollection : "term->ID"

        %% LABELS
        AbstractConcept ||--|{ label : "hasLabels"
        ConceptScheme ||--|{ label : "hasLabels"

        %% NOTES
        AbstractConcept ||--|{ note : "notes"
        ConceptScheme ||--|{ note : "notes"
        
        %% RELATION
        AbstractConcept ||--|{ relation : "hasRelations"
        relation ||--|| conceptRef : "hasConceptRef"

        %% MAPPING-REF
        mappingRef {
            string type "skos:(closeMatch|exactMatch|broadMatch|narrowMatch|relatedMatch)"
            object conceptSchemeRef
            object conceptRef
        }
        mappingRef ||--|| conceptRef : "has"
        mappingRef ||--|| conceptSchemeRef : "has"

        %% MAPPINGS
        AbstractConcept ||--|{ mappingRef : "mappings"

        ConceptScheme ||--|{ conceptRef : "hasConcepts"
        AbstractConcept ||--|{ conceptSchemeRef : "inScheme|topConceptOf"

```
