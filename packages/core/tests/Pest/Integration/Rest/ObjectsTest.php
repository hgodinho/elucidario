<?php

namespace LCDR\Tests\Integration\Rest;

use WP_REST_Response;
use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

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
	expect( $routes )->toHaveKey( '/lcdr/v1/objects' );
	expect( $routes )->toHaveKey( '/lcdr/v1/objects/(?P<id>[\\d]+)' );
} );

test( '\LCDR\Rest\Routes\Objects must have base', function () {
	$object = new \LCDR\Rest\Routes\Objects();
	expect( $object->set_base() )->toBe( 'objects' );
} );

test( '\LCDR\Rest\Routes\Objects must have method set_schema', function () {
	$object = new \LCDR\Rest\Routes\Objects();
	expect( $object->set_schema() )->toMatchArray( array(
		'mdorim' => array(
			'view' => array(
				'schema' => 'mdorim/object',
			),
			'edit' => array(
				'schema' => 'mdorim/object',
				'options' => array(
					'definitions' => 'ObjectPost'
				)
			),
		),
		'la' => array(
			'view' => array(
				'schema' => 'linked-art/object',
			),
		),
	) );
} );

test( '\LCDR\Rest\Routes\Objects must have permission_group', function () {
	$object = new \LCDR\Rest\Routes\Objects();
	expect( $object->set_permission_group() )->toBe( 'entities' );
} );

test( '\LCDR\Rest\Routes\Objects->create_item()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Objects();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/objects/" );
	$request->set_body_params(
		array(
			'type' => 'HumanMadeObject',
			'author' => 1,
			'_label' => 'Teste',
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 2',
				),
			),
		)
	);
	$request->set_param( 'author', 1 );
	$result = $base->create_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'teste' );

	global $object_id;
	$object_id = $result->data['entity_id'];
} );

test( '\LCDR\Rest\Routes\Objects->update_item()', function () {
	wp_set_current_user( 1 );
	global $object_id;
	$base = new \LCDR\Rest\Routes\Objects();
	$request = new \WP_REST_Request( 'PATCH', "/lcdr/v1/objects/{$object_id}" );
	$request->set_body_params(
		array(
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 3',
				)
			)
		)
	);
	$result = $base->update_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'teste' );
} );

test( '\LCDR\Rest\Routes\Objects->get_item()', function () {
	wp_set_current_user( 1 );
	global $object_id;
	$base = new \LCDR\Rest\Routes\Objects();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/objects/{$object_id}" );
	$result = $base->get_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'teste' );
} );

test( '\LCDR\Rest\Routes\Objects->get_items()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Objects();
	$request = new \WP_REST_Request( 'GET', '/lcdr/v1/objects/' );
	$result = $base->get_items( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data )->toBeArray();
} );

test( '\LCDR\Rest\Routes\Objects->delete_item()', function () {
	wp_set_current_user( 1 );
	global $object_id;
	$base = new \LCDR\Rest\Routes\Objects();
	$request = new \WP_REST_Request( 'DELETE', "/lcdr/v1/objects/{$object_id}" );
	$result = $base->delete_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['deleted'] )->toBeTrue();
} );