<?php
namespace LCDR\Tests\Pest\Unit;

use Yoast\WPTestUtils\WPIntegration\TestCase;

uses( TestCase::class);

class TestBaseError extends \LCDR\Error\Base {
	public function set_prefix() {
		return 'test_';
	}

	public function set_possible_errors() {
		return array(
			'error' => __( 'Texto', 'lcdr' )
		);
	}
}

test( 'is_lcdr_error()', function () {
	expect( is_lcdr_error( new TestBaseError( 'error' ) ) )->toBeTrue();
	expect( is_lcdr_error( new \LCDR\Error\DB( 'error' ) ) )->toBeTrue();
	expect( is_lcdr_error( new \LCDR\Error\User( 'undefined_role' ) ) )->toBeTrue();
} );

test( 'TestBaseError', function () {
	$error = new TestBaseError( 'error' );
	expect( $error->get_error_code() )->toBe( 'test__error' );
	expect( $error->get_error_message() )->toBe( 'Texto' );
	expect( $error->get_error_data() )->toBe( null );
} );

test( 'TestBaseError empty code', function () {
	$error = new TestBaseError();
	expect( $error )->toBeInstanceOf( \LCDR\Error\Base::class);
	expect( $error->get_error_code() )->toBe( 'test__undefined_error' );
} );

test( '\LCDR\Error\DB db__error', function () {
	$error = new \LCDR\Error\DB( 'error' );
	expect( $error->get_error_code() )->toBe( 'db__error' );
	expect( $error->get_error_message() )->toBe( 'Database error.' );
	expect( $error->get_error_data() )->toBe( null );
} );

test( '\LCDR\Error\User user__undefined_role', function () {
	$error = new \LCDR\Error\User( 'undefined_role' );
	expect( $error->get_error_code() )->toBe( 'user__undefined_role' );
	expect( $error->get_error_message() )->toBe( 'Undefined user role.' );
	expect( $error->get_error_data() )->toBe( null );
} );

test( '\LCDR\Error\User user__unknown_role', function () {
	$error = new \LCDR\Error\User( 'unknown_role', 'banana' );
	expect( $error->get_error_code() )->toBe( 'user__unknown_role' );
	expect( $error->get_error_message() )->toBe( 'Unknown user role.' );
	expect( $error->get_error_data() )->toBe( 'banana' );
} );