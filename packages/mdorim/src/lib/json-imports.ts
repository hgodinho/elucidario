// Mdorim
import mdorimCore from "../../static/mdorim/schemas/mdorim/core.json" assert { type: "json" };
import mdorimConcept from "../../static/mdorim/schemas/mdorim/concept.json" assert { type: "json" };
import mdorimDigital from "../../static/mdorim/schemas/mdorim/digital.json" assert { type: "json" };
import mdorimEvent from "../../static/mdorim/schemas/mdorim/event.json" assert { type: "json" };
import mdorimGroup from "../../static/mdorim/schemas/mdorim/group.json" assert { type: "json" };
import mdorimMapping from "../../static/mdorim/schemas/mdorim/mapping.json" assert { type: "json" };
import mdorimObject from "../../static/mdorim/schemas/mdorim/object.json" assert { type: "json" };
import mdorimOption from "../../static/mdorim/schemas/mdorim/options.json" assert { type: "json" };
import mdorimPerson from "../../static/mdorim/schemas/mdorim/person.json" assert { type: "json" };
import mdorimPlace from "../../static/mdorim/schemas/mdorim/place.json" assert { type: "json" };
import mdorimPropMap from "../../static/mdorim/schemas/mdorim/prop_map.json" assert { type: "json" };
import mdorimProvenance from "../../static/mdorim/schemas/mdorim/provenance.json" assert { type: "json" };
import mdorimSet from "../../static/mdorim/schemas/mdorim/set.json" assert { type: "json" };
import mdorimText from "../../static/mdorim/schemas/mdorim/text.json" assert { type: "json" };
import mdorimVisual from "../../static/mdorim/schemas/mdorim/visual.json" assert { type: "json" };

// Linked Art
import linkedArtCore from "../../static/mdorim/schemas/linked-art/core.json" assert { type: "json" };
import linkedArtConcept from "../../static/mdorim/schemas/linked-art/concept.json" assert { type: "json" };
import linkedArtEvent from "../../static/mdorim/schemas/linked-art/event.json" assert { type: "json" };
import linkedArtGroup from "../../static/mdorim/schemas/linked-art/group.json" assert { type: "json" };
import linkedArtObject from "../../static/mdorim/schemas/linked-art/object.json" assert { type: "json" };
import linkedArtPerson from "../../static/mdorim/schemas/linked-art/person.json" assert { type: "json" };
import linkedArtPlace from "../../static/mdorim/schemas/linked-art/place.json" assert { type: "json" };
import linkedArtDigital from "../../static/mdorim/schemas/linked-art/digital.json" assert { type: "json" };
import linkedArtProvenance from "../../static/mdorim/schemas/linked-art/provenance.json" assert { type: "json" };
import linkedArtSet from "../../static/mdorim/schemas/linked-art/set.json" assert { type: "json" };
import linkedArtText from "../../static/mdorim/schemas/linked-art/text.json" assert { type: "json" };
import linkedArtVisual from "../../static/mdorim/schemas/linked-art/visual.json" assert { type: "json" };

// Translations
// schema
import translation from "../../static/mdorim/schemas/translation/schema.json" assert { type: "json" };
// strings
import translations from "../../static/mdorim/translations.json" assert { type: "json" };

const linkedArt = {
    core: linkedArtCore,
    concept: linkedArtConcept,
    event: linkedArtEvent,
    group: linkedArtGroup,
    object: linkedArtObject,
    person: linkedArtPerson,
    place: linkedArtPlace,
    digital: linkedArtDigital,
    provenance: linkedArtProvenance,
    set: linkedArtSet,
    text: linkedArtText,
    visual: linkedArtVisual,
};

const mdorim = {
    core: mdorimCore,
    concept: mdorimConcept,
    digital: mdorimDigital,
    event: mdorimEvent,
    group: mdorimGroup,
    mapping: mdorimMapping,
    object: mdorimObject,
    option: mdorimOption,
    person: mdorimPerson,
    place: mdorimPlace,
    propMap: mdorimPropMap,
    provenance: mdorimProvenance,
    set: mdorimSet,
    text: mdorimText,
    visual: mdorimVisual,
};

export { mdorim, linkedArt, translation, translations };
