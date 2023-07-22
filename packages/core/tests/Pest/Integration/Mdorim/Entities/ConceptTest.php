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

// test( '\LCDR\Mdorim\Entities\Concept->label', function () use ($concept, $concept_data) {
// 	expect( $concept->label )->toBe( '' );

// 	$concept_1 = new \LCDR\Mdorim\Entities\Concept( $concept_data );
// 	expect( $concept_1->label )->toBe( 'Test' );
// } );

// test( '\LCDR\Mdorim\Entities\Concept->uri', function () use ($concept, $concept_data) {
// 	expect( $concept->uri )->toBe( '' );

// 	$concept_1 = new \LCDR\Mdorim\Entities\Concept( $concept_data );
// 	expect( $concept_1->uri )->toBe( 'http://test.com' );
// } );

// test( '\LCDR\Mdorim\Entities\Concept->identified_by', function () use ($concept, $concept_data) {
// 	expect( $concept->identified_by )->toBeArray();

// 	$concept_1 = new \LCDR\Mdorim\Entities\Concept( $concept_data );
// 	expect( $concept_1->identified_by )->toBe(
// 		array(
// 			array(
// 				'type' => 'Identifier',
// 				'classified_as' => [ 2 ],
// 				'content' => 'M-0101',
// 			),
// 		)
// 	);
// } );

// test( '\LCDR\Mdorim\Entities\Concept->classified_as', function () use ($concept, $concept_data) {

// 	expect( $concept->classified_as )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->referred_to_by', function () use ($concept, $concept_data) {
// 	expect( $concept->referred_to_by )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->equivalent', function () use ($concept, $concept_data) {
// 	expect( $concept->equivalent )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->attributed_by', function () use ($concept, $concept_data) {
// 	expect( $concept->attributed_by )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->representation', function () use ($concept, $concept_data) {
// 	expect( $concept->representation )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->part_of', function () use ($concept, $concept_data) {
// 	expect( $concept->part_of )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->member_of', function () use ($concept, $concept_data) {
// 	expect( $concept->member_of )->toBeArray();
// } );

// test( '\LCDR\Mdorim\Entities\Concept->subject_of', function () use ($concept, $concept_data) {
// 	expect( $concept->subject_of )->toBeArray();
// } );