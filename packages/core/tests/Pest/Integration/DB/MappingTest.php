<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$random = substr( md5( rand() ), 0, 7 );
$mapping_id = 0;

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );


test( '\LCDR\DB\Query\Mappings class', function () {
	$query = new \LCDR\DB\Query\Mappings();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Mappings::class);
} );


test( '\LCDR\DB\Query\Mappings->add_mapping()', function () {
	$mapping_query = new \LCDR\DB\Query\Mappings();

	global $mapping_id;

	$mapping_id = $mapping_query->add_mapping(
		array(
			'name' => 'teste-de-mapeamento',
			'title' => 'Teste de mapeamento',
			'description' => 'Teste de mapeamento',
			'version' => '1.0.0',
		)
	);

	expect( $mapping_id )->toBeInt();
} );

test( '\LCDR\DB\Query\Mappings->add_mapping() and props_maps', function () {
	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mapping_id = $mapping_query->add_mapping(
		array(
			'name' => 'teste-de-mapeamento',
			'title' => 'Teste de mapeamento',
			'description' => 'Teste de mapeamento',
			'version' => '1.0.0',
		)
	);
	expect( $mapping_id )->toBeInt();

	$props_maps_query = new \LCDR\DB\Query\PropsMaps();
	$props_maps_query->add_props_maps( array(
		array(
			'mapping_id' => $mapping_id,
			'entity_type' => 'Concept',
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
		),
		array(
			'mapping_id' => $mapping_id,
			'entity_type' => 'Concept',
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
	) );
	$props_maps = $mapping_query->get_mapping( $mapping_id );
	expect( $props_maps->mappings )->toBeArray();
} );


test( '\LCDR\DB\Query\Mappings->add_mapping() no name', function () {
	expect(
		function () {
			$map_query = new \LCDR\DB\Query\Mappings();
			$map_query->add_mapping(
				array(
					'title' => 'Teste de mapeamento',
					'description' => 'Teste de mapeamento',
					'version' => '1.0.0',
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a name.' );
} );

test( '\LCDR\DB\Query\Mappings->add_mapping() no title', function () {
	expect(
		function () {
			$map_query = new \LCDR\DB\Query\Mappings();
			$map_query->add_mapping(
				array(
					'name' => 'teste-de-mapeamento',
					'description' => 'Teste de mapeamento',
					'version' => '1.0.0',
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a title.' );
} );

test( '\LCDR\DB\Query\Mappings->get_procedure()', function () {
	$mapping_query = new \LCDR\DB\Query\Mappings();

	global $mapping_id;

	$mapping = $mapping_query->get_mapping( $mapping_id );

	expect( $mapping )->toBeInstanceOf( \LCDR\DB\Row\Mapping::class);
	expect( $mapping->mapping_id )->toBeInt();
	expect( $mapping->name )->toBeString();
	expect( $mapping->description )->toBeString();
	expect( $mapping->author )->toBeInt();
	expect( $mapping->title )->toBeString();
	expect( $mapping->version )->toBeString();
	expect( $mapping->created )->toBeString();
	expect( $mapping->modified )->toBeString();
} );

test( '\LCDR\DB\Query\Mappings->add_mappings()', function () {
	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mappings = $mapping_query->add_mappings(
		array(
			array(
				'name' => 'teste-de-mapeamento',
				'title' => 'Teste de mapeamento',
				'description' => 'Teste de mapeamento',
				'version' => '1.0.0',
			),
			array(
				'name' => 'teste-de-mapeamento',
				'title' => 'Teste de mapeamento',
				'description' => 'Teste de mapeamento',
				'version' => '1.0.0',
			),
			array(
				'name' => 'teste-de-mapeamento',
				'title' => 'Teste de mapeamento',
				'description' => 'Teste de mapeamento',
				'version' => '1.0.0',
			),
		)
	);

	expect( $mappings )->toBeArray();
} );

test( '\LCDR\DB\Query\Mappings->get_mappings()', function () {
	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mappings = $mapping_query->get_mappings();

	expect( $mappings )->toBeArray();
} );

test( '\LCDR\DB\Query\Mappings->update_mapping()', function () {
	global $mapping_id;
	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mapping = $mapping_query->update_mapping(
		$mapping_id,
		array(
			'name' => 'mapeamento-atualizado',
			'title' => 'mapeamento atualizado',
			'description' => 'Mapeamento atualizado',
			'version' => '1.0.0',
		)
	);

	expect( $mapping )->toBeInt();
} );

test( '\LCDR\DB\Query\Mappings->update_mapping() return false', function () {

	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mapping = $mapping_query->update_mapping(
		0,
		array(
			'name' => 'mapeamento-atualizado',
			'title' => 'mapeamento atualizado',
			'description' => 'Mapeamento atualizado',
			'version' => '1.0.0',
		)
	);

	expect( $mapping )->toBeFalse();
} );

test( '\LCDR\DB\Query\Mappings->update_mapping() return false wrong ID', function () {

	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mapping = $mapping_query->update_mapping(
		999,
		array(
			'name' => 'mapeamento-atualizado',
			'title' => 'mapeamento atualizado',
			'description' => 'Mapeamento atualizado',
			'version' => '1.0.0',
		)
	);

	expect( $mapping )->toBeFalse();
} );

test( '\LCDR\DB\Query\Mappings->delete_mapping()', function () {
	global $mapping_id;
	$mapping_query = new \LCDR\DB\Query\Mappings();

	$mapping = $mapping_query->delete_mapping( $mapping_id );

	expect( $mapping )->toBeInt();
} );