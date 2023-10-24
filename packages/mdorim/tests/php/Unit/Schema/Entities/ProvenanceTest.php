<?php

beforeAll( function () {
	global $core;
	$core = \Mdorim\Core::get_instance();
	global $schema;
	$schema = \Mdorim\Schema\Schemas::get_instance();
} );

afterAll( function () {
	global $schema;
	unset( $schema );
} );

test( "mdorim/provenance", function () {
	global $schema;
	$validate = $schema->validate( "mdorim/provenance", (object) array(
		"entity_id" => 1,
		"name" => "concept-test",
		"guid" => "acdca5e6-ca0d-4eb7-8a64-ecb59df61395",
		"author" => 1,
		"password" => "bnana",

		"type" => "Activity",

		"identified_by" => array(
			(object) array(
				"type" => "Identifier",
				"content" => "Ola mundo",
			),
		),
		"classified_as" => array(
			(object) array(
				"type" => "Type",
				"id" => "https://elucidario.art/mdorim/concept/1",
				"_label" => "concept-test",
			),
		),
		"referred_to_by" => array(
			(object) array(
				"type" => "LinguisticObject",
				"content" => "Ola mundo",
			),
		),
		"equivalent" => array(
			(object) array(
				"type" => "Activity",
				"id" => "https://elucidario.art/mdorim/concept/1",
				"_label" => "concept-test",
			),
		),

		"representation" => array(
			(object) array(
				"type" => "VisualItem",
				"id" => "https://elucidario.art/mdorim/representation/1",
				"_label" => "representacao-test",
			),
		),
		"member_of" => array(
			(object) array(
				"type" => "Set",
				"id" => "https://elucidario.art/mdorim/collection/1",
				"_label" => "collection-test",
			),
		),
		"subject_of" => array(
			(object) array(
				"type" => "DigitalObject",
				"id" => "https://elucidario.art/mdorim/digital/1",
				"_label" => "digital-test",
			),
		),
		"attributed_by" => array(
			(object) array(
				"type" => "AttributeAssignment",
				"_label" => "Ola mundo",
				"identified_by" => array(
					(object) array(
						"type" => "Identifier",
						"content" => "Ola mundo",
					),
				),
				"referred_to_by" => array(
					(object) array(
						"type" => "LinguisticObject",
						"content" => "Ola mundo",
					),
				),
				"timespan" => (object) array(
					"type" => "TimeSpan",
					"begin_of_the_begin" => "2018-11-13T20:20:39+00:00",
					"end_of_the_end" => "2018-11-13T20:20:39+00:00",
				),
			),
		),

	) );
	expect( $validate )->toBeTrue();
} );