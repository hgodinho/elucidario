<?php

class GeneratorTestCase extends \Mdorim\Schema\Generator {
	use \Mdorim\Traits\Singleton;
	public function set_schema() {
		return array(
			'title' => 'Teste',
			'type' => 'object',
			'description' => 'Teste',
			'properties' => array(
				'uri' => $this->string_schema( array( 'format' => 'url' ) ),
			)
		);
	}
	public function parse_schema( $schema ) {
		return parent::parse_schema( $schema );
	}
	public function init() {
		return parent::init();
	}
}

test( 'GeneratorTestCase->parse_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->parse_schema( $generator->set_schema() );
	expect( $schema )->toMatchArray(
		array(
			'title' => 'Teste',
			'type' => 'object',
			'description' => 'Teste',
			'properties' => array(
				'uri' => array(
					'type' => 'string',
					'format' => 'url'
				)
			)
		)
	);
} );

test( 'GeneratorTestCase->get should return metadata schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->get( 'uri' );
	expect( $schema )->toMatchArray(
		array(
			'type' => 'string',
			'format' => 'url'
		)
	);
} );

test( 'GeneratorTestCase->get should return metadata schema with options merged', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->get( 'uri', array(
		'title' => 'Teste',
	) );
	expect( $schema )->toMatchArray(
		array(
			'type' => 'string',
			'format' => 'url',
			'title' => 'Teste',
		)
	);
} );

test( 'GeneratorTestCase->get throws error when no property found', function () {
	expect( function () {
		$generator = new GeneratorTestCase();
		$schema = $generator->get( 'banana' );
	} )->toThrow( \Exception::class, 'Property banana not found.' );
} );

test( 'GeneratorTestCase->parse_schema wrong type throws error', function () {
	expect( function () {
		$generator = new GeneratorTestCase();
		$schema = $generator->parse_schema( array() );
	}
	)->toThrow( \Exception::class, 'Schema type not defined.' );

	expect( function () {
		$generator = new GeneratorTestCase();
		$schema = $generator->parse_schema( array( 'type' => 'array' ) );
	}
	)->toThrow( \Exception::class, 'Schema type must be object.' );

	expect( function () {
		$generator = new GeneratorTestCase();
		$schema = $generator->parse_schema( array( 'type' => 'object' ) );
	}
	)->toThrow( \Exception::class, 'Schema properties not defined.' );
} );

test( 'GeneratorTestCase class', function () {
	$generator = new GeneratorTestCase();
	expect( $generator )->toBeInstanceOf( \Mdorim\Schema\Generator::class);
} );

test( 'method string_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->string_schema(
		array(
			'format' => 'url'
		)
	);
	expect( $schema )->toMatchArray(
		array(
			'type' => 'string',
			'format' => 'url'
		)
	);
} );

test( 'method uri_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->uri_schema();
	expect( $schema )->toMatchArray(
		array(
			'type' => 'string',
			'format' => 'url'
		)
	);
} );

test( 'method date_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->date_schema();
	expect( $schema )->toMatchArray(
		array(
			'type' => 'string',
			'format' => 'date'
		)
	);
} );

test( 'method time_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->time_schema();
	expect( $schema )->toMatchArray(
		array(
			'type' => 'string',
			'format' => 'time'
		)
	);
} );

test( 'method integer_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->integer_schema();
	expect( $schema )->toMatchArray(
		array(
			'type' => 'integer'
		)
	);
} );

test( 'method number_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->number_schema();
	expect( $schema )->toMatchArray(
		array(
			'type' => 'number'
		)
	);
} );

test( 'method boolean_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->boolean_schema();
	expect( $schema )->toMatchArray(
		array(
			'type' => 'boolean'
		)
	);
} );

test( 'method array_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->array_schema(
		$generator->string_schema(
			array(
				'format' => 'url'
			)
		),
		array(
			'title' => 'Teste',
			'minItems' => 1,
		)
	);
	expect( $schema )->toMatchArray(
		array(
			'type' => 'array',
			'items' => array(
				'type' => 'string',
				'format' => 'url'
			),
			'title' => 'Teste',
			'minItems' => 1,
		)
	);
} );

test( 'method one_of_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->one_of_schema(
		$generator->string_schema(
			array(
				'format' => 'url'
			)
		),
		array(
			'title' => 'Teste',
			'minItems' => 1,
		)
	);
	expect( $schema )->toMatchArray(
		array(
			'type' => 'array',
			'items' => array(
				'type' => null,
				'oneOf' => array(
					'type' => 'string',
					'format' => 'url'
				)
			),
			'title' => 'Teste',
			'minItems' => 1,
		)
	);
} );

test( 'method any_of_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->any_of_schema(
		$generator->string_schema(
			array(
				'format' => 'url'
			)
		),
		array(
			'title' => 'Teste',
			'minItems' => 1,
		)
	);
	expect( $schema )->toMatchArray(
		array(
			'type' => 'array',
			'items' => array(
				'type' => null,
				'anyOf' => array(
					'type' => 'string',
					'format' => 'url'
				)
			),
			'title' => 'Teste',
			'minItems' => 1,
		)
	);
} );

test( 'method object_schema', function () {
	$generator = new GeneratorTestCase();
	$schema = $generator->object_schema(
		array(
			'url' => $generator->string_schema(
				array(
					'format' => 'url'
				)
			)
		),
		array(
			'title' => 'Teste',
			'required' => array( 'url' ),
		)
	);
	expect( $schema )->toMatchArray(
		array(
			'type' => 'object',
			'properties' => array(
				'url' => array(
					'type' => 'string',
					'format' => 'url'
				)
			),
			'title' => 'Teste',
			'required' => array( 'url' ),
			'additionalProperties' => false,
		)
	);
} );