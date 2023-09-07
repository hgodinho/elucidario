<?php

beforeAll( function () {
	global $core;
	$core = \Mdorim\Core::get_instance();
} );

afterAll( function () {
	global $core;
	unset( $core );
} );

test( '\Mdorim\Core() instance', function () {
	global $core;
	expect( $core )->toBeInstanceOf( \Mdorim\Core::class);
} );

test( 'MDORIM constant', function () {
	expect( MDORIM_PATH )->toBeString();
	expect( MDORIM_PATH )->toEndWith( 'mdorim' );
} );