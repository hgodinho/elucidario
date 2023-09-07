<?php

beforeAll( function () {
	global $core;
	$core = \Mdorim\Core::get_instance();
	global $validator;
	$validator = \Mdorim\Schema\Validator::get_instance();
} );

afterAll( function () {
	global $validator;
	unset( $validator );
} );

test( 'schemas/mdorim/concept', function () {
	global $validator;
	$validate = $validator->validate( 'schemas/mdorim/concept', (object) array(
		'entity_id' => 1,
		'name' => 'concept-test',
		'guid' => 'acdca5e6-ca0d-4eb7-8a64-ecb59df61395',
		'author' => 1,
		'password' => 'bnana',
		"identified_by" => array(
			(object) array(
				"type" => "Identifier",
				"content" => "Ola mundo"
			)
		),
		"referred_to_by" => array(
			(object) array(
				"type" => "LinguisticObject",
				"content" => "Ola mundo"
			)
		),
		"equivalent" => array(
			(object) array(
				"type" => "Type",
				"id" => "https://elucidario.art/mdorim/concept/1",
				"_label" => "concept-test"
			)
		),
		"attributed_by" => array(
			(object) array(
				"type" => "AttributeAssignment",
				"_label" => "Ola mundo",
				"identified_by" => array(
					(object) array(
						"type" => "Identifier",
						"content" => "Ola mundo"
					)
				),
				"referred_to_by" => array(
					(object) array(
						"type" => "LinguisticObject",
						"content" => "Ola mundo"
					)
				),
				"timespan" => (object) array(
					"type" => "TimeSpan",
					"begin_of_the_begin" => "2018-11-13T20:20:39+00:00",
					"end_of_the_end" => "2018-11-13T20:20:39+00:00"
				)
			)
		),
		"classified_as" => array(
			(object) array(
				"type" => "Type",
				"id" => "https://elucidario.art/mdorim/concept/1",
				"_label" => "concept-test"
			)
		),
		"created_by" => (object) array(
			"type" => "Creation",
			"_label" => "Ola mundo",
			"identified_by" => array(
				(object) array(
					"type" => "Identifier",
					"content" => "Ola mundo"
				)
			),
			"classified_as" => array(
				(object) array(
					"type" => "Type",
					"id" => "https://elucidario.art/mdorim/concept/1",
					"_label" => "concept-test"
				)
			),
			"referred_to_by" => array(
				(object) array(
					"type" => "LinguisticObject",
					"content" => "Ola mundo"
				)
			),
			"took_place_at" => array(
				(object) array(
					"type" => "Place",
					"id" => "https://elucidario.art/mdorim/place/1",
					"_label" => "place-test"
				)
			),
		),
		"representation" => array(
			(object) array(
				"type" => "VisualItem",
				"id" => "https://elucidario.art/mdorim/representation/1",
				"_label" => "representacao-test"
			)
		),
		"member_of" => array(
			(object) array(
				"type" => "Set",
				"id" => "https://elucidario.art/mdorim/collection/1",
				"_label" => "collection-test"
			)
		),
		"subject_of" => array(
			(object) array(
				"type" => "DigitalObject",
				"id" => "https://elucidario.art/mdorim/digital/1",
				"_label" => "digital-test"
			)
		),
		"broader" => array(
			(object) array(
				"type" => "Type",
				"id" => "https://elucidario.art/mdorim/concept/1",
				"_label" => "concept-test"
			)
		),
	) );
	expect( $validate )->toBeTrue();
} );