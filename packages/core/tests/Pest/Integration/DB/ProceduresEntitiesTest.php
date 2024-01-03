<?php

namespace LCDR\Tests\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$proc_entity_id = false;
$random = substr( md5( rand() ), 0, 7 );

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );

test( '\LCDR\DB\Query\ProceduresEntities class', function () {
	$query = new \LCDR\DB\Query\ProceduresEntities();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\ProceduresEntities::class);
} );

test( '\LCDR\DB\Query\ProceduresEntities->add_relationship()', function () {
	global $proc_entity_id;
	$proc_entity = new \LCDR\DB\Query\ProceduresEntities();

	$proc_entity_id = $proc_entity->add_relationship( array(
		'entity_id' => 1,
		'procedure_id' => 2,
		'order' => 0
	) );

	expect( $proc_entity_id )->toBeNumeric();
} );

test( '\LCDR\DB\Query\ProceduresEntities->add_relationships()', function () {
	$procedure_entity = new \LCDR\DB\Query\ProceduresEntities();

	$procedures_entities = $procedure_entity->add_relationships(
		array(
			array(
				'entity_id' => 3,
				'procedure_id' => 4,
				'order' => 0
			),
			array(
				'entity_id' => 3,
				'procedure_id' => 4,
				'order' => 1
			),
			array(
				'entity_id' => 3,
				'procedure_id' => 4,
				'order' => 2
			),
		),
	);

	expect( $procedures_entities )->toBeArray();
} );

test( '\LCDR\DB\Query\ProceduresEntities->get_relationship()', function () {
	global $proc_entity_id;
	$relationships = new \LCDR\DB\Query\ProceduresEntities();

	$test = $relationships->get_relationship( $proc_entity_id );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\ProcedureEntity::class);
} );

test( '\LCDR\DB\Query\ProceduresEntities->get_relationships()', function () {
	$relationships = new \LCDR\DB\Query\ProceduresEntities();
	$test = $relationships->get_relationships();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\ProceduresEntities->update_relationship()', function () {
	global $proc_entity_id;
	$relationships = new \LCDR\DB\Query\ProceduresEntities();
	$test = $relationships->update_relationship(
		$proc_entity_id,
		array(
			'entity_id' => 4,
		)
	);
	expect( $test )->toBeNumeric();
} );

test( '\LCDR\DB\Query\ProceduresEntities->update_relationship() without ID throws exception', function () {

	expect( function () {
		$relationships = new \LCDR\DB\Query\ProceduresEntities();
		$test = $relationships->update_relationship(
			0,
			array(
				'entity_id' => 4,
			)
		);
	} )->toThrow( \Exception::class, 'Relationship ID is required.' );
} );


test( '\LCDR\DB\Query\ProceduresEntities->update_relationships()', function () {
	$query = new \LCDR\DB\Query\ProceduresEntities();

	$relationships = $query->get_relationships();

	$relationships = array_map( function ($item) {
		return array(
			'rel_id' => $item->rel_id,
			'entity_id' => 5,
		);
	}, $relationships );

	$updated = $query->update_relationships( $relationships );

	expect( $updated )->toBeArray();
} );

test( '\LCDR\DB\Query\ProceduresEntities->delete_relationship()', function () {
	global $proc_entity_id;
	$relationships = new \LCDR\DB\Query\ProceduresEntities();
	$test = $relationships->delete_relationship( $proc_entity_id );

	expect( $test )->toBeNumeric();
} );

test( '\LCDR\DB\Query\ProceduresEntities->delete_relationships()', function () {
	$relationships = new \LCDR\DB\Query\ProceduresEntities();

	$to_delete = array_map( function ($rel) {
		return $rel->rel_id;
	}, $relationships->get_relationships() );

	$test = $relationships->delete_relationships( $to_delete );

	expect( $test )->toBeArray();
} );