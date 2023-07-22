<?php
/**
 * Schema class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Mdorim;

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! defined( 'LCDR_PATH' ) )
	exit;

class Schema {
	/**
	 * Type.
	 * 
	 * @var string
	 */
	public $type;

	/**
	 * Data.
	 * 
	 * @var object|null
	 */
	public $data;

	/**
	 * JSON-Schema
	 * 
	 * @var object
	 */
	protected $schema;

	/**
	 * Constructor.
	 * 
	 * @param string $type Schema type.
	 * @param object|null $data Schema data.
	 */
	public function __construct( string $type, object|null $data = null ) {
		$this->type = $type;
		$this->data = $data;
	}

	/**
	 * Validate data against specified schema.
	 * 
	 * @param object|null $data
	 * 
	 * @return bool|\Exception
	 */
	public function validate( $data = null ) {
		if ( ! $data ) {
			$data = $this->data;
		}
		return true;
	}

	/**
	 * Set data
	 * 
	 * @param object|null $data
	 * @return void
	 */
	public function set_data( object|null $data = null ) {
		$this->data = $data;
	}


	/**
	 * Set schema.
	 * 
	 * @return void
	 */
	public function set_schema() {
		try {
			$this->schema = json_decode(
				file_get_contents(
					LCDR_PATH
					. 'node_modules/@elucidario/pkg-mdorim/static/mdorim/schemas/mdorim/'
					. lcdr_camel_to_snake( $this->type )
					. '.json'
				)
			);
		} catch (\Exception $err) {
			$this->schema = null;
			throw new \Exception( 'Schema not found.' );
		}
	}

	/**
	 * Get schema.
	 * 
	 * @return object
	 */
	public function get_schema() {
		return $this->schema;
	}
}