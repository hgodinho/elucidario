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

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

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
	 * Errors.
	 *
	 * @var array
	 */
	public $errors;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_validator();
	}

	/**
	 * Initialize validator.
	 */
	private function init_validator() {
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
	 * @param mixed  $data
	 *
	 * @return bool
	 */
	public function validate( string $schema, mixed $data = null, array $options = array() ) {
		/** @var ValidationResult $result  */
		$result = $this->get_validator()->validate( $data, $this->id_map( $schema, $options ) );
		if ( $result->isValid() ) {
			return true;
		}

		echo '<pre>';
		print_r( ( new ErrorFormatter() )->format( $result->error() ) );
		echo '</pre>';

		throw new \Exception( __( 'Schema not valid.', 'lcdr' ) );
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
	public function id_map( string $id, $options = array() ) {
		$id_map = "https://elucidario.art/mdorim/{$id}.json";

		if ( isset( $options['map']['query'] ) ) {
			$id_map .= '#/' . implode( '/', $options['map']['query'] );
		}

		return $id_map;
	}

	/**
	 * Set schema.
	 *
	 * @return void
	 */
	// public function set_schema() {
	// try {
	// $this->schema = json_decode(
	// file_get_contents(
	// LCDR_PATH
	// . 'node_modules/@elucidario/pkg-mdorim/static/mdorim/schemas/mdorim/'
	// . lcdr_camel_to_snake( $this->type )
	// . '.json'
	// )
	// );
	// } catch (\Exception $err) {
	// $this->schema = null;
	// throw new \Exception( 'Schema not found.' );
	// }
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
