<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$random = substr( md5( rand() ), 0, 7 );
$procedure_id = 0;

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );


test( '\LCDR\DB\Query\Procedures class', function () {
	$query = new \LCDR\DB\Query\Procedures();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Procedures::class);
} );


test( '\LCDR\DB\Query\Procedures->add_procedure()', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	global $procedure_id;

	$procedure_id = $procedure_query->add_procedure(
		array(
			'type' => 'ObjectEntry',
			'description' => 'Test Procedure',
			'author' => 1,
			'status' => 'draft',
			'entities' => array(
				1, 2, 3
			)
		)
	);

	expect( $procedure_id )->toBeInt();
} );

test( '\LCDR\DB\Query\Procedures->add_procedure() without type throws exception', function () {
	expect( function () {
		$procedure_query = new \LCDR\DB\Query\Procedures();
		$procedure_id = $procedure_query->add_procedure(
			array(
				'description' => 'Test Procedure',
				'author' => 1,
				'status' => 'draft',
				'entities' => array(
					1, 2, 3
				)
			)
		);
	} )->toThrow( \Exception::class, 'The data must have a type.' );
} );

test( '\LCDR\DB\Query\Procedures->add_procedures()', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	$procedures = $procedure_query->add_procedures(
		array(
			array(
				'type' => 'ObjectEntry',
				'description' => 'Test Procedure',
				'author' => 1,
				'status' => 'draft',
				'entities' => array(
					1, 2, 3
				)
			),
			array(
				'type' => 'ObjectEntry',
				'description' => 'Test Procedure',
				'author' => 1,
				'status' => 'draft',
				'entities' => array(
					1, 2, 3
				)
			),
			array(
				'type' => 'ObjectEntry',
				'description' => 'Test Procedure',
				'author' => 1,
				'status' => 'draft',
				'entities' => array(
					1, 2, 3
				)
			),
		)
	);

	expect( $procedures )->toBeArray();
} );


test( '\LCDR\DB\Query\Procedures->update_procedure()', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	global $procedure_id;

	$procedure = $procedure_query->update_procedure(
		$procedure_id,
		array(
			'type' => 'ObjectExit',
		)
	);

	expect( $procedure )->toBeInt();
} );

test( '\LCDR\DB\Query\Procedures->update_procedure() wrong ID', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	global $procedure_id;

	$procedure = $procedure_query->update_procedure(
		0,
		array(
			'type' => 'ObjectExit',
		)
	);

	expect( $procedure )->toBeFalsy();
} );

test( '\LCDR\DB\Query\Procedures->get_procedure()', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	global $procedure_id;

	$procedure = $procedure_query->get_procedure( $procedure_id );

	expect( $procedure )->toBeInstanceOf( \LCDR\DB\Row\Procedure::class);
	expect( $procedure->procedure_id )->toBeInt();
	expect( $procedure->type )->toBeString();
	expect( $procedure->description )->toBeString();
	expect( $procedure->guid )->toBeString();
	expect( $procedure->author )->toBeInt();
	expect( $procedure->status )->toBeString();
	expect( $procedure->entities )->toBeArray();
} );

test( '\LCDR\DB\Query\Procedures->get_procedures()', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	$procedures = $procedure_query->get_procedures();

	expect( $procedures )->toBeArray();
} );

test( '\LCDR\DB\Query\Procedures->delete_procedure()', function () {
	$procedure_query = new \LCDR\DB\Query\Procedures();

	global $procedure_id;

	$procedure = $procedure_query->delete_procedure( $procedure_id );

	expect( $procedure )->toBeTruthy();
} );