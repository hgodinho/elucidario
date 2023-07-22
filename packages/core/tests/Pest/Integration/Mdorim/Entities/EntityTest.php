<?php

namespace LCDR\Tests\Pest\Integration\Mdorim\Entities;

use Yoast\WPTestUtils\WPIntegration\TestCase;

if ( isUnitTest() ) {
	return;
}

uses( TestCase::class);

final class Entity extends \LCDR\Abstracts\Mdorim\Entity {
	public function __construct( $entity = null ) {
		parent::__construct( $entity );
	}

	public function set_type() {
		$this->type = 'Entity';
	}
}

$entity = new Entity();
$entity_data = (object) array(
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

test( '\LCDR\Abstracts\Mdorim\Entity->ID', function () use ($entity, $entity_data) {
	expect( $entity->ID )->toBeNull();

	$entity_1 = new Entity();
	$entity->set_data( $entity_data, false );
	expect( $entity->ID )->toBe( 1 );
} );

test( '\LCDR\Abstracts\Mdorim\Entity->type', function () use ($entity, $entity_data) {
	expect( $entity->type )->toBe( 'Entity' );
} );

test( '\LCDR\Abstracts\Mdorim\Entity->set_data()', function () use ($entity, $entity_data) {
	$entity->set_data( $entity_data, false );
	expect( $entity->data )->toBe( $entity_data );
} );