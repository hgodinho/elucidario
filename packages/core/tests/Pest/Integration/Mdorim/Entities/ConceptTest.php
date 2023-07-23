<?php

namespace LCDR\Tests\Pest\Integration\Mdorim\Entities;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( TestCase::class);

$concept = new \LCDR\Mdorim\Entities\Concept();
$concept_data = (object) array(
	'ID' => 1,
	'label' => 'Test',
	'uri' => 'http://test.com',
	'identified_by' => array(
		(object) array(
			'type' => 'Identifier',
			'classified_as' => [ 2 ],
			'content' => 'M-0101',
		),
	)
);

test( '\LCDR\Mdorim\Entities\Concept class', function () use ($concept, $concept_data) {
	expect( $concept )->toBeInstanceOf( \LCDR\Mdorim\Entities\Concept::class);

	$concept_1 = new \LCDR\Mdorim\Entities\Concept();
	$concept_1->set_data( $concept_data, false );
	expect( $concept_1 )->toBeInstanceOf( \LCDR\Mdorim\Entities\Concept::class);
} );

test( '\LCDR\Mdorim\Entities\Concept->ID', function () use ($concept, $concept_data) {
	expect( $concept->ID )->toBeNull();

	$concept_1 = new \LCDR\Mdorim\Entities\Concept();
	$concept_1->set_data( $concept_data, false );
	expect( $concept_1->ID )->toBe( 1 );
} );

test( '\LCDR\Mdorim\Entities\Concept->type', function () use ($concept, $concept_data) {
	expect( $concept->type )->toBe( 'Concept' );

	$concept_1 = new \LCDR\Mdorim\Entities\Concept();
	$concept_1->set_data( $concept_data, false );
	expect( $concept_1->type )->toBe( 'Concept' );
} );
