<?php

use Yoast\WPTestUtils\WPIntegration\TestCase;

uses( TestCase::class);

beforeEach( function () {
	parent::setUp();
} );

afterEach( function () {
	parent::tearDown();
} );

test( 'verifica se funções foram corretamente carregadas', function () {
	$this->assertNotFalse( function_exists( 'lcdr_activate_plugin_hook' ) );

	$this->assertNotFalse( function_exists( 'lcdr_deactivate_plugin_hook' ) );

	$this->assertNotFalse( function_exists( 'lcdr_uninstall_plugin_hook' ) );
} );

test( 'lcdr_camel_to_snake', function () {
	$this->assertEquals( 'test_test', lcdr_camel_to_snake( 'testTest' ) );
} );

test( 'lcdr_snake_to_camel', function () {
	$this->assertEquals( 'testTest', lcdr_snake_to_camel( 'test_test' ) );
} );

test( 'lcdr_set_option', function () {
	global $random;
	$this->assertEquals( lcdr_set_option( 'test2', $random ), 1 );
} );

test( 'lcdr_get_option', function () {
	global $random;
	$this->assertEquals( lcdr_get_option( 'test2' ), $random );
} );

test( 'lcdr_json_file', function () {
	$json = lcdr_json_file( dirname( __FILE__, 3 ) . "/data/json-data.json" );
	expect( $json )->toBeArray();
} );

test( 'lcdr_get_json_properties', function () {
	$properties = lcdr_get_json_properties();
	expect( $properties )->toBe(
		array(
			'identified_by',
			'equivalent',
			'attributed_by',
			'dimension',
			'digitally_available_via',
			'created_by',
			'contact_point',
			'formed_by',
			'dissolved_by',
			'born',
			'died',
			'timespan',
			'part',
			'produced_by',
			'destroyed_by',
			'removed_by',
		)
	);
} );

test( 'lcdr_get_columns_names', function () {
	expect( lcdr_get_columns_names() )->toMatchArray(
		array(
			'name',
			'guid',
			'author',
			'status',
			'password',
			'created',
			'entity_id',
			'type',
			'_label',
			'identified_by',
			'equivalent',
			'attributed_by',
			'dimension',
			'digitally_available_via',
			'created_by',
			'contact_point',
			'formed_by',
			'dissolved_by',
			'born',
			'died',
			'timespan',
			'part',
			'produced_by',
			'destroyed_by',
			'removed_by',
		)
	);
} );

test( 'lcdr_get_columns_names("mapping")', function () {
	expect( lcdr_get_columns_names( "mapping" ) )->toMatchArray(
		array(
			'name',
			'guid',
			'author',
			'status',
			'password',
			'created',
			'mapping_id',
			'title',
			'standard',
			'description',
			'uri',
			'version',
		)
	);
} );

test( 'lcdr_get_relationships_names', function () {
	expect( lcdr_get_relationships_names() )->toBe(
		array(
			'classified_as',
			'representation',
			'member_of',
			'subject_of',
			'part_of',
			'conforms_to',
			'access_point',
			'digitally_carries',
			'digitally_shows',
			'used_for',
			'carried_out',
			'residence',
			'took_place_at',
			'caused_by',
			'carried_out_by',
			'used_specific_object',
			'influenced_by',
			'technique',
			'digitally_shown_by',
			'shown_by',
			'about',
			'represents',
			'represents_instance_of_type',
			'made_of',
			'current_owner',
			'current_custodian',
			'current_permanent_custodian',
			'current_location',
			'shows',
			'carries',
			'approximated_by',
			'language',
			'digitally_carried_by',
			'carried_by',
			'refers_to',
			'broader'
		)
	);
} );

test( 'lcdr_get_valid_properties', function () {
	expect( lcdr_get_valid_properties() )->toBe(
		array(
			'name',
			'guid',
			'author',
			'status',
			'password',
			'created',
			'entity_id',
			'type',
			'_label',
			'identified_by',
			'equivalent',
			'attributed_by',
			'dimension',
			'digitally_available_via',
			'created_by',
			'contact_point',
			'formed_by',
			'dissolved_by',
			'born',
			'died',
			'timespan',
			'part',
			'produced_by',
			'destroyed_by',
			'removed_by',
			'classified_as',
			'representation',
			'member_of',
			'subject_of',
			'part_of',
			'conforms_to',
			'access_point',
			'digitally_carries',
			'digitally_shows',
			'used_for',
			'carried_out',
			'residence',
			'took_place_at',
			'caused_by',
			'carried_out_by',
			'used_specific_object',
			'influenced_by',
			'technique',
			'digitally_shown_by',
			'shown_by',
			'about',
			'represents',
			'represents_instance_of_type',
			'made_of',
			'current_owner',
			'current_custodian',
			'current_permanent_custodian',
			'current_location',
			'shows',
			'carries',
			'approximated_by',
			'language',
			'digitally_carried_by',
			'carried_by',
			'refers_to',
			'broader',
			'referred_to_by'
		)
	);
} );

test( 'lcdr_get_entity()', function () {
	$query = new \LCDR\DB\Query\Concepts();
	global $item_id;
	$item_id = $query->add_entity( array(
		'type' => 'Type',
		'_label' => 'relation-test',
		'author' => 1,
		'status' => 'publish',
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 2',
			),
		),
	) );
	$entity = lcdr_get_entity( $item_id );
	$this->assertEquals( $entity->type, 'Type' );
	expect( $entity )->toBeInstanceOf( \LCDR\DB\Row\Entity::class);
} );

test( 'lcdr_unique_entity_slug()', function () {
	global $item_id;
	$entity = lcdr_get_entity( $item_id );
	expect( lcdr_unique_entity_slug( $entity->entity_id, $entity->_label, $entity->status ) )->toBe( "relation-test-{$item_id}" );
} );

test( 'lcdr_insert_entity()', function () {
	global $item_id;
	$query = new \LCDR\DB\Query\Concepts();
	$item_id = $query->add_entity( array(
		'type' => 'Type',
		'_label' => 'relation-test',
		'author' => 1,
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 2',
			),
		),
	) );
	$entity = lcdr_get_entity( $item_id );
	$this->assertEquals( $entity->type, 'Type' );
	expect( $entity )->toBeInstanceOf( \LCDR\DB\Row\Entity::class);
} );

test( 'lcdr_validate_value_from_schema', function () {
	$value = lcdr_validate_value_from_schema(
		(Object) array(
			'@context' => 'https://linked.art/ns/v1/linked-art.json',
			'id' => 'https://linked.art/example/event/1',
			'type' => 'Event',
			'_label' => 'Teste',
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 2',
				),
			)
		), 'linked-art/event' );

	expect( $value )->toBeTrue();
} );