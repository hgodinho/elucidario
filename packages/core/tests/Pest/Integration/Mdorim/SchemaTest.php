<?php

namespace LCDR\Tests\Pest\Integration\Mdorim\Entities;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( TestCase::class);

test( '\LCDR\Mdorim\Schema', function () {
	$schema = new \LCDR\Mdorim\Schema( 'concept', null );
	expect( $schema )->toBeInstanceOf( \LCDR\Mdorim\Schema::class);
} );

test( '\LCDR\Mdorim\Schema->type', function () {
	$schema = new \LCDR\Mdorim\Schema( 'concept', null );
	expect( $schema->type )->toBe( 'concept' );
} );

test( '\LCDR\Mdorim\Schema->set_schema', function () {
	$schema = new \LCDR\Mdorim\Schema( 'concept', null );
	$schema->set_schema();
	$default = json_decode( file_get_contents( LCDR_PATH . 'node_modules/@elucidario/pkg-mdorim/static/mdorim/schemas/mdorim/concept.json' ) );
	expect( $schema->get_schema() )->toEqual( $default );
} );

test( '\LCDR\Mdorim\Schema->set_schema no schema type', function () {
	expect( function () {
		$schema = new \LCDR\Mdorim\Schema( 'banana', null );
		return $schema->set_schema();
	} )->toThrow( \Exception::class, 'Schema not found.' );
} );