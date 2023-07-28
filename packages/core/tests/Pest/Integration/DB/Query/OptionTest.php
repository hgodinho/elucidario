<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$item_id = false;
$random = substr( md5( rand() ), 0, 7 );

beforeAll( function () use (&$db) {
	$db = new \LCDR\DB\Core();
	$options = new \LCDR\DB\Query\Options();
	$all = $options->get_options();
	foreach ( $all as $item ) {
		$options->delete_item( $item->id );
	}
} );

afterAll( function () use (&$db) {
	$db->uninstall_tables();
} );

test( '\LCDR\DB\Query\Options class', function () {
	$query = new \LCDR\DB\Query\Options();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Options::class);
} );

test( '\LCDR\DB\Query\Options->add_item()', function () {
	global $item_id;
	$options = new \LCDR\DB\Query\Options();
	$item_id = $options->add_item( array(
		'name' => 'test',
		'value' => 'test',
	) );

	expect( $item_id )->toBeNumeric();
} );

test( '\LCDR\DB\Query\Options->get_options()', function () {
	$options = new \LCDR\DB\Query\Options();
	$test = $options->get_options();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\Options->get_item()', function () {
	global $item_id;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->get_item( $item_id );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\Options::class);
	expect( $test->name )->toBe( 'test' );
	expect( $test->value )->toBe( 'test' );
} );

test( '\LCDR\DB\Query\Options->update_item()', function () {
	global $item_id;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->update_item( $item_id, array(
		'name' => 'test',
		'value' => 'test_2',
	) );

	expect( $test )->toBeNumeric();
} );

test( 'LCDR\DB\Query\Options->update_option()', function () {
	global $random;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->update_option( 'test', $random );

	expect( $test )->toBeTrue();
} );

test( '\LCDR\DB\Query\Options->get_option()', function () {
	global $random;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->get_option( 'test' );

	expect( $test )->toEqual( $random );
} );

test( '\LCDR\DB\Query\Options->delete_item()', function () {
	global $item_id;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->delete_item( $item_id );

	expect( $test )->toBeNumeric();
} );