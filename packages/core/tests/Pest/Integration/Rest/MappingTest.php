<?php

namespace LCDR\Tests\Integration\Rest;

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
	expect( $routes )->toHaveKey( '/lcdr/v1/mapping' );
	expect( $routes )->toHaveKey( '/lcdr/v1/mapping/(?P<id>[\\d]+)' );
} );

test( 'LCDR\Rest\Routes\Mapping must have base', function () {
	$mapping = new \LCDR\Rest\Routes\Mapping();
	expect( $mapping->set_base() )->toBe( 'mapping' );
} );

test( 'LCDR\Rest\Routes\Mapping must have method set_schema', function () {
	$mapping = new \LCDR\Rest\Routes\Mapping();
	expect( $mapping->set_schema() )->toBe(
		array(
			'mdorim' => array(
				'view' => array(
					'schema' => 'mdorim/mapping',
				),
				'edit' => array(
					'schema' => 'mdorim/mapping',
					'options' => array(
						'definitions' => 'MappingPost',
					),
				),
			)
		)
	);
} );

test( 'LCDR\Rest\Routes\Mapping must have permission_group', function () {
	$mapping = new \LCDR\Rest\Routes\Mapping();
	expect( $mapping->set_permission_group() )->toBe( 'mapping' );
} );

test( '\LCDR\Rest\Routes\Mapping->create_item()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Mapping();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/mapping/" );
	$request->set_body_params(
		array(
			'title' => 'Mapping Test',
			'description' => 'Description',
			'standard' => (object) array(
				'name' => 'teste',
				'uri' => 'uri:teste'
			),
			'mapping' => array(
				(object) array(
					'prop_name' => 'identified_by',
					'entity_type' => 'HumanMadeObject',
					'description' => 'teste',
					'external' => (object) array(
						'name' => 'teste',
						'type' => 'string',
						'uri' => 'teste'
					),
					'map_value' => (object) array(
						'type' => 'Identifier',
						'content' => '',
						"classified_as" => array(
							(object) array(
								"id" => "http://purl.org/dc/elements/1.1/title",
								"_label" => "Title",
								"type" => "Type"
							),
							(object) array(
								"id" => "http://vocab.getty.edu/aat/300417209",
								"_label" => "Full titles",
								"type" => "Type"
							)
						)
					),
					'editable' => true,
					'status' => 'active'
				)
			)
		)
	);
	$result = $base->create_item( $request );

	expect( $result )->toBeInstanceOf( \WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'mapping-test' );
	expect( $result->data['description'] )->toBe( 'Description' );
	expect( $result->data['standard']->name )->toBe( 'teste' );
	expect( $result->data['standard']->uri )->toBe( 'uri:teste' );

	global $mapping_id;
	$mapping_id = $result->data['mapping_id'];
} );

test( '\LCDR\Rest\Routes\Mapping->update_item()', function () {
	wp_set_current_user( 1 );
	global $mapping_id;
	$base = new \LCDR\Rest\Routes\Mapping();
	$request = new \WP_REST_Request( 'PATCH', "/lcdr/v1/mapping/{$mapping_id}" );
	$request->set_body_params(
		array(
			'standard' => (object) array(
				'name' => 'teste 2',
				'uri' => 'uri:teste_2'
			),
		)
	);
	$result = $base->update_item( $request );
	expect( $result )->toBeInstanceOf( \WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'mapping-test' );
	expect( $result->data['standard']->name )->toBe( 'teste 2' );
	expect( $result->data['standard']->uri )->toBe( 'uri:teste_2' );
} );

test( '\LCDR\Rest\Routes\Mapping->get_item()', function () {
	wp_set_current_user( 1 );
	global $mapping_id;
	$base = new \LCDR\Rest\Routes\Mapping();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/mapping/{$mapping_id}" );
	$result = $base->get_item( $request );
	expect( $result )->toBeInstanceOf( \WP_REST_Response::class);
	expect( $result->data['name'] )->toBe( 'mapping-test' );
} );

test( '\LCDR\Rest\Routes\Mapping->get_items()', function () {
	wp_set_current_user( 1 );
	$base = new \LCDR\Rest\Routes\Mapping();
	$request = new \WP_REST_Request( 'GET', '/lcdr/v1/mapping/' );
	$result = $base->get_items( $request );

	expect( $result )->toBeInstanceOf( \WP_REST_Response::class);
	expect( $result->data )->toBeArray();
} );

test( '\LCDR\Rest\Routes\Mapping->delete_item()', function () {
	wp_set_current_user( 1 );
	global $mapping_id;
	$base = new \LCDR\Rest\Routes\Mapping();
	$request = new \WP_REST_Request( 'DELETE', "/lcdr/v1/mapping/{$mapping_id}" );
	$result = $base->delete_item( $request );

	expect( $result )->toBeInstanceOf( \WP_REST_Response::class);
	expect( $result->data['deleted'] )->toBeTrue();
} );