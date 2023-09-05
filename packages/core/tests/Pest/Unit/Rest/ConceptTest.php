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
	expect( $routes )->toHaveKey( '/lcdr/v1/concepts' );
	expect( $routes )->toHaveKey( '/lcdr/v1/concepts/(?P<id>[\\d]+)' );
} );

test( '\LCDR\Rest\Routes\Concept must have base', function () {
	$concept = new \LCDR\Rest\Routes\Concept();
	expect( $concept->set_base() )->toBe( 'concepts' );
} );

test( '\LCDR\Rest\Routes\Concept must have method set_schema', function () {
	$concept = new \LCDR\Rest\Routes\Concept();
	expect( $concept->set_schema() )->toBe( [] );
} );

test( '\LCDR\Rest\Routes\Concept must have permission_group', function () {
	$concept = new \LCDR\Rest\Routes\Concept();
	expect( $concept->set_permission_group() )->toBe( 'entities' );
} );

test( '\LCDR\Rest\Routes\Concept->create_item()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Concept();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/concepts/" );
	$request->set_body( json_encode( array( 'author' => 1, 'name' => 'test' ) ) );
	$request->set_param( 'author', 1 );
	$result = $base->create_item( $request );
	var_dump( 'test result', $result );
	expect( $result )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
} )->skip();