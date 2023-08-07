<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$concept_id = false;
$random = substr( md5( rand() ), 0, 7 );

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
	$concept = new \LCDR\DB\Query\Concepts();
	$all = $concept->get_entities();
	foreach ( $all as $item ) {
		$concept->delete_entity( $item->entity_id );
	}
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );

test( '\LCDR\DB\Query\Concepts class', function () {
	$query = new \LCDR\DB\Query\Concepts();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Concepts::class);
} );

test( '\LCDR\DB\Query\Concepts->add_entity()', function () {
	global $concept_id;
	$concept = new \LCDR\DB\Query\Concepts();

	$concept_id = $concept->add_entity(
		array(
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste',
				),
			),
		)
	);

	expect( $concept_id )->toBeNumeric();
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

test( '\LCDR\DB\Query\Concepts->update_item()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->update_entity( $concept_id, array(
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 2',
			),
		),
	) );

	expect( $test )->toBeNumeric();
} );

test( '\LCDR\DB\Row\Concept->get_property()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_item( $concept_id );
	expect( $test->get_property( 'identified_by' ) )->toMatchArray(
		array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 2',
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