<?php

namespace LCDR\Tests\Pest\Integration\Mdorim\Entities;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( TestCase::class);

test( '\LCDR\Mdorim\Schema', function () {
	$schema = new \LCDR\Mdorim\Schema();
	expect( $schema )->toBeInstanceOf( \LCDR\Mdorim\Schema::class);
} );

test( '\LCDR\Mdorim\Schema->init_validator() && get_validator()', function () {
	$schema = new \LCDR\Mdorim\Schema();
	expect( $schema->get_validator() )->toBeInstanceOf( \Opis\JsonSchema\Validator::class);
} );

test( '\LCDR\Mdorim\Schema->id_map()', function () {
	$schema = new \LCDR\Mdorim\Schema();
	$id_map = $schema->id_map( 'concept' );
	expect( $id_map )->toBe( 'https://elucidario.art/mdorim/concept.json' );

	$id_map2 = $schema->id_map( 'concept/concept' );
	expect( $id_map2 )->toBe( 'https://elucidario.art/mdorim/concept/concept.json' );
} );

test( '\LCDR\Mdorim\Schema->validate()', function () {
	$schema = new \LCDR\Mdorim\Schema();
	$result = $schema->validate( 'schemas/mdorim/concept', (object) array(
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Ola mundo',
			)
		),
		'classified_as' => array(
			(object) array(
				'type' => 'Type',
				'id' => 1,
			)
		),
	) );
	expect( $result )->toBeTrue();
} );