<?php

namespace LCDR\Tests\Integration\DB;

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

test( '\LCDR\DB\Query\Options->get_options()', function () {
	$options = new \LCDR\DB\Query\Options();
	$test = $options->get_options();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\Options->update_option() with unknown name insert a new option', function () {
	global $random;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->update_option( 'test', $random );

	expect( $test )->toBeTrue();
} );

test( '\LCDR\DB\Query\Options->update_option() with equal value returns false', function () {
	global $random;
	$options = new \LCDR\DB\Query\Options();
	$test = $options->update_option( 'test', $random );
	expect( $test )->toBeFalse();
} );

test( '\LCDR\DB\Query\Options->update_option() with known name update the option', function () {
	$options = new \LCDR\DB\Query\Options();
	$test = $options->update_option( 'test', 'banana' );

	expect( $test )->toBeTruthy();
} );

test( '\LCDR\DB\Query\Options->get_option()', function () {
	$options = new \LCDR\DB\Query\Options();
	$test = $options->get_option( 'test' );

	expect( $test )->toEqual( 'banana' );
} );

test( '\LCDR\DB\Query\Options->delete_option() with known option', function () {
	$options = new \LCDR\DB\Query\Options();
	$test = $options->delete_option( 'test' );

	expect( $test )->toBeTruthy();
} );

test( '\LCDR\DB\Query\Options->delete_option() with unknown option', function () {
	$options = new \LCDR\DB\Query\Options();
	$test = $options->delete_option( 'test' );

	expect( $test )->toBeFalse();
} );