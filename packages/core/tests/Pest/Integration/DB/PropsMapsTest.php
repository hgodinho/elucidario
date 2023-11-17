<?php

namespace LCDR\Tests\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$random = substr( md5( rand() ), 0, 7 );
$prop_map_id = 0;

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );

test( '\LCDR\DB\Query\PropsMaps class', function () {
	$query = new \LCDR\DB\Query\PropsMaps();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\PropsMaps::class);
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map()', function () {
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	global $prop_map_id;

	$prop_map_id = $prop_map_query->add_prop_map(
		array(
			'mapping_id' => 1,
			'prop_name' => 'identified_by',
			'entity_type' => 'Concept',
			'description' => 'Teste de mapeamento',
			'external_prop_name' => 'Title',
			'external_prop_description' => 'Titulo descricao',
			'external_prop_uri' => 'https://example.com',
			'external_prop_type' => 'string',
			'map_value' => (object) array(
				'type' => 'Identifier',
				'classified_as' => array(
					(object) array(
						'id' => 'http://purl.org/dc/elements/1.1/title',
						'type' => 'Type',
						'value' => 'Title'
					),
					(object) array(
						'id' => 'http://vocab.getty.edu/aat/300417209',
						'type' => 'Type',
						'value' => 'Full Title'
					),
				)
			),
			'editable' => false,
			'status' => 'active'
		)
	);

	expect( $prop_map_id )->toBeInt();
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map() no prop_name', function () {

	expect(
		function () {
			$prop_map_query = new \LCDR\DB\Query\PropsMaps();
			$prop_map_query->add_prop_map(
				array(
					'mapping_id' => 1,
					'entity_type' => 'Concept',
					'description' => 'Teste de mapeamento',
					'external_prop_name' => 'Title',
					'external_prop_description' => 'Titulo descricao',
					'external_prop_uri' => 'https://example.com',
					'external_prop_type' => 'string',
					'map_value' => (object) array(
						'type' => 'Identifier',
						'classified_as' => array(
							(object) array(
								'id' => 'http://purl.org/dc/elements/1.1/title',
								'type' => 'Type',
								'value' => 'Title'
							),
							(object) array(
								'id' => 'http://vocab.getty.edu/aat/300417209',
								'type' => 'Type',
								'value' => 'Full Title'
							),
						)
					),
					'editable' => false,
					'status' => 'active'
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a prop_name.' );
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map() no mapping_id', function () {

	expect(
		function () {
			$prop_map_query = new \LCDR\DB\Query\PropsMaps();
			$prop_map_query->add_prop_map(
				array(
					'prop_name' => 'identified_by',
					'entity_type' => 'Concept',
					'description' => 'Teste de mapeamento',
					'external_prop_name' => 'Title',
					'external_prop_description' => 'Titulo descricao',
					'external_prop_uri' => 'https://example.com',
					'external_prop_type' => 'string',
					'map_value' => (object) array(
						'type' => 'Identifier',
						'classified_as' => array(
							(object) array(
								'id' => 'http://purl.org/dc/elements/1.1/title',
								'type' => 'Type',
								'value' => 'Title'
							),
							(object) array(
								'id' => 'http://vocab.getty.edu/aat/300417209',
								'type' => 'Type',
								'value' => 'Full Title'
							),
						)
					),
					'editable' => false,
					'status' => 'active'
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a mapping_id.' );
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map() no entity_type', function () {

	expect(
		function () {
			$prop_map_query = new \LCDR\DB\Query\PropsMaps();
			$prop_map_query->add_prop_map(
				array(
					'mapping_id' => 1,
					'prop_name' => 'identified_by',
					'description' => 'Teste de mapeamento',
					'external_prop_name' => 'Title',
					'external_prop_description' => 'Titulo descricao',
					'external_prop_uri' => 'https://example.com',
					'external_prop_type' => 'string',
					'map_value' => (object) array(
						'type' => 'Identifier',
						'classified_as' => array(
							(object) array(
								'id' => 'http://purl.org/dc/elements/1.1/title',
								'type' => 'Type',
								'value' => 'Title'
							),
							(object) array(
								'id' => 'http://vocab.getty.edu/aat/300417209',
								'type' => 'Type',
								'value' => 'Full Title'
							),
						)
					),
					'editable' => false,
					'status' => 'active'
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a entity_type.' );
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map() no external_prop_name', function () {

	expect(
		function () {
			$prop_map_query = new \LCDR\DB\Query\PropsMaps();
			$prop_map_query->add_prop_map(
				array(
					'mapping_id' => 1,
					'prop_name' => 'identified_by',
					'entity_type' => 'Concept',
					'description' => 'Teste de mapeamento',
					'external_prop_description' => 'Titulo descricao',
					'external_prop_uri' => 'https://example.com',
					'external_prop_type' => 'string',
					'map_value' => (object) array(
						'type' => 'Identifier',
						'classified_as' => array(
							(object) array(
								'id' => 'http://purl.org/dc/elements/1.1/title',
								'type' => 'Type',
								'value' => 'Title'
							),
							(object) array(
								'id' => 'http://vocab.getty.edu/aat/300417209',
								'type' => 'Type',
								'value' => 'Full Title'
							),
						)
					),
					'editable' => false,
					'status' => 'active'
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a external_prop_name.' );
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map() no external_prop_type', function () {

	expect(
		function () {
			$prop_map_query = new \LCDR\DB\Query\PropsMaps();
			$prop_map_query->add_prop_map(
				array(
					'mapping_id' => 1,
					'prop_name' => 'identified_by',
					'entity_type' => 'Concept',
					'description' => 'Teste de mapeamento',
					'external_prop_name' => 'Title',
					'external_prop_description' => 'Titulo descricao',
					'external_prop_uri' => 'https://example.com',
					'map_value' => (object) array(
						'type' => 'Identifier',
						'classified_as' => array(
							(object) array(
								'id' => 'http://purl.org/dc/elements/1.1/title',
								'type' => 'Type',
								'value' => 'Title'
							),
							(object) array(
								'id' => 'http://vocab.getty.edu/aat/300417209',
								'type' => 'Type',
								'value' => 'Full Title'
							),
						)
					),
					'editable' => false,
					'status' => 'active'
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a external_prop_type.' );
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_map() no map_value', function () {

	expect(
		function () {
			$prop_map_query = new \LCDR\DB\Query\PropsMaps();
			$prop_map_query->add_prop_map(
				array(
					'mapping_id' => 1,
					'prop_name' => 'identified_by',
					'entity_type' => 'Concept',
					'description' => 'Teste de mapeamento',
					'external_prop_name' => 'Title',
					'external_prop_description' => 'Titulo descricao',
					'external_prop_uri' => 'https://example.com',
					'external_prop_type' => 'string',
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a map_value.' );
} );

test( '\LCDR\DB\Query\PropsMaps->get_prop_map()', function () {
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	global $prop_map_id;

	$prop_map = $prop_map_query->get_prop_map( $prop_map_id );

	expect( $prop_map )->toBeInstanceOf( \LCDR\DB\Row\PropMap::class);
	expect( $prop_map->map_id )->toBeInt();
	expect( $prop_map->mapping_id )->toBe( 1 );
	expect( $prop_map->prop_name )->toBe( 'identified_by' );
	expect( $prop_map->entity_type )->toBe( 'Concept' );
	expect( $prop_map->description )->toBe( 'Teste de mapeamento' );
	expect( $prop_map->external_prop_name )->toBe( 'Title' );
	expect( $prop_map->external_prop_description )->toBe( 'Titulo descricao' );
	expect( $prop_map->external_prop_uri )->toBe( 'https://example.com' );
	expect( $prop_map->external_prop_type )->toBe( 'string' );
	expect( $prop_map->map_value )->toMatchObject(
		(object) array(
			'type' => 'Identifier',
			'classified_as' => array(
				(object) array(
					'id' => 'http://purl.org/dc/elements/1.1/title',
					'type' => 'Type',
					'value' => 'Title'
				),
				(object) array(
					'id' => 'http://vocab.getty.edu/aat/300417209',
					'type' => 'Type',
					'value' => 'Full Title'
				),
			)
		)
	);
	expect( $prop_map->editable )->toBeBool();
	expect( $prop_map->status )->toBe( 'active' );
} );

test( '\LCDR\DB\Query\PropsMaps->add_prop_maps()', function () {
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_maps = $prop_map_query->add_props_maps(
		array(
			array(
				'mapping_id' => 2,
				'prop_name' => 'classified_as',
				'entity_type' => 'Concept',
				'description' => 'Teste de mapeamento',
				'external_prop_name' => 'Title',
				'external_prop_description' => 'Titulo descricao',
				'external_prop_uri' => 'https://example.com',
				'external_prop_type' => 'string',
				'map_value' => (object) array(
					'type' => 'Identifier',
					'classified_as' => array(
						(object) array(
							'id' => 'http://purl.org/dc/elements/1.1/title',
							'type' => 'Type',
							'value' => 'Title'
						),
						(object) array(
							'id' => 'http://vocab.getty.edu/aat/300417209',
							'type' => 'Type',
							'value' => 'Full Title'
						),
					)
				),
				'editable' => false,
				'status' => 'active'
			),
			array(
				'mapping_id' => 3,
				'prop_name' => 'classified_as',
				'entity_type' => 'Concept',
				'description' => 'Teste de mapeamento',
				'external_prop_name' => 'Title',
				'external_prop_description' => 'Titulo descricao',
				'external_prop_uri' => 'https://example.com',
				'external_prop_type' => 'string',
				'map_value' => (object) array(
					'type' => 'Identifier',
					'classified_as' => array(
						(object) array(
							'id' => 'http://purl.org/dc/elements/1.1/title',
							'type' => 'Type',
							'value' => 'Title'
						),
						(object) array(
							'id' => 'http://vocab.getty.edu/aat/300417209',
							'type' => 'Type',
							'value' => 'Full Title'
						),
					)
				),
				'editable' => false,
				'status' => 'active'
			),
			array(
				'mapping_id' => 4,
				'prop_name' => 'classified_as',
				'entity_type' => 'Concept',
				'description' => 'Teste de mapeamento',
				'external_prop_name' => 'Title',
				'external_prop_description' => 'Titulo descricao',
				'external_prop_uri' => 'https://example.com',
				'external_prop_type' => 'string',
				'map_value' => (object) array(
					'type' => 'Identifier',
					'classified_as' => array(
						(object) array(
							'id' => 'http://purl.org/dc/elements/1.1/title',
							'type' => 'Type',
							'value' => 'Title'
						),
						(object) array(
							'id' => 'http://vocab.getty.edu/aat/300417209',
							'type' => 'Type',
							'value' => 'Full Title'
						),
					)
				),
				'editable' => false,
				'status' => 'active'
			),
		)
	);

	expect( $prop_maps )->toBeArray();
} );

test( '\LCDR\DB\Query\PropsMaps->get_props_maps()', function () {
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_maps = $prop_map_query->get_props_maps();

	expect( $prop_maps )->toBeArray();
} );

test( '\LCDR\DB\Query\PropsMaps->get_props_maps_by_mapping_id()', function () {
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_maps = $prop_map_query->get_props_maps_by_mapping_id( 1 );

	expect( $prop_maps )->toBeArray();
} );

test( '\LCDR\DB\Query\PropsMaps->update_prop_map()', function () {
	global $prop_map_id;
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_map = $prop_map_query->update_prop_map(
		$prop_map_id,
		array(
			'mapping_id' => 4,
			'prop_name' => 'part',
		)
	);

	expect( $prop_map )->toBeInt();
} );

test( '\LCDR\DB\Query\PropsMaps->update_prop_map() return false with wrong id', function () {
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_map = $prop_map_query->update_prop_map(
		0,
		array(
			'mapping_id' => 9999,
			'prop_name' => 'part',
		)
	);

	expect( $prop_map )->toBeFalse();
} );

test( '\LCDR\DB\Query\PropsMaps->update_prop_map() return false', function () {

	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_map = $prop_map_query->update_prop_map(
		0,
		array(
			'name' => 'mapeamento-atualizado',
			'title' => 'mapeamento atualizado',
			'description' => 'Mapeamento atualizado',
			'version' => '1.0.0',
		)
	);

	expect( $prop_map )->toBeFalse();
} );

test( '\LCDR\DB\Query\PropsMaps->delete_prop_map()', function () {
	global $prop_map_id;
	$prop_map_query = new \LCDR\DB\Query\PropsMaps();

	$prop_map = $prop_map_query->delete_prop_map( $prop_map_id );

	expect( $prop_map )->toBeInt();
} );