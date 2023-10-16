<?php
/**
 * Schema class.
 *
 * @since 0.3.0
 * @package elucidario/pkg-core
 */

namespace Mdorim\Schema;

use \Opis\JsonSchema\{
	Validator as BaseValidator,
	Errors\ValidationError,
};


use \Opis\JsonSchema\Errors\ErrorFormatter;

class Schemas {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \Mdorim\Traits\Singleton, \Mdorim\Traits\Debug;

	const SCHEMA_PATH = MDORIM_PATH
		. DIRECTORY_SEPARATOR
		. "static"
		. DIRECTORY_SEPARATOR
		. "mdorim"
		. DIRECTORY_SEPARATOR
		. "schemas"
		. DIRECTORY_SEPARATOR;

	/**
	 * Schema validator.
	 *
	 * @var BaseValidator
	 */
	public $validator;

	/**
	 *                  __    ___
	 *     ____  __  __/ /_  / (_)____
	 *    / __ \/ / / / __ \/ / / ___/
	 *   / /_/ / /_/ / /_/ / / / /__
	 *  / .___/\__,_/_.___/_/_/\___/
	 * /_/
	 */
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->init_validator();
	}

	/**
	 * Initialize validator.
	 */
	public function init_validator() {
		$this->validator = new BaseValidator();
		$this->validator->resolver()->registerPrefix(
			'https://elucidario.art/mdorim/schemas',
			self::SCHEMA_PATH
		);
	}

	/**
	 * Get id.
	 *
	 * @return string
	 */
	public function id_map( string $id, $options = array() ) {
		return sprintf( 'https://elucidario.art/mdorim/schemas/%s.json%s', $id, $this->parse_id_map_options( $options ) );
	}

	/**
	 * Validate data against specified schema.
	 *
	 * @param string $schema  The URI of the schema to validate against.
	 * @param mixed  $data    The data that should be validated.
	 * @param array  $options Validation options.
	 * 
	 * @return bool
	 * 
	 * @throws \Exception
	 */
	public function validate( string $schema, mixed $data = null, ?array $options = array() ) {
		$result = $this->validator->validate( $data, $this->id_map( $schema, $options ) );
		if ( $result->isValid() ) {
			return true;
		}
		throw new \Exception( $this->pretty_print_error( $result->error() ) );
	}

	/**
	 * Returns a schema.
	 *
	 * @param string $path
	 * @return array
	 */
	public function get_schema( string $path ) {
		$path = $this->parse_path( $path );

		$validator = $this->validator;
	}

	/**
	 *                 _             __
	 *     ____  _____(_)   ______ _/ /____
	 *    / __ \/ ___/ / | / / __ `/ __/ _ \
	 *   / /_/ / /  / /| |/ / /_/ / /_/  __/
	 *  / .___/_/  /_/ |___/\__,_/\__/\___/
	 * /_/
	 */
	/**
	 * Parse id_map options.
	 *
	 * @param array $options Options to parse.
	 * @param boolean $recursive If is recursive.
	 * @return void|string Void if empty, string if not.
	 */
	private function parse_id_map_options( array $options, $recursive = false ) {
		if ( empty( $options ) ) {
			return;
		}

		$uri = '';
		if ( ! $recursive ) {
			$uri = '#';
		}
		$uri .= '/';

		foreach ( $options as $key => $value ) {
			if ( is_string( $value ) ) {
				$uri .= $key . '/' . $value;
				return $uri;
			} elseif ( ! array_is_list( $value ) ) {
				$uri .= $key;
				$uri .= $this->parse_id_map_options( $value, true );
			}
		}

		return $uri;
	}

	/**
	 * Parses a path.
	 *
	 * @param string $path
	 * @return string
	 */
	private function parse_path( string $path ) {
		if ( str_contains( $path, '/' ) ) {
			$path = str_replace( '/', DIRECTORY_SEPARATOR, $path );
		} elseif ( str_contains( $path, '\\' ) ) {
			$path = str_replace( '\\', DIRECTORY_SEPARATOR, $path );
		}
		return self::SCHEMA_PATH . $path . '.json';
	}

	/**
	 * Pretty print error.
	 *
	 * @param ValidationError $error Error to print.   
	 * @return string
	 */
	private function pretty_print_error( $error ) {
		$error_formatter = new ErrorFormatter();
		$error = $error_formatter->format( $error, true );
		return "\n\n" . $this->pretty_error( $error ) . "\n";
	}

	/**
	 * Pretty error.
	 *
	 * @param array $error
	 * @param integer $indent
	 * @return string
	 */
	private function pretty_error( $error, $indent = 0 ) {
		$result = '';
		foreach ( $error as $key => $value ) {
			// Indentation
			$result .= str_repeat( '│   ', $indent );
			// Add folder icon and key
			$result .= "├── {$key}\n";
			// Recursively process sub-arrays
			if ( is_array( $value ) ) {
				$result .= $this->pretty_error( $value, $indent + 1 );
			} else {
				// Add file icon for non-array values
				$result .= str_repeat( '│   ', $indent + 1 ) . "├── {$value}\n";
			}
		}
		return $result;
	}
}