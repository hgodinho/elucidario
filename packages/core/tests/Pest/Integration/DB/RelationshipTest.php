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
	$relationship = new \LCDR\DB\Query\Relationships();
	$all = $relationship->get_relationships();
	foreach ( $all as $item ) {
		$relationship->delete_item( $item->entity_id );
	}
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

test( '\LCDR\DB\Query\Relationships->get_relationships()', function () {
	$relationships = new \LCDR\DB\Query\Relationships();
	$test = $relationships->get_relationships();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\Relationships->get_item()', function () {
	global $relationship_id;
	$relationships = new \LCDR\DB\Query\Relationships();
	$test = $relationships->get_item( $relationship_id );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\Relationship::class);
} );

// test( '\LCDR\DB\Query\Relationships->update_item()', function () {
// 	global $relationship_id;
// 	$relationships = new \LCDR\DB\Query\Relationships();
// 	$test = $relationships->update_item( $relationship_id, array(
// 		'name' => 'test',
// 		'value' => 'test_2',
// 	) );

// 	expect( $test )->toBeNumeric();
// } );

// test( 'LCDR\DB\Query\Relationships->update_option()', function () {
// 	global $random;
// 	$relationships = new \LCDR\DB\Query\Relationships();
// 	$test = $relationships->update_option( 'test', $random );

// 	expect( $test )->toBeTrue();
// } );

// test( '\LCDR\DB\Query\Relationships->get_option()', function () {
// 	global $random;
// 	$relationships = new \LCDR\DB\Query\Relationships();
// 	$test = $relationships->get_option( 'test' );

// 	expect( $test )->toEqual( $random );
// } );

// test( '\LCDR\DB\Query\Relationships->delete_item()', function () {
// 	global $relationship_id;
// 	$relationships = new \LCDR\DB\Query\Relationships();
// 	$test = $relationships->delete_item( $relationship_id );

// 	expect( $test )->toBeNumeric();
// } );