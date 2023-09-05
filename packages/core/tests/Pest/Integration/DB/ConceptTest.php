<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$concept_id = false;
$concept_ids = false;
$random = substr( md5( rand() ), 0, 7 );

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
	$concept = new \LCDR\DB\Query\Concepts();
	$all = $concept->get_entities();
	foreach ( $all as $item ) {
		$concept->delete_entity( $item->entity_id );
	}

	$relationships = new \LCDR\DB\Query\Relationships();
	$all = $relationships->get_relationships();
	foreach ( $all as $item ) {
		$relationships->delete_relationship( $item->rel_id );
	}
} );

test( '\LCDR\DB\Query\Concepts class', function () {
	$query = new \LCDR\DB\Query\Concepts();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Concepts::class);
} );

test( '\LCDR\DB\Query\Concepts->add_entities()', function () {
	$concept_query = new \LCDR\DB\Query\Concepts();

	global $concept_ids;
	$concept_ids = $concept_query->add_entities(
		array(
			array(
				'type' => 'Type',
				'name' => 'Teste',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Teste',
					),
				),
			),
			array(
				'type' => 'Type',
				'name' => 'Banana',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Banana',
					),
				),
			),
			array(
				'type' => 'Type',
				'name' => 'Pera',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Pera',
					),
				),
			),
			array(
				'type' => 'Type',
				'name' => 'Uva',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Uva',
					),
				),
			),
		)
	);

	expect( $concept_ids )->toBeArray();
} );

test( '\LCDR\DB\Query\Concepts->add_entity()', function () {
	global $concept_ids;
	global $concept_id;

	$concept = new \LCDR\DB\Query\Concepts();

	$concept_id = $concept->add_entity(
		array(
			'type' => 'Type',
			'name' => 'relation-test',
			'author' => 1,
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 2',
				),
			),
			'classified_as' => $concept_ids
		)
	);

	expect( $concept_id )->toBeNumeric();
} );

test( '\LCDR\DB\Query\Concepts->add_entity() with referred_to_by', function () {
	global $concept_ids;
	global $concept_id;

	$concept = new \LCDR\DB\Query\Concepts();
	$concept_to_add = array(
		'type' => 'Type',
		'name' => 'referred_to_by-test',
		'author' => 1,
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 4',
			),
		),
		'classified_as' => $concept_ids,
		'referred_to_by' => array(
			(object) array(
				'type' => 'LinguisticObject',
				'label' => 'Teste 4',
				'content' => 'Teste 4',
				'language' => array(
					(object) array(
						'id' => 1,
						'type' => 'Language',
						'label' => 'Português',
					),
				)
			),
			3,
		),
	);

	$concept_id = $concept->add_entity( $concept_to_add );

	$saved = $concept->get_entity( $concept_id );
	$referred_to_by = $saved->get_property( 'referred_to_by' );

	expect( $concept_id )->toBeNumeric();
	expect( $referred_to_by )->toBeArray()->toMatchArray(
		array(
			(object) array(
				'type' => 'LinguisticObject',
				'label' => 'Teste 4',
				'content' => 'Teste 4',
				'language' => array(
					(object) array(
						'id' => 1,
						'type' => 'Language',
						'label' => 'Português',
					),
				)
			),
			3,
		)
	);
} );


test( '\LCDR\DB\Query\Concepts->add_entity() no type', function () {

	expect(
		function () {
			$concept_query = new \LCDR\DB\Query\Concepts();
			$concept_query->add_entity(
				array(
					'name' => 'relation-test',
					'author' => 1,
					'identified_by' => array(
						(object) array(
							'type' => 'Identifier',
							'content' => 'Teste 2',
						),
					),
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a type.' );
} );

test( '\LCDR\DB\Query\Concepts->add_entity() no name', function () {

	expect(
		function () {
			$concept_query = new \LCDR\DB\Query\Concepts();
			$concept_query->add_entity(
				array(
					'type' => 'Type',
					'author' => 1,
					'identified_by' => array(
						(object) array(
							'type' => 'Identifier',
							'content' => 'Teste 2',
						),
					),
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a name.' );
} );

test( '\LCDR\DB\Query\Concepts->get_entity() must return valid relationships', function () {
	global $concept_id;

	$concept = new \LCDR\DB\Query\Concepts();

	$test = $concept->get_entity( $concept_id );
	$classified_as = $test->get_property( 'classified_as' );
	expect( $classified_as )->toBeArray();
} );

test( '\LCDR\DB\Query\Concepts->get_entities()', function () {
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_entities();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\Concepts->get_entity()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_entity( $concept_id );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
} );

test( '\LCDR\DB\Query\Concepts->update_entity()', function () {
	global $concept_id;
	global $concept_ids;

	$classified_as = $concept_ids;
	unset( $classified_as[1] );
	unset( $classified_as[3] );
	$classified_as[] = 1;
	$classified_as = array_values( (array) $classified_as );

	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->update_entity( $concept_id, array(
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 3',
			),
		),
		'classified_as' => $classified_as,
	) );

	$updated = $concepts->get_entity( $concept_id );

	expect( $test )->toBeNumeric();
	expect( $updated->get_property( 'classified_as' ) )->toMatchArray( $classified_as );
} );

test( '\LCDR\DB\Query\Concepts->update_entity() wrong id throws exception', function () {
	expect( function () {
		$concepts = new \LCDR\DB\Query\Concepts();
		$test = $concepts->update_entity(
			0,
			array(
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Teste 3',
					),
				),
			)
		);
	} )->toThrow( \Exception::class, 'Entity not found.' );
} );

test( '\LCDR\DB\Row\Concept->get_property()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_item( $concept_id );
	expect( $test->get_property( 'identified_by' ) )->toMatchArray(
		array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 3',
			),
		)
	);
} );

test( '\LCDR\DB\Query\Concepts->delete_item()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->delete_entity( $concept_id );
	expect( $test )->toBeNumeric();
} );