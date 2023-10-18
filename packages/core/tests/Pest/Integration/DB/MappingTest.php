<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$random = substr( md5( rand() ), 0, 7 );
$mapping_id = 0;

beforeAll( function () {
	global $db;
	$db = new \LCDR\DB\Core();
} );

afterAll( function () {
	global $db;
	$db->uninstall_tables();
} );


test( '\LCDR\DB\Query\Mappings class', function () {
	$query = new \LCDR\DB\Query\Mappings();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Mappings::class);
} );

test( '\LCDR\DB\Query\Mappings->add_mapping()', function () {
	$mapping_query = new \LCDR\DB\Query\Mappings();

	global $mapping_id;

	\wp_set_current_user( 1 );
	$mapping_id = $mapping_query->add_mapping(
		array(
			'title' => 'Teste de mapeamento',
			'standard' => 'Spectrum',
			'uri' => 'https://elucidario.art/mdorim/concept/1',
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
			'title' => 'Teste de mapeamento',
			'standard' => 'Spectrum',
			'description' => 'Teste de mapeamento',
			'version' => '1.0.0',
            'mapping' => array(
				array(
					'description' => 'mapeamento-test',
					'prop_name' => 'identified_by',

					'entity_type' => 'Type',
					'external_prop_name' => 'name',
					'external_prop_type' => 'string',
					'external_prop_description' => 'Description',
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
				)
			),
		)
	);
	expect( $mapping_id )->toBeInt();
} );

test( '\LCDR\DB\Query\Mappings->add_mapping() no title', function () {
	expect(
		function () {
			$map_query = new \LCDR\DB\Query\Mappings();
			$map_query->add_mapping(
				array(
					'description' => 'Teste de mapeamento',
					'version' => '1.0.0',
					'standard' => (object) array(
						'name' => 'teste-de-mapeamento',
						'uri' => 'Teste de mapeamento',
						'description' => 'Teste de mapeamento',
					),
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a title.' );
} );

test( '\LCDR\DB\Query\Mappings->add_mapping() no standard', function () {
	expect(
		function () {
			$map_query = new \LCDR\DB\Query\Mappings();
			$map_query->add_mapping(
				array(
					'title' => 'Teste de mapeamento',
					'description' => 'Teste de mapeamento',
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a standard.' );
} );

test( '\LCDR\DB\Query\Mappings->get_mapping()', function () {
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
				'title' => 'Teste de mapeamento',
				'description' => 'Teste de mapeamento',
				'version' => '1.0.0',
				'standard' => 'Spectrum',
			),
			array(
				'title' => 'Teste de mapeamento',
				'description' => 'Teste de mapeamento',
				'version' => '1.0.0',
				'standard' => 'Spectrum',
			),
			array(
				'title' => 'Teste de mapeamento',
				'description' => 'Teste de mapeamento',
				'version' => '1.0.0',
				'standard' => 'Spectrum',
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