<?php

namespace LCDR\Tests\Pest\Integration\DB;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}
uses( TestCase::class);

$db;
$data_entity_to_test_against = array(
	'type' => 'Type',
	'_label' => 'relation-test',
	'author' => 1,
	'identified_by' => array(
		(object) array(
			'type' => 'Identifier',
			'content' => 'Teste 2',
		),
	),
);
$entity_to_test_against = false;

beforeAll( function () {
	global $db, $data_entity_to_test_against, $entity_to_test_against;
	$db = new \LCDR\DB\Core();
	$entity_query = new \LCDR\DB\Query\Entities();
	$entity_to_test_against = $entity_query->add_entity( $data_entity_to_test_against );
} );

test( '\LCDR\DB\Row\Factory::create() with empty array data return Error', function () {
	$entity = \LCDR\DB\Row\Factory::create( array() );
	expect( $entity )->toBeInstanceOf( \LCDR\Error\Factory::class);
} );

test( '\LCDR\DB\Row\Factory::create() with array data', function () {
	global $data_entity_to_test_against;
	$entity = \LCDR\DB\Row\Factory::create( $data_entity_to_test_against );
	expect( $entity )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
} );

test( '\LCDR\DB\Row\Factory::create() with int (ID) data', function () {
	global $entity_to_test_against;
	$entity = \LCDR\DB\Row\Factory::create( $entity_to_test_against );
	expect( $entity )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
} );

test( '\LCDR\DB\Row\Factory::create() with \LCDR\DB\Row\Entity data', function () {
	global $entity_to_test_against;
	$entity_query = new \LCDR\DB\Query\Entities();
	$entity_to_test = $entity_query->get_entity( $entity_to_test_against );
	$entity = \LCDR\DB\Row\Factory::create( $entity_to_test );
	expect( $entity )->toBeInstanceOf( \LCDR\DB\Row\Concept::class);
} );