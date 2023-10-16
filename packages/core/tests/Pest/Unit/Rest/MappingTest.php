<?php

namespace LCDR\Tests\Pest\Unit\Rest;

use Yoast\WPTestUtils\WPIntegration\TestCase;

uses( Testcase::class);

beforeAll( function () {
	global $wp_rest_server;
	$wp_rest_server = new \Spy_REST_Server();
	do_action( 'rest_api_init' );
} );

afterAll( function () {
	global $wp_rest_server;
	$wp_rest_server = null;
} );

test( 'register_routes', function () {
	global $wp_rest_server;
	$routes = $wp_rest_server->get_routes();
	expect( $routes )->toHaveKey( '/lcdr/v1' );
	expect( $routes )->toHaveKey( '/lcdr/v1/mappings' );
	expect( $routes )->toHaveKey( '/lcdr/v1/mappings/(?P<id>[\\d]+)' );
} );

test( 'LCDR\Rest\Routes\Mapping must have base', function () {
	$mapping = new \LCDR\Rest\Routes\Mapping();
	expect( $mapping->set_base() )->toBe( 'mappings' );
} );

test( 'LCDR\Rest\Routes\Mapping must have method set_schema', function () {
	$mapping = new \LCDR\Rest\Routes\Mapping();
	expect( $mapping->set_schema() )->toBe( [] );
} );

test( 'LCDR\Rest\Routes\Mapping must have permission_group', function () {
	$mapping = new \LCDR\Rest\Routes\Mapping();
	expect( $mapping->set_permission_group() )->toBe( 'mapping' );
} );