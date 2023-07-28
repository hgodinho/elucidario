<?php

/**
 * Schema class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim;

use \Opis\JsonSchema\{
	Validator,
	ValidationResult,
};

use \Opis\JsonSchema\Errors\ErrorFormatter;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

/**
 * Schema class.
 */
class Schema {
	/**
	 * Schema validator.
	 *
	 * @var Validator
	 */
	protected $validator;

	/**
	 * JSON-Schema
	 * 
	 * @var array
	 */
	protected $schemas;

	/**
	 * Constructor.
	 * 
	 * @param string $type Schema type.
	 * @param object|null $data Schema data.
	 */
	public function __construct() {
		$this->init_validator();
	}

	/**
	 * Initialize validator.
	 * 
	 * @return void
	 */
	public function init_validator() {
		$this->validator = new Validator();
		$this->validator->resolver()->registerPrefix(
			'https://elucidario.art/mdorim',
			LCDR_PATH . 'node_modules/@elucidario/pkg-mdorim/static/mdorim'
		);
	}

	/**
	 * Validate data against specified schema.
	 * 
	 * @param string $schema
	 * @param mixed $data
	 * 
	 * @return bool
	 */
	public function validate( string $schema, mixed $data = null ) {
		/** @var ValidationResult $result  */
		$result = $this->get_validator()->validate( $data, $this->id_map( $schema ) );
		if ( $result->isValid() ) {
			return true;
		}
		$errors = ( new ErrorFormatter() )->format( $result->error() );
		var_dump( $errors );
		return false;
	}

	public function select( string $schema_name ) {
	}

	/**
	 * Get validator.
	 * 
	 * @return Validator
	 */
	public function get_validator() {
		return $this->validator;
	}

	/**
	 * Get id.
	 * 
	 * @return string
	 */
	public function id_map( $id ) {
		$id_map = "https://elucidario.art/mdorim/{$id}.json";
		return $id_map;
	}

	/**
	 * Set schema.
	 * 
	 * @return void
	 */
	// public function set_schema() {
	// 	try {
	// 		$this->schema = json_decode(
	// 			file_get_contents(
	// 				LCDR_PATH
	// 				. 'node_modules/@elucidario/pkg-mdorim/static/mdorim/schemas/mdorim/'
	// 				. lcdr_camel_to_snake( $this->type )
	// 				. '.json'
	// 			)
	// 		);
	// 	} catch (\Exception $err) {
	// 		$this->schema = null;
	// 		throw new \Exception( 'Schema not found.' );
	// 	}
	// }

	/**
	 * Get schemas.
	 * 
	 * @return array
	 */
	public function get_schemas() {
		return $this->schemas;
	}
}