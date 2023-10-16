<?php

namespace LCDR\Tests\Pest\Integration\Users;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

global $core;

beforeAll( function () {
	global $core;
	$core = \LCDR\Core::get_instance();
} );

test( 'LCDR\Users\Core class', function () {
	global $core;
	expect( $core->users )->toBeInstanceOf( \LCDR\Users\Core::class);
} );

test( 'LCDR\Users\Core::get_instance()', function () {
	global $core;
	expect( $core->users::get_instance() )->toBeInstanceOf( \LCDR\Users\Core::class);
} );

test( 'LCDR\Users\Core if administrator has capabilities', function () {
	$administrator = get_role( 'administrator' );
	expect( $administrator->capabilities )->toHaveKeys(
		array(
			'create_users',
			'delete_users',
			'list_users',
			'lcdr_see_options',
			'lcdr_create_options',
			'lcdr_delete_options',
			'lcdr_see_entities',
			'lcdr_create_entities',
			'lcdr_edit_own_entities',
			'lcdr_edit_others_entities',
			'lcdr_edit_published_entities',
			'lcdr_delete_own_entities',
			'lcdr_publish_entities',
			'lcdr_see_mapping',
			'lcdr_create_mapping',
			'lcdr_edit_own_mapping',
			'lcdr_edit_others_mapping',
			'lcdr_delete_own_mapping',
			'lcdr_see_procedures',
			'lcdr_create_procedures',
			'lcdr_edit_own_procedures',
			'lcdr_edit_others_procedures',
			'lcdr_delete_own_procedures',
		)
	);
} );

test( 'LCDR\Users\Core->get_capabilities_by_role() curator', function () {
	global $core;
	$curator = $core->users->get_capabilities_by_role( 'curator' );
	expect( $curator )->toMatchArray(
		array(
			'create_users' => true,
			'delete_users' => true,
			'list_users' => true,
			'lcdr_see_options' => true,
			'lcdr_create_options' => true,
			'lcdr_delete_options' => true,
			'lcdr_see_entities' => true,
			'lcdr_create_entities' => true,
			'lcdr_edit_own_entities' => true,
			'lcdr_edit_others_entities' => true,
			'lcdr_edit_published_entities' => true,
			'lcdr_delete_own_entities' => true,
			'lcdr_publish_entities' => true,
			'lcdr_see_mapping' => true,
			'lcdr_create_mapping' => true,
			'lcdr_edit_own_mapping' => true,
			'lcdr_edit_others_mapping' => true,
			'lcdr_delete_own_mapping' => true,
			'lcdr_see_procedures' => true,
			'lcdr_create_procedures' => true,
			'lcdr_edit_own_procedures' => true,
			'lcdr_edit_others_procedures' => true,
			'lcdr_delete_own_procedures' => true,
		)
	);
} );

test( 'LCDR\Users\Core->get_capabilities_by_role() museologist', function () {
	global $core;
	$museologist = $core->users->get_capabilities_by_role( 'museologist' );
	expect( $museologist )->toMatchArray(
		array(
			'create_users' => true,
			'delete_users' => true,
			'list_users' => true,
			'lcdr_see_options' => true,
			'lcdr_create_options' => true,
			'lcdr_delete_options' => true,
			'lcdr_see_entities' => true,
			'lcdr_create_entities' => true,
			'lcdr_edit_own_entities' => true,
			'lcdr_edit_others_entities' => true,
			'lcdr_edit_published_entities' => true,
			'lcdr_delete_own_entities' => true,
			'lcdr_publish_entities' => true,
			'lcdr_see_mapping' => true,
			'lcdr_create_mapping' => true,
			'lcdr_edit_own_mapping' => true,
			'lcdr_edit_others_mapping' => true,
			'lcdr_delete_own_mapping' => true,
			'lcdr_see_procedures' => true,
			'lcdr_create_procedures' => true,
			'lcdr_edit_own_procedures' => true,
			'lcdr_edit_others_procedures' => true,
			'lcdr_delete_own_procedures' => true,
		)
	);
} );

test( 'LCDR\Users\Core->get_capabilities_by_role() assistant', function () {
	global $core;
	$assistant = $core->users->get_capabilities_by_role( 'assistant' );
	expect( $assistant )->toMatchArray(
		array(
			'lcdr_see_options' => true,
			'lcdr_see_entities' => true,
			'lcdr_create_entities' => true,
			'lcdr_edit_own_entities' => true,
			'lcdr_edit_others_entities' => true,
			'lcdr_edit_published_entities' => true,
			'lcdr_delete_own_entities' => true,
			'lcdr_see_mapping' => true,
			'lcdr_create_mapping' => true,
			'lcdr_edit_own_mapping' => true,
			'lcdr_edit_others_mapping' => true,
			'lcdr_delete_own_mapping' => true,
			'lcdr_see_procedures' => true,
			'lcdr_create_procedures' => true,
			'lcdr_edit_own_procedures' => true,
			'lcdr_edit_others_procedures' => true,
			'lcdr_delete_own_procedures' => true,
		)
	);
} );

test( 'LCDR\Users\Core->get_capabilities_by_role() researcher', function () {
	global $core;
	$researcher = $core->users->get_capabilities_by_role( 'researcher' );
	expect( $researcher )->toMatchArray(
		array(
			'lcdr_see_entities' => true,
			'lcdr_create_entities' => true,
			'lcdr_edit_own_entities' => true,
			'lcdr_edit_others_entities' => true,
			'lcdr_see_mapping' => true,
			'lcdr_create_mapping' => true,
			'lcdr_edit_own_mapping' => true,
			'lcdr_edit_others_mapping' => true,
		)
	);
} );

test( 'Roles added', function () {
	$roles = get_editable_roles();
	expect( $roles )->toHaveKeys(
		array(
			'curator',
			'museologist',
			'assistant',
			'researcher',
		)
	);
} );