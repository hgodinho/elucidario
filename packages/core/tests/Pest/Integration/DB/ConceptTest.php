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
} );

test( '\LCDR\DB\Query\Concepts class', function () {
	$query = new \LCDR\DB\Query\Concepts();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Concepts::class);
} );

test( '\LCDR\DB\Query\Concepts->add_entities()', function () {
	$concept = new \LCDR\DB\Query\Concepts();

	global $concept_ids;
	$concept_ids = $concept->add_entities(
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
	global $concept_id;
	global $concept_ids;

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

test( '\LCDR\DB\Query\Concepts->get_entity() must return valid relationships', function () {
	global $concept_id;
	global $concept_ids;

	$concept = new \LCDR\DB\Query\Concepts();

	$test = $concept->get_entity( $concept_id );
	$classified_as = $test->get_property( 'classified_as' );

	expect( $classified_as )->toMatchArray(
		$concept_ids
	);
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

	// var_dump( $test );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
} );

test( '\LCDR\DB\Query\Concepts->update_item()', function () {
	global $concept_id;
	global $concept_ids;

	$classified_as = $concept_ids;
	unset( $classified_as[1] );
	unset( $classified_as[3] );
	$classified_as = array_values( (array) $classified_as );
	$classified_as[] = 1;

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