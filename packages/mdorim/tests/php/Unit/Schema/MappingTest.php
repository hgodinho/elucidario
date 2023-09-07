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

test( 'schemas/mapping/mapping', function () {
	global $validator;
	$validate = $validator->validate( 'schemas/mapping/mapping', (object) array(
		'mapping_id' => 1,
		'name' => 'mapeamento-test',
		'title' => 'Mapeamento teste',
		'guid' => 'acdca5e6-ca0d-4eb7-8a64-ecb59df61395',
		'author' => 1,
		'standard' => 'spectrum',
		'standard_uri' => 'https://elucidario.art/mdorim/spectrum',
		'version' => '1.0.0',
		'created' => '2018-11-13T20:20:39+00:00',
		'modified' => '2018-11-13T20:20:39+00:00',
		'mapping' => array(
			(object) array(
				'map_id' => 1,
				'description' => 'mapeamento-test',
				'guid' => 'acdca5e6-ca0d-4eb7-8a64-ecb59df61395',
				'prop_name' => 'identified_by',
				'entity_type' => 'Type',
				'external_prop_name' => 'name',
				'external_prop_type' => 'string',
				'external_prop_uri' => 'http://www.w3.org/2000/01/rdf-schema#label',
				"map_value" => (object) array(
					"type" => "Identifier",
					"classified_as" => array(
						(object) array(
							"type" => "Type",
							"id" => "https://elucidario.art/mdorim/concept/1",
							"_label" => "concept-test"
						)
					),
				),
				"editable" => true,
				"status" => "active",
			)
		)
	) );
	expect( $validate )->toBeTrue();
} );