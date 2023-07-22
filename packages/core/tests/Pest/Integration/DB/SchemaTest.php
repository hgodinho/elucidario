<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

beforeEach( function () {
	parent::setUp();
	global $wpdb;

	$this->charset = $wpdb->get_charset_collate();
} );

afterEach( function () {
	parent::tearDown();
} );

test( '\LCDR\DB\Schema class', function () {
	$schema = new \LCDR\DB\Schema();
	expect( $schema )->toBeInstanceOf( \LCDR\DB\Schema::class);
} );

test( '\LCDR\DB\Schema->wpdb', function () {
	$schema = new \LCDR\DB\Schema();
	expect( $schema->wpdb )->toBeInstanceOf( \wpdb::class);
} );

test( '\LCDR\DB\Schema->prefix', function () {
	$schema = new \LCDR\DB\Schema();
	expect( $schema->prefix )->toBe( $schema->wpdb->prefix . 'lcdr_' );
} );

test( '\LCDR\DB\Schema->relationship_query', function () {
	$schema = new \LCDR\DB\Schema();
	expect( $schema->relationship_query( 'teste', 'teste_a', 'teste_b', 'teste', 'teste' ) )->toBe(
		"CREATE TABLE teste (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                `teste_a` bigint(20) unsigned NOT NULL,
                `teste_b` bigint(20) unsigned NOT NULL,
                `prop_name` varchar(64) NOT NULL DEFAULT '',
                `from_relation` varchar(64) NOT NULL DEFAULT '',
                PRIMARY KEY  (`id`)
            ) DEFAULT CHARACTER SET utf8;"
	);
} );

test( '\LCDR\DB\Schema->create_options', function () {
	$schema = new \LCDR\DB\Schema();
	$result = $schema->create_options();
	expect( $result )->toBe( true );
} );