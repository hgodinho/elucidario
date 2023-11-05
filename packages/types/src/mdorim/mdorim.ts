import { Entity, Schema } from "@/mdorim/json-schema";

export type LocalizedString = {
    lang: string;
    content: string;
};

export type Translation = {
    label: LocalizedString[];
    description: LocalizedString[];
};

export type Translations = {
    [x: string]: Translation;
};

export type LinkedArtTypes =
    | "core"
    | "concept"
    | "digital"
    | "event"
    | "group"
    | "person"
    | "place"
    | "provenance"
    | "set"
    | "text"
    | "visual";

type GenericTypes = "procedure" | "mapping" | "prop_map" | "history" | "option";

export type MdorimTypes = GenericTypes | LinkedArtTypes;

export type Index = {
    linkedArt: {
        [x: string]: string;
    };
    mdorim: {
        [x: string]: string;
    };
    translation: {
        [x: string]: string;
    };
};

export type MdorimInstance = {
    examples: any;
    schemas: {
        linkedArt: {
            [x in MdorimTypes]: Entity;
        };
        mdorim: {
            [x in MdorimTypes]: Entity;
        };
        translation: Entity;
    };
    translations: Translations;
    index: Index;
    context: Entity;
};

export type ParsedId = {
    origin: string;
    pathname: string;
    hash: string;
    entityId: string;
};

export type parseId = (id: string) => ParsedId;

export type Mdorim = {
    getInstance: (context?: MdorimTypes) => MdorimInstance;
    getSchema: (name: MdorimTypes, type?: "linkedArt" | "mdorim") => Entity;
    getFromId: (id: string) => Entity | Schema;
    getEntityFromIndex: (
        indexId: string,
        type?: "linkedArt" | "mdorim",
    ) => Entity;
    getTranslation: (name: string) => Translation;
    getTranslations: () => Translations;
};

export type LinkedArtProperties =
    | "@context"
    | "idProp"
    | "typeProp"
    | "_labelProp"
    | "identified_byProp"
    | "classified_asProp"
    | "referred_to_byProp"
    | "equivalentProp"
    | "representationProp"
    | "member_ofProp"
    | "subject_ofProp"
    | "attributed_byProp"
    | "dimensionProp"
    | "part_ofProp"
    | "formatProp"
    | "conforms_toProp"
    | "access_pointProp"
    | "digitally_available_viaProp"
    | "digitally_carriesProp"
    | "digitally_showsProp"
    | "used_forProp"
    | "created_byProp"
    | "carried_outProp"
    | "contact_pointProp"
    | "residenceProp"
    | "formed_byProp"
    | "dissolved_byProp"
    | "bornProp"
    | "diedProp"
    | "took_place_atProp"
    | "timespanProp"
    | "caused_byProp"
    | "carried_out_byProp"
    | "used_specific_objectProp"
    | "influenced_byProp"
    | "techniqueProp"
    | "digitally_show_byProp"
    | "shown_byProp"
    | "aboutProp"
    | "representsProp"
    | "represents_instance_of_typeProp"
    | "made_ofProp"
    | "partProp"
    | "current_ownerProp"
    | "current_custodianProp"
    | "current_permanent_custodianProp"
    | "current_locationProp"
    | "showsProp"
    | "carriesProp"
    | "produced_byProp"
    | "destroyed_byProp"
    | "removed_byProp"
    | "defined_byProp"
    | "approximated_byProp"
    | "contentProp"
    | "languageProp"
    | "digitally_carried_byProp"
    | "carried_byProp"
    | "refers_toProp"
    | "broaderProp"
    | "diminishedProp"
    | "transferred_title_fromProp"
    | "transferred_title_toProp"
    | "transferred_title_ofProp"
    | "transferred_custody_fromProp"
    | "transferred_custody_toProp"
    | "transferred_custody_ofProp"
    | "paid_fromProp"
    | "paid_toProp"
    | "paid_amountProp"
    | "establishesProp"
    | "invalidatesProp"
    | "encounteredProp"
    | "moved_fromProp"
    | "moved_toProp"
    | "movedProp"
    | "assigned_byProp"
    | "begin_of_the_beginProp"
    | "end_of_the_beginProp"
    | "begin_of_the_endProp"
    | "end_of_the_endProp"
    | "durationProp"
    | "valueProp"
    | "lower_value_limitProp"
    | "upper_value_limitProp"
    | "unitProp"
    | "currencyProp"
    | "possessed_byProp"
    | "applies_toProp"
    | "assignedProp"
    | "assigned_propertyProp";

export type MdorimProperties =
    | LinkedArtProperties
    | "entity_id"
    | "name"
    | "uuid"
    | "author"
    | "status"
    | "password"
    | "created"
    | "modified"
    | "history"
    | "events"
    | "history_id"
    | "timestamp"
    | "type"
    | "user"
    | "entity"
    | "property"
    | "relatad_event"
    | "current"
    | "previous"
    | "mapping_id"
    | "title"
    | "description"
    | "standard"
    | "standard_uri"
    | "version"
    | "mapping"
    | "map_id"
    | "prop_name"
    | "entity_type"
    | "external_prop_name"
    | "external_prop_uri"
    | "external_prop_type"
    | "map_value"
    | "editable"
    | "status"
    | "status"
    | "option_id"
    | "value"
    | "schema";
