<?php

namespace LCDR\Tests\Pest\Integration\Model\Entities;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( TestCase::class);

$concept = new \LCDR\Model\Entities\Concept();
$concept_data = array(
	'ID' => 1,
	'label' => 'Test',
	'uri' => 'http://test.com',
	'identified_by' => array(
		array(
			'type' => 'Identifier',
			'classified_as' => [ 2 ],
			'content' => 'M-0101',
		),
	)
);

test( 'Concept class', function () use ($concept, $concept_data) {
	expect( $concept )->toBeInstanceOf( \LCDR\Model\Entities\Concept::class);

	$concept_1 = new \LCDR\Model\Entities\Concept( $concept_data );
	expect( $concept_1 )->toBeInstanceOf( \LCDR\Model\Entities\Concept::class);
} );

test( 'Concept->ID', function () use ($concept, $concept_data) {
	expect( $concept->ID )->toBeNull();

	$concept_1 = new \LCDR\Model\Entities\Concept( $concept_data );
	expect( $concept_1->ID )->toBe( 1 );
} );

test( 'Concept->type', function () use ($concept, $concept_data) {
	expect( $concept->type )->toBe( 'Concept' );

	$concept_1 = new \LCDR\Model\Entities\Concept( $concept_data );
	expect( $concept_1->type )->toBe( 'Concept' );
} );

test( 'Concept->label', function () use ($concept, $concept_data) {
	expect( $concept->label )->toBe( '' );

	$concept_1 = new \LCDR\Model\Entities\Concept( $concept_data );
	expect( $concept_1->label )->toBe( 'Test' );
} );

test( 'Concept->uri', function () use ($concept, $concept_data) {
	expect( $concept->uri )->toBe( '' );

	$concept_1 = new \LCDR\Model\Entities\Concept( $concept_data );
	expect( $concept_1->uri )->toBe( 'http://test.com' );
} );

test( 'Concept->identified_by', function () use ($concept, $concept_data) {
	expect( $concept->identified_by )->toBeArray();

	$concept_1 = new \LCDR\Model\Entities\Concept( $concept_data );
	expect( $concept_1->identified_by )->toBe(
		array(
			array(
				'type' => 'Identifier',
				'classified_as' => [ 2 ],
				'content' => 'M-0101',
			),
		)
	);
} );

test( 'Concept->classified_as', function () use ($concept, $concept_data) {

	expect( $concept->classified_as )->toBeArray();
} );

test( 'Concept->referred_to_by', function () use ($concept, $concept_data) {
	expect( $concept->referred_to_by )->toBeArray();
} );

test( 'Concept->equivalent', function () use ($concept, $concept_data) {
	expect( $concept->equivalent )->toBeArray();
} );

test( 'Concept->attributed_by', function () use ($concept, $concept_data) {
	expect( $concept->attributed_by )->toBeArray();
} );

test( 'Concept->representation', function () use ($concept, $concept_data) {
	expect( $concept->representation )->toBeArray();
} );

test( 'Concept->part_of', function () use ($concept, $concept_data) {
	expect( $concept->part_of )->toBeArray();
} );

test( 'Concept->member_of', function () use ($concept, $concept_data) {
	expect( $concept->member_of )->toBeArray();
} );

test( 'Concept->subject_of', function () use ($concept, $concept_data) {
	expect( $concept->subject_of )->toBeArray();
} );