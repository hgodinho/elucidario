<?php

beforeAll( function () {
	global $core, $schema;

	$core = \Mdorim\Core::get_instance();
	$schema = \Mdorim\Schema\Schemas::get_instance();
} );

afterAll( function () {
	global $core;
	unset( $core );
} );

test( '\Mdorim\Schema\Schemas::get_instance()', function () {
	$instance = \Mdorim\Schema\Schemas::get_instance();
	expect( $instance )->toBeInstanceOf( \Mdorim\Schema\Schemas::class);
	expect( $instance )->toBe( \Mdorim\Schema\Schemas::get_instance() );

	global $core;
	expect( $core->schemas )->toBeInstanceOf( \Mdorim\Schema\Schemas::class);
} );

test( '\Mdorim\Schema\Schemas class init_validator() method', function () {
	global $schema;
	$schema->init_validator();
	expect( $schema->validator )->toBeInstanceOf( \Opis\JsonSchema\Validator::class);
} );

test( '$core->schemas instance', function () {
	global $core;
	expect( $core->schemas )->toBeInstanceOf( \Mdorim\Schema\Schemas::class);
	expect( $core->schemas->validator )->toBeInstanceOf( \Opis\JsonSchema\Validator::class);
} );

test( 'id_map() method', function () {
	global $schema;
	$id_map = $schema->id_map( 'concept' );
	expect( $id_map )->toBe( 'https://elucidario.art/mdorim/schemas/concept.json' );

	$id_map2 = $schema->id_map( 'concept/concept' );
	expect( $id_map2 )->toBe( 'https://elucidario.art/mdorim/schemas/concept/concept.json' );
	expect( $id_map )->toBe( 'https://elucidario.art/mdorim/schemas/concept.json' );

	$id_map3 = $schema->id_map( 'concept/concept', array(
		'definitions' => 'StorageObject'
	) );
	expect( $id_map3 )->toBe( 'https://elucidario.art/mdorim/schemas/concept/concept.json#/definitions/StorageObject' );

	$id_map4 = $schema->id_map( 'concept/concept', array(
		'definitions' => array(
			'StorageObject' => array(
				'properties' => 'identified_by'
			)
		)
	) );
	expect( $id_map4 )->toBe( 'https://elucidario.art/mdorim/schemas/concept/concept.json#/definitions/StorageObject/properties/identified_by' );
} );

test( 'validate() method should return true with right data and right schema', function () {
	global $schema;
	$result = $schema->validate( 'mdorim/concept', (object) array(
		'entity_id' => 1,
		'name' => 'concept-test',
		'guid' => 'acdca5e6-ca0d-4eb7-8a64-ecb59df61395',
		'author' => 1,
		'type' => 'Concept',
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
			global $schema;
			$schema->validate( 'mdorim/concept', (object) array(
				'clafied_as' => array(
				),
			) );
		}
	)->toThrow( \Exception::class);
} );