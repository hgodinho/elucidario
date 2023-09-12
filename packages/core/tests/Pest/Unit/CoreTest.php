<?php

namespace LCDR\Tests\Pest\Unit;

beforeAll( function () {
	global $core;
	$core = \LCDR\Core::get_instance();
} );

afterAll( function () {
	global $core;
	unset( $core );
} );

test( '\LCDR\Core::get_instance()', function () {
	$instance = \LCDR\Core::get_instance();
	expect( $instance )->toBeInstanceOf( '\LCDR\Core' );
	expect( $instance )->toBe( \LCDR\Core::get_instance() );
} );

test( '\LCDR\Core()', function () {
	global $core;
	expect( $core )->toBeInstanceOf( '\LCDR\Core' );
} );

test( '\LCDR\Core->mdorim', function () {
	global $core;
	expect( $core->mdorim )->toBeInstanceOf( \MDorim\Core::class);
} );

test( '\LCDR\Core->rest', function () {
	global $core;
	expect( $core->rest )->toBeInstanceOf( \LCDR\Rest\Core::class);
} );