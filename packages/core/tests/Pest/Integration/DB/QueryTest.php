<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

beforeAll( function () {
	$schema = new \LCDR\DB\Schema();
	$schema->register_tables();
} );

afterAll( function () {
	$schema = new \LCDR\DB\Schema();
	$schema->unregister_tables();
} );

test( 'Query class', function () {
	$query = new \LCDR\DB\Query();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query::class);
} );

test( 'Query->wpdb', function () {
	$query = new \LCDR\DB\Query();
	expect( $query->wpdb )->toBeInstanceOf( \wpdb::class);
} );

test( 'Query->prefix', function () {
	$query = new \LCDR\DB\Query();
	expect( $query->prefix )->toBe( $query->wpdb->prefix . 'lcdr_' );
} );

test( 'Query->insert', function () {
	$query = new \LCDR\DB\Query();
	$table_name = 'concepts';
	$data = [ 
		'label' => 'test',
		'identified_by' => json_encode( [ 
			[ 
				'type' => 'Identifier',
				'classified_as' => [ 2 ],
				'content' => 'M-0101',
			],
		] )
	];
	$result = $query->insert( $table_name, $data );
	expect( $result )->toBe( 1 );
} );

test( 'Query->update', function () {
	$query = new \LCDR\DB\Query();
	$table_name = 'concepts';
	$result = $query->update( $table_name, [ 'label' => 'Test 2' ], [ 'label' => 'test' ] );
	expect( $result )->toBe( 1 );
} );

test( 'Query->select', function () {
	$query = new \LCDR\DB\Query();
	$table_name = 'concepts';
	$results = $query->select( $table_name, [ 'label' => 'Test 2' ] );
	expect( $results[0]->label )->toBe( 'Test 2' );
} );

test( 'Query->delete', function () {
	$query = new \LCDR\DB\Query();
	$table_name = 'concepts';
	$result = $query->delete( $table_name, [ 'label' => 'Test 2' ] );
	expect( $result )->toBe( 1 );
} );