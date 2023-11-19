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
	expect( $routes )->toHaveKey( '/lcdr/v1/persons' );
	expect( $routes )->toHaveKey( '/lcdr/v1/persons/(?P<id>[\\d]+)' );
} );

test( '\LCDR\Rest\Routes\Persons must have base', function () {
	$concept = new \LCDR\Rest\Routes\Persons();
	expect( $concept->set_base() )->toBe( 'persons' );
} );

test( '\LCDR\Rest\Routes\Persons must have method set_schema', function () {
	$concept = new \LCDR\Rest\Routes\Persons();
	expect( $concept->set_schema() )->toMatchArray( array(
		'mdorim' => array(
			'view' => array(
				'schema' => 'mdorim/person',
			),
			'edit' => array(
				'schema' => 'mdorim/person',
				'options' => array(
					'definitions' => 'PersonPost'
				)
			),
		),
		'la' => array(
			'view' => array(
				'schema' => 'linked-art/person',
			),
		),
	) );
} );

test( '\LCDR\Rest\Routes\Persons must have permission_group', function () {
	$concept = new \LCDR\Rest\Routes\Persons();
	expect( $concept->set_permission_group() )->toBe( 'entities' );
} );

test( '\LCDR\Rest\Routes\Persons->create_item()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Persons();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/persons/" );
	$request->set_body_params(
		array(
			'type' => 'Person',
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

	global $concept_id;
	$concept_id = $result->data['entity_id'];
} );

test( '\LCDR\Rest\Routes\Persons->update_item()', function () {
	wp_set_current_user( 1 );
	global $concept_id;
	$base = new \LCDR\Rest\Routes\Persons();
	$request = new \WP_REST_Request( 'PATCH', "/lcdr/v1/persons/{$concept_id}" );
	$request->set_body_params(
		array(
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 3',
				),
			),
		)
	);
	$result = $base->update_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'teste' );
} );

test( '\LCDR\Rest\Routes\Persons->get_item()', function () {
	wp_set_current_user( 1 );
	global $concept_id;
	$base = new \LCDR\Rest\Routes\Persons();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/persons/{$concept_id}" );
	$result = $base->get_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'teste' );
} );

test( '\LCDR\Rest\Routes\Persons->get_items()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Persons();
	$request = new \WP_REST_Request( 'GET', '/lcdr/v1/persons/' );
	$result = $base->get_items( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data )->toBeArray();
} );

test( '\LCDR\Rest\Routes\Persons->delete_item()', function () {
	wp_set_current_user( 1 );
	global $concept_id;
	$base = new \LCDR\Rest\Routes\Persons();
	$request = new \WP_REST_Request( 'DELETE', "/lcdr/v1/persons/{$concept_id}" );
	$result = $base->delete_item( $request );

	expect( $result )->toBeInstanceOf( WP_REST_Response::class);
	expect( $result->data['deleted'] )->toBeTrue();
} );