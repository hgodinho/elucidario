<?php

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( TestCase::class);

beforeEach( function () {
	parent::setUp();
} );

afterEach( function () {
	parent::tearDown();
} );

test( 'verifica se funções foram corretamente carregadas', function () {
	$this->assertNotFalse( function_exists( 'lcdr_activate_plugin_hook' ) );

	$this->assertNotFalse( function_exists( 'lcdr_deactivate_plugin_hook' ) );

	$this->assertNotFalse( function_exists( 'lcdr_uninstall_plugin_hook' ) );
} );

test( 'lcdr_camel_to_snake', function () {
	$this->assertEquals( 'test_test', lcdr_camel_to_snake( 'testTest' ) );
} );

test( 'lcdr_snake_to_camel', function () {
	$this->assertEquals( 'testTest', lcdr_snake_to_camel( 'test_test' ) );
} );

test( 'lcdr_set_option', function () {
	global $random;
	$this->assertEquals( lcdr_set_option( 'test2', $random ), 1 );
} );

test( 'lcdr_get_option', function () {
	global $random;
	$this->assertEquals( lcdr_get_option( 'test2' ), $random );
} );

test( 'lcdr_json_file', function () {
	expect( lcdr_json_file( LCDR_PATH . 'node_modules/@elucidario/pkg-mdorim/static/mdorim/schemas/mdorim/core.json' ) )->toBeArray();
} );

test( 'lcdr_get_json_properties', function () {
	expect( lcdr_get_json_properties() )->toBe(
		array(
			'identified_by',
			'referred_to_by',
			'equivalent',
			'attributed_by',
			'dimension',
			'digitally_available_via',
			'created_by',
			'contact_point',
			'formed_by',
			'dissolved_by',
			'born',
			'died',
			'timespan',
			'part',
			'produced_by',
			'destroyed_by',
			'removed_by',
		)
	);
} );