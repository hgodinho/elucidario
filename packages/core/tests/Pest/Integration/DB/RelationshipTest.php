<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$relationship_id = false;
$random = substr( md5( rand() ), 0, 7 );

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );

test( '\LCDR\DB\Query\Relationships class', function () {
	$query = new \LCDR\DB\Query\Relationships();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Relationships::class);
} );

test( '\LCDR\DB\Query\Relationships->add_relationship()', function () {
	global $relationship_id;
	$relationship = new \LCDR\DB\Query\Relationships();

	$relationship_id = $relationship->add_relationship( array(
		'object' => 1,
		'predicate' => 'referred_to_by',
		'subject' => 2,
		'order' => 0
	) );

	expect( $relationship_id )->toBeNumeric();
} );

test( '\LCDR\DB\Query\Relationships->add_relationship() with wrong predicate throws exception', function () {
	expect( function () {
		$relationship = new \LCDR\DB\Query\Relationships();
		$relationship->add_relationship(
			array(
				'object' => 1,
				'predicate' => 'banana',
				'subject' => 2,
				'order' => 0
			)
		);
	} )->toThrow( \Exception::class, 'banana is not a valid relationship name.' );
} );

test( '\LCDR\DB\Query\Relationships->add_relationships()', function () {
	$relationship = new \LCDR\DB\Query\Relationships();

	$relationships = $relationship->add_relationships(
		array(
			array(
				'object' => 1,
				'predicate' => 'classified_as',
				'subject' => 2,
				'order' => 0
			),
			array(
				'object' => 2,
				'predicate' => 'carried_out_by',
				'subject' => 1,
				'order' => 0
			),
			array(
				'object' => 1,
				'predicate' => 'residence',
				'subject' => 2,
				'order' => 0
			),
			array(
				'object' => 2,
				'predicate' => 'current_custodian',
				'subject' => 1,
				'order' => 0
			),
		),
	);

	expect( $relationships )->toBeArray();
} );

test( '\LCDR\DB\Query\Relationships->get_relationship()', function () {
	global $relationship_id;
	$relationships = new \LCDR\DB\Query\Relationships();

	$test = $relationships->get_relationship( $relationship_id );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\Relationship::class);
} );

test( '\LCDR\DB\Query\Relationships->get_relationships()', function () {
	$relationships = new \LCDR\DB\Query\Relationships();
	$test = $relationships->get_relationships();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\Relationships->update_relationship()', function () {
	global $relationship_id;
	$relationships = new \LCDR\DB\Query\Relationships();
	$test = $relationships->update_relationship(
		$relationship_id,
		array(
			'predicate' => 'classified_as',
		)
	);

	expect( $test )->toBeNumeric();
} );

test( '\LCDR\DB\Query\Relationships->update_relationship() with no ID throws exception', function () {
	expect( function () {
		$relationships = new \LCDR\DB\Query\Relationships();
		$test = $relationships->update_relationship(
			0,
			array(
				'predicate' => 'classified_as',
			)
		);
	} )->toThrow( \Exception::class, 'Relationship ID is required.' );
} );

test( '\LCDR\DB\Query\Relationships->update_relationships()', function () {
	$query = new \LCDR\DB\Query\Relationships();

	$relationships = $query->get_relationships();

	$relationships = array_map( function ($item) {
		return array(
			'rel_id' => $item->rel_id,
			'predicate' => 'classified_as',
		);
	}, $relationships );

	$updated = $query->update_relationships( $relationships );

	expect( $updated )->toBeArray();
} );

test( '\LCDR\DB\Query\Relationships->delete_relationship()', function () {
	global $relationship_id;
	$relationships = new \LCDR\DB\Query\Relationships();
	$test = $relationships->delete_relationship( $relationship_id );

	expect( $test )->toBeNumeric();
} );

test( '\LCDR\DB\Query\Relationships->delete_relationships()', function () {
	$relationships = new \LCDR\DB\Query\Relationships();

	$to_delete = array_map( function ($rel) {
		return $rel->rel_id;
	}, $relationships->get_relationships() );

	$test = $relationships->delete_relationships( $to_delete );

	expect( $test )->toBeArray();
} );