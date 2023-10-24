<?php

test( 'validate() method should return true with right data and right schema', function () {
	global $schema;
	$result = $schema->validate( 'mdorim/concept', (object) array(
		'entity_id' => 1,
		'name' => 'concept-test',
		'guid' => 'acdca5e6-ca0d-4eb7-8a64-ecb59df61395',
		'author' => 1,
		'type' => 'Concept',
		'identified_by' => array(
			(object) array(
				'type' => 'Identifier',
				'content' => 'Ola mundo',
			)
		),
		'classified_as' => array(
			(object) array(
				'type' => 'Type',
				'id' => 'https://elucidario.art/mdorim/concept/1',
			)
		),
	) );
	expect( $result )->toBeTrue();
} );

test( 'validate() method should throw exception with wrong data', function () {
	expect(
		function () {
			global $schema;
			$schema->validate( 'mdorim/concept', (object) array(
				'clafied_as' => array(
				),
			) );
		}
	)->toThrow( Exception::class);
} );