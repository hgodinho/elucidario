<?php

beforeAll( function () {
	global $core;
	global $validator;
	$core = \Mdorim\Core::get_instance();
	$validator = \Mdorim\Schema\Validator::get_instance();
} );

afterAll( function () {
	global $core;
	global $validator;
	unset( $core );
	unset( $validator );
} );

test( 'Validator class', function () {
	global $validator;
	expect( $validator )->toBeInstanceOf( \Mdorim\Schema\Validator::class);
	expect( $validator->validator )->toBeInstanceOf( \Opis\JsonSchema\Validator::class);
} );

test( 'Validator class init_validator() method', function () {
	global $validator;
	$validator->init_validator();
	expect( $validator->validator )->toBeInstanceOf( \Opis\JsonSchema\Validator::class);
} );

test( '$core->validator instance', function () {
	global $core;
	expect( $core->validator )->toBeInstanceOf( \Mdorim\Schema\Validator::class);
	expect( $core->validator->validator )->toBeInstanceOf( \Opis\JsonSchema\Validator::class);
} );

test( 'id_map() method', function () {
	global $validator;
	$id_map = $validator->id_map( 'concept' );
	expect( $id_map )->toBe( 'https://elucidario.art/mdorim/concept.json' );

	$id_map2 = $validator->id_map( 'concept/concept' );
	expect( $id_map2 )->toBe( 'https://elucidario.art/mdorim/concept/concept.json' );
	expect( $id_map )->toBe( 'https://elucidario.art/mdorim/concept.json' );

	$id_map3 = $validator->id_map( 'concept/concept', array(
		'definitions' => 'StorageObject'
	) );
	expect( $id_map3 )->toBe( 'https://elucidario.art/mdorim/concept/concept.json#/definitions/StorageObject' );

	$id_map4 = $validator->id_map( 'concept/concept', array(
		'definitions' => array(
			'StorageObject' => array(
				'properties' => 'identified_by'
			)
		)
	) );
	expect( $id_map4 )->toBe( 'https://elucidario.art/mdorim/concept/concept.json#/definitions/StorageObject/properties/identified_by' );
} );

test( 'validate() method should return true with right data and right schema', function () {
	global $validator;
	$result = $validator->validate( 'schemas/mdorim/concept', (object) array(
		'entity_id' => 1,
		'name' => 'concept-test',
		'guid' => 'acdca5e6-ca0d-4eb7-8a64-ecb59df61395',
		'author' => 1,
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Ola mundo',
			)
		),
		'classified_as' => array(
			(object) array(
				'type' => 'Type',
				'id' => 'https://elucidario.art/mdorim/concept/1',
			)
		),
	) );
	expect( $result )->toBeTrue();
} );

test( 'validate() method should throw exception with wrong data', function () {
	expect(
		function () {
			global $validator;
			$error = $validator->validate( 'schemas/mdorim/concept', (object) array(
				'identified_by' => array(
					(object) array(
						'xablau' => 'Identifier',
					)
				),
				'clafied_as' => array(
					(object) array(
						'type' => 'Type',
						'id' => 1,
					)
				),
			) );
		}
	)->toThrow( \Exception::class);
} );