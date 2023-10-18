<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

beforeAll( function () {
	global $db, $random;
	$db = new \LCDR\DB\Core();
	$random = substr( md5( rand() ), 0, 7 );
} );

afterAll( function () {
	global $db;
	$db->uninstall_tables();
	$concept = new \LCDR\DB\Query\Concepts();
	$all = $concept->get_entities();
	foreach ( $all as $item ) {
		$concept->delete_entity( $item->entity_id );
	}

	$relationships = new \LCDR\DB\Query\Relationships();
	$all = $relationships->get_relationships();
	foreach ( $all as $item ) {
		$relationships->delete_relationship( $item->rel_id );
	}
} );

test( '\LCDR\DB\Query\Concepts class', function () {
	$query = new \LCDR\DB\Query\Concepts();
	expect( $query )->toBeInstanceOf( \LCDR\DB\Query\Concepts::class);
} );

test( '\LCDR\DB\Query\Concepts->add_entities()', function () {
	$concept_query = new \LCDR\DB\Query\Concepts();

	global $concept_ids;
	$concept_ids = $concept_query->add_entities(
		array(
			array(
				'type' => 'Type',
				'_label' => 'Teste',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Teste',
					),
				),
			),
			array(
				'type' => 'Type',
				'_label' => 'Banana',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Banana',
					),
				),
			),
			array(
				'type' => 'Type',
				'_label' => 'Pera',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Pera',
					),
				),
			),
			array(
				'type' => 'Type',
				'_label' => 'Uva',
				'author' => 1,
				'identified_by' => array(
					(object) array(
						'type' => 'Identifier',
						'content' => 'Uva',
					),
				),
			),
		)
	);

	expect( $concept_ids )->toBeArray();
} );

test( '\LCDR\DB\Query\Concepts->add_entity()', function () {
	global $concept_ids;

	$concept = new \LCDR\DB\Query\Concepts();

	$concept_id = $concept->add_entity(
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
			'classified_as' => $concept_ids
		)
	);

	expect( $concept_id )->toBeNumeric();
	expect( $concept_id )->toBeGreaterThan( 0 );
} );

test( '\LCDR\DB\Query\Concepts->add_entity() with referred_to_by', function () {
	global $concept_ids, $concept_id;

	$concept = new \LCDR\DB\Query\Concepts();
	$concept_to_add = array(
		'type' => 'Type',
		'_label' => 'Referred to by test',
		'author' => 1,
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 4',
			),
		),
		'classified_as' => $concept_ids,
		'referred_to_by' => array(
			(object) array(
				'type' => 'LinguisticObject',
				'_label' => 'Teste 4',
				'content' => 'Teste 4',
				'language' => array(
					(object) array(
						'id' => 1,
						'type' => 'Language',
						'_label' => 'Português',
					),
				)
			),
			3,
		),
	);

	$concept_id = $concept->add_entity( $concept_to_add );
	expect( $concept_id )->toBeNumeric();
	expect( $concept_id )->toBeGreaterThan( 0 );
	// var_dump( [ '$concept_id' => $concept_id ] );

	$saved = $concept->get_entity( $concept_id );
	// var_dump( [ $concept_id => $saved ] );
	$referred_to_by = $saved->get_property( 'referred_to_by' );
	expect( $referred_to_by )->toBeArray()->toMatchArray( $concept_to_add['referred_to_by'] );
} );

test( '\LCDR\DB\Query\Concepts->add_entity() no type', function () {
	expect(
		function () {
			$concept_query = new \LCDR\DB\Query\Concepts();
			$concept_query->add_entity(
				array(
					'_label' => 'relation-test',
					'author' => 1,
					'identified_by' => array(
						(object) array(
							'type' => 'Identifier',
							'content' => 'Teste 2',
						),
					),
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a type.' );
} );

test( '\LCDR\DB\Query\Concepts->add_entity() no _label', function () {

	expect(
		function () {
			$concept_query = new \LCDR\DB\Query\Concepts();
			$concept_query->add_entity(
				array(
					'type' => 'Type',
					'author' => 1,
					'identified_by' => array(
						(object) array(
							'type' => 'Identifier',
							'content' => 'Teste 2',
						),
					),
				)
			);
		}
	)->toThrow( \Exception::class, 'The data must have a _label.' );
} );

test( '\LCDR\DB\Query\Concepts->get_entity() must return valid relationships', function () {
	global $concept_id;

	$concept = new \LCDR\DB\Query\Concepts();
	$test = $concept->get_entity( $concept_id );
	$classified_as = $test->get_property( 'classified_as' );
	expect( $classified_as )->toBeArray();
} );

test( '\LCDR\DB\Query\Concepts->get_entities()', function () {
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_entities();

	expect( $test )->toBeArray();
} );

test( '\LCDR\DB\Query\Concepts->get_entity()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_entity( $concept_id );

	expect( $test )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
	expect( $test->get_property( '_label' ) )->toBe( 'Referred to by test' );
	expect( $test->get_property( 'name' ) )->toBe( 'referred-to-by-test' );
} );

test( '\LCDR\DB\Query\Concepts->update_entity()', function () {
	global $concept_id;
	global $concept_ids;

	$classified_as = $concept_ids;
	unset( $classified_as[1] );
	unset( $classified_as[3] );
	$classified_as[] = 1;
	$classified_as = array_values( (array) $classified_as );

	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->update_entity( $concept_id, array(
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 3',
			),
		),
		'classified_as' => $classified_as,
	) );

	$updated = $concepts->get_entity( $concept_id );

	expect( $test )->toBeNumeric();
	expect( $updated->get_property( 'classified_as' ) )->toMatchArray( $classified_as );
} );

test( '\LCDR\DB\Query\Concepts->update_entity() wrong id throws exception', function () {
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->update_entity(
		0,
		array(
			'type' => 'Concept',
		)
	);
	expect( $test )->toBeInstanceOf( \LCDR\Error\Error::class);
} );

test( '\LCDR\DB\Row\Concept->get_property()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->get_item( $concept_id );
	expect( $test->get_property( 'identified_by' ) )->toMatchArray(
		array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Teste 3',
			),
		)
	);
} );

test( '\LCDR\DB\Query\Concepts->delete_item()', function () {
	global $concept_id;
	$concepts = new \LCDR\DB\Query\Concepts();
	$test = $concepts->delete_entity( $concept_id );
	expect( $test )->toBeNumeric();
} );