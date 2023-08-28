<?php
namespace LCDR\Tests\Pest\Integration;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

class TestBaseError extends \LCDR\Error\Base {
	public function set_possible_errors() {
		return array(
			'test_error' => __( 'Texto', 'lcdr' )
		);
	}
}

test( 'is_lcdr_error()', function () {
	expect( is_lcdr_error( new \LCDR\Error\DB( 'db_error' ) ) )->toBeTrue();
	expect( is_lcdr_error( new \LCDR\Error\User( 'undefined_user_role' ) ) )->toBeTrue();
	$error = new TestBaseError( 'test_error' );
	expect( is_lcdr_error( $error ) )->toBeTrue();
} );

test( 'TestBaseError', function () {
	$error = new TestBaseError( 'test_error' );
	expect( $error->get_error_code() )->toBe( 'test_error' );
	expect( $error->get_error_message() )->toBe( 'Texto' );
	expect( $error->get_error_data() )->toBe( null );
} );

test( 'TestBaseError empty code', function () {
	$error = new TestBaseError();
	expect( $error )->toBeInstanceOf( \LCDR\Error\Base::class);
} );

test( '\LCDR\Error\DB db_error', function () {
	$error = new \LCDR\Error\DB( 'db_error' );
	expect( $error->get_error_code() )->toBe( 'db_error' );
	expect( $error->get_error_message() )->toBe( 'Database error.' );
	expect( $error->get_error_data() )->toBe( null );
} );

test( '\LCDR\Error\User undefined_user_role', function () {
	$error = new \LCDR\Error\User( 'undefined_user_role' );
	expect( $error->get_error_code() )->toBe( 'undefined_user_role' );
	expect( $error->get_error_message() )->toBe( 'Undefined user role.' );
	expect( $error->get_error_data() )->toBe( null );
} );

test( '\LCDR\Error\User unknown_user_role', function () {
	$error = new \LCDR\Error\User( 'unknown_user_role', 'banana' );
	expect( $error->get_error_code() )->toBe( 'unknown_user_role' );
	expect( $error->get_error_message() )->toBe( 'Unknown user role.' );
	expect( $error->get_error_data() )->toBe( 'banana' );
} );