<?php

namespace LCDR\Tests\Integration\Rest;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( Testcase::class);

class BaseTestCase extends \LCDR\Rest\Routes\Abstracts\Entities {
	public function set_base() {
		return 'tests';
	}
	public function set_schema() {
		return array(
			'mdorim' => array(
				'edit' => array(
					'schema' => 'mdorim/concept',
					'options' => array(
						'definitions' => 'ConceptPost'
					)
				),
				'view' => array(
					'schema' => 'mdorim/concept',
				)
			),
			'la' => array(
				'view' => array(
					'schema' => 'linked-art/concept',
				),
			)
		);
	}
	public function prepare_item_for_database( $request ) {
		return parent::prepare_item_for_database( $request );
	}
	public function get_lcdr_fields_for_response( $entity, $request ) {
		return parent::get_lcdr_fields_for_response( $entity, $request );
	}
	public function handle_status_param( $status = '' ) {
		return parent::handle_status_param( $status );
	}
}

beforeAll( function () {
	global $core, $wp_rest_server, $item_id;

	$core = new \LCDR\Core();
	do_action( 'init' );
	wp_set_current_user( 1 );

	$wp_rest_server = new \Spy_REST_Server();
	$query = new \LCDR\DB\Query\Entities( array(
		'item_name' => 'concept',
		'item_name_plural' => 'concepts',
		'item_shape' => 'ConceptRow',
	) );
	$item_id = $query->add_entity(
		array(
			'type' => 'Type',
			'_label' => 'Relation test',
			'author' => 1,
			'status' => 'publish',
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 2',
				),
			),
		)
	);

	add_action( 'rest_api_init', function () {
		$base = new BaseTestCase();
		$base->register_routes();
	} );
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
	expect( $routes )->toHaveKey( '/lcdr/v1/tests' );
	expect( $routes )->toHaveKey( '/lcdr/v1/tests/(?P<id>[\\d]+)' );
} );

test( 'BaseTestCase must have base', function () {
	$base = new BaseTestCase();
	expect( $base->rest_base )->toBe( 'tests' );
} );

test( 'BaseTestCase must have permission group', function () {
	$base = new BaseTestCase();
	expect( $base->permission_group )->toBe( 'entities' );
} );

test( 'BaseTestCase->register_routes() should return an array of true values', function () {
	add_action( 'rest_api_init', function () {
		$base = new BaseTestCase();
		$routes = $base->register_routes();
		expect( $routes )->toBeArray();
		foreach ( $routes as $route ) {
			expect( $route )->toBeTrue();
		}
	} );
	do_action( 'rest_api_init' );
} );

test( 'BaseTestCase->get_item_permissions_check() should return true for public access on published entity', function () {
	global $item_id;
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/{$item_id}" );
	$request->set_param( 'id', $item_id );
	$result = $base->get_item_permissions_check( $request );
	expect( $result )->toBeTrue();
} );

test( 'BaseTestCase->get_item_permissions_check() should return ERROR for status other than publish with not logged user', function () {
	$query = new \LCDR\DB\Query\Entities( array(
		'item_name' => 'concept',
		'item_name_plural' => 'concepts',
		'item_shape' => 'ConceptRow',
	) );
	$item_id = $query->add_entity(
		array(
			'type' => 'Type',
			'_label' => 'relation-test',
			'author' => 1,
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 2',
				),
			),
			'status' => 'draft',
		)
	);
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/{$item_id}" );
	$request->set_param( 'id', $item_id );
	$result = $base->get_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->get_item_permissions_check() should return ERROR with id 0', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/0" );
	$result = $base->get_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->get_item_permissions_check() should return ERROR with wrong id', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/99999/" );
	$result = $base->get_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->get_item_permissions_check() should return ERROR with context edit and not logged user', function () {
	global $item_id;
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/{$item_id}" );
	$request->set_param( 'context', 'edit' );
	$result = $base->get_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->get_item_permissions_check() should return ERROR with wrong password', function () {
	$query = new \LCDR\DB\Query\Entities( array(
		'item_name' => 'concept',
		'item_name_plural' => 'concepts',
		'item_shape' => 'ConceptRow',
	) );
	$item_id = $query->add_entity( array(
		'type' => 'Type',
		'_label' => 'relation-test',
		'author' => 1,
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 2',
			),
		),
		'password' => 'password-test',
	) );
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/{$item_id}" );
	$request->set_param( 'id', $item_id );
	$request->set_param( 'password', 'wrong-password' );
	$result = $base->get_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->get_items_permissions_check() should return true for public access', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/" );
	$result = $base->get_items_permissions_check( $request );
	expect( $result )->toBeTrue();
} );

test( 'BaseTestCase->get_items_permissions_check() should return ERROR with context edit', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/" );
	$request->set_param( 'context', 'edit' );
	$result = $base->get_items_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->get_route() true for collection', function () {
	global $item_id;
	$base = new BaseTestCase();
	$result = $base->get_route( $item_id, true );
	expect( $result )->toBe( 'lcdr/v1/tests' );
} );

test( 'BaseTestCase->get_route() false for collection', function () {
	global $item_id;
	$base = new BaseTestCase();
	$result = $base->get_route( $item_id );
	expect( $result )->toBe( "lcdr/v1/tests/{$item_id}" );
} );

test( 'BaseTestCase->get_lcdr_fields_for_response', function () {
	global $item_id;
	$entity = lcdr_get_entity( $item_id );
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$request->set_body_params(
		array(
			'_fields' => array(
				'entity_id',
				'type',
				'identified_by',
			)
		)
	);
	$base = new BaseTestCase();
	$result = $base->get_lcdr_fields_for_response( $entity, $request );
	expect( $result )->toMatchArray( array(
		'entity_id',
		'type',
		'identified_by'
	) );
} );

test( 'BaseTestCase->get_lcdr_fields_for_response no fields', function () {
	global $item_id;
	$entity = lcdr_get_entity( $item_id );
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$base = new BaseTestCase();
	$result = $base->get_lcdr_fields_for_response( $entity, $request );
	expect( $result )->toMatchArray( array(
		'_links',
		'entity_id',
		'name',
		'guid',
		'created',
		'modified',
		'password',
		'author',
		'status',
		'_label',
		'type',
		'identified_by',
		'classified_as',
		'referred_to_by',
		'equivalent',
		'representation',
		'member_of',
		'subject_of',
		'attributed_by',
		'created_by',
		'broader',
	) );
} );

test( 'BaseTestCase->prepare_item_for_database()', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	wp_set_current_user( 1 );

	$request->set_body_params(
		array(
			'type' => 'Type',
			'_label' => 'Relation test',
			'author' => 1,
			'status' => 'publish',
			'identified_by' => array(
				(object) array(
					'type' => 'Identifier',
					'content' => 'Teste 2',
				),
			),
		)
	);
	$result = $base->prepare_item_for_database( $request );
	expect( $result )->toBeObject();
	expect( $result->author )->toBe( 1 );
	expect( $result->status )->toBe( 'publish' );
	expect( $result->type )->toBe( 'Type' );
	expect( $result->_label )->toBe( 'Relation test' );
	expect( $result->identified_by )->toBeArray();
} );

test( 'BaseTestCase->create_item_permissions_check() should return ERROR if request has ID', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$request->set_param( 'id', 9999 );
	$result = $base->create_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->create_item_permissions_check() should return ERROR with not logged user', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$result = $base->create_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->create_item_permissions_check() should return ERROR with logged user and passed wrong user id in request', function () {
	$user = wp_create_user( 'test', 'test', 'test@test' );
	wp_set_current_user( $user );
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$request->set_body( json_encode( array( 'author' => 9999 ) ) );
	$request->set_param( 'author', 9999 );
	$result = $base->create_item_permissions_check( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->create_item_permissions_check() should return true with logged users with correct capabilities', function () {
	wp_set_current_user( 1 );
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$request->set_body( json_encode( array( 'author' => 9999 ) ) );
	$request->set_param( 'author', 9999 );
	$result = $base->create_item_permissions_check( $request );
	expect( $result )->toBeTrue();
} );

test( 'BaseTestCase->content_negotiation_request() wrong type return error', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/" );
	$request->set_header( 'Accept', 'banana' );
	$result = $base->content_negotiation_request( $request );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Rest::class);
} );

test( 'BaseTestCase->content_negotiation_request() null type return mdorim', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'POST', "/lcdr/v1/tests/" );
	$request->set_body( json_encode( array( 'author' => 9999 ) ) );
	$request->set_param( 'author', 9999 );
	$result = $base->content_negotiation_request( $request );
	expect( $result )->toBe( 'mdorim' );
} );

test( 'BaseTestCase->content_negotiation_request() linked art type return la', function () {
	$base = new BaseTestCase();
	$request = new \WP_REST_Request( 'GET', "/lcdr/v1/tests/" );
	$request->set_header( 'Accept', 'application/ld+json; profile="https://linked.art/ns/v1/linked-art.json"' );
	$result = $base->content_negotiation_request( $request );
	expect( $result )->toBe( 'la' );
} );

test( 'BaseTestCase->handle_status_param', function () {
	wp_set_current_user( 9999 );
	$base = new BaseTestCase();
	$result = $base->handle_status_param( 'draft' );
	expect( $result )->toBe( 'draft' );

	$result = $base->handle_status_param( 'pending' );
	expect( $result )->toBe( 'pending' );

	$result = $base->handle_status_param( 'default' );
	expect( $result )->toBe( 'draft' );

	wp_set_current_user( 1 );
} );

test( 'BaseTestCase->handle_status_param Errors', function () {
	wp_set_current_user( 9999 );
	$base = new BaseTestCase();
	$result = $base->handle_status_param( 'private' );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Error::class);

	$result = $base->handle_status_param( 'publish' );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Error::class);

	$result = $base->handle_status_param( 'future' );
	expect( $result )->toBeInstanceOf( \LCDR\Error\Error::class);

	wp_set_current_user( 1 );
} );